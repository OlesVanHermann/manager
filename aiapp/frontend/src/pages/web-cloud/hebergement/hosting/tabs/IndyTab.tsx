// ============================================================
// INDY TAB - Gestion des IP indépendantes
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface IndyTabProps {
  serviceName: string;
}

interface Indy {
  login: string;
  home: string;
  state: "off" | "rw";
  attachedDomains: string[];
}

export function IndyTab({ serviceName }: IndyTabProps) {
  const { t } = useTranslation("web-cloud/hosting/tabs/indy");
  const [loading, setLoading] = useState(true);
  const [indys, setIndys] = useState<Indy[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadIndys = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hostingService.getIndys(serviceName);
      setIndys(data || []);
    } catch (err) {
      console.error("[IndyTab] Error:", err);
      setIndys([]);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadIndys(); }, [loadIndys]);

  const filtered = indys.filter(i => 
    !search || i.login.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleDomainClick = (domain: string) => {
    console.log("[IndyTab] Navigate to domain:", domain);
  };

  return (
    <div className="indy-tab">
      <div className="tab-header">
        <h3>{t("title")}</h3>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="btn-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
          <button className="btn btn-icon" onClick={loadIndys} disabled={loading}>
            🔄
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>{t("loading")}</span>
        </div>
      ) : indys.length === 0 ? (
        <div className="empty-state">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("columns.login")}</th>
                <th>{t("columns.home")}</th>
                <th className="text-center">{t("columns.state")}</th>
                <th>{t("columns.domains")}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((indy, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{indy.login}</td>
                  <td className="text-muted">{indy.home}</td>
                  <td className="text-center">
                    <span className={`badge ${indy.state === "rw" ? "badge-success" : "badge-error"}`}>
                      {t(`state.${indy.state}`)}
                    </span>
                  </td>
                  <td>
                    <ul className="domain-list">
                      {indy.attachedDomains.map((domain, i) => (
                        <li key={i}>
                          <button 
                            className="btn-link"
                            onClick={() => handleDomainClick(domain)}
                          >
                            {domain}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                ←
              </button>
              <span>{t("pagination", { current: page, total: totalPages })}</span>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default IndyTab;
