// ============================================================
// IP General Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .ip-general-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IpBlock } from "../../ip.types";
import { ipGeneralService } from "./GeneralTab.service";
import "./GeneralTab.css";

export default function GeneralTab() {
  const { t } = useTranslation("network/ip/general");
  const { t: tCommon } = useTranslation("common");
  const [ips, setIps] = useState<{ ip: string; details?: IpBlock }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    loadIps();
  }, []);

  const loadIps = async () => {
    try {
      setLoading(true);
      const data = await ipGeneralService.getAllIpsWithDetails();
      setIps(data);
    } finally {
      setLoading(false);
    }
  };

  const filtered = ips.filter((item) => {
    const matchSearch =
      item.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === "all" || item.details?.type === filterType;
    return matchSearch && matchType;
  });

  const ipTypes = [...new Set(ips.map((i) => i.details?.type).filter(Boolean))];

  if (loading) {
    return <div className="ip-general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="ip-general-tab">
      <div className="ip-general-filters">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ip-general-search"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="ip-general-select"
        >
          <option value="all">{t("filters.allTypes")}</option>
          {ipTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <span className="ip-general-count">
          {filtered.length} / {ips.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="ip-general-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="ip-general-table">
          <thead>
            <tr>
              <th>{t("table.ip")}</th>
              <th>{t("table.type")}</th>
              <th>{t("table.description")}</th>
              <th>{t("table.routedTo")}</th>
              <th>{t("table.country")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.ip}>
                <td className="ip-general-cell-mono">{item.ip}</td>
                <td>
                  {item.details ? (
                    <span
                      className={`ip-general-badge ${ipGeneralService.getTypeBadgeClass(item.details.type)}`}
                    >
                      {item.details.type}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{item.details?.description || "-"}</td>
                <td className="ip-general-cell-mono">
                  {item.details?.routedTo?.serviceName || "-"}
                </td>
                <td>{item.details?.country || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
