// ============================================================
// HOSTING TAB: LOCAL SEO - Visibilité Pro
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, LocalSeoAccount } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Visibilité Pro (Local SEO). */
export function LocalSeoTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [accounts, setAccounts] = useState<LocalSeoAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listLocalSeoAccounts(serviceName);
      if (ids.length > 0) {
        const data = await Promise.all(ids.map(id => hostingService.getLocalSeoAccount(serviceName, id)));
        setAccounts(data);
      } else {
        setAccounts([]);
      }
    } catch (err) { 
      // Si 404, c'est normal - pas de compte Local SEO
      setAccounts([]);
    }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  const handleTerminate = async (id: number) => {
    if (!confirm(t("localSeo.confirmTerminate"))) return;
    try {
      await hostingService.terminateLocalSeo(serviceName, id);
      loadAccounts();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleActivate = () => {
    window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/local-seo/order`, '_blank');
  };

  const handleManage = (id: number) => {
    window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/local-seo/${id}`, '_blank');
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  const hasAccounts = accounts.length > 0;

  return (
    <div className="localseo-tab">
      <div className="tab-header">
        <div>
          <h3>{t("localSeo.title")}</h3>
          <p className="tab-description">{t("localSeo.description")}</p>
        </div>
      </div>

      {hasAccounts ? (
        <>
          {/* Liste des comptes Local SEO */}
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("localSeo.offer")}</th>
                <th>{t("localSeo.country")}</th>
                <th>Statut</th>
                <th>{t("localSeo.since")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id}>
                  <td>{account.offer || 'Visibilité Pro'}</td>
                  <td>{account.country || 'FR'}</td>
                  <td>
                    <span className={`badge ${account.status === 'active' ? 'success' : 'warning'}`}>
                      {account.status === 'active' ? 'Actif' : account.status}
                    </span>
                  </td>
                  <td>{account.creationDate ? new Date(account.creationDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleManage(account.id)}>
                        {t("localSeo.manage")}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleTerminate(account.id)}>
                        {t("localSeo.terminate")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {/* Promotion Visibilité Pro */}
          <div className="promo-section">
            <h4>{t("localSeo.promoTitle")}</h4>
            <p>{t("localSeo.promoDesc")}</p>

            <div className="features-grid" style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <span>{t("localSeo.feature1")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span>{t("localSeo.feature2")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>{t("localSeo.feature3")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📍</span>
                <span>{t("localSeo.feature4")}</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleActivate}>
              {t("localSeo.activate")}
            </button>
          </div>

          <section className="info-section" style={{ marginTop: 'var(--space-6)' }}>
            <h4>{t("localSeo.whatIs")}</h4>
            <p>{t("localSeo.explanation")}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default LocalSeoTab;
