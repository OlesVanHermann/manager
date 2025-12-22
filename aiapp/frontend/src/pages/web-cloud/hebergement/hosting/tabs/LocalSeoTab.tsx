// ============================================================
// HOSTING TAB: LOCAL SEO - Visibilité Pro
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface LocalSeoSubscription {
  id: string;
  offer: string;
  country: string;
  status: string;
  creationDate: string;
}

interface Props { serviceName: string; }

/** Onglet Visibilité Pro avec gestion des abonnements. */
export function LocalSeoTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [subscriptions, setSubscriptions] = useState<LocalSeoSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);

  // ---------- LOAD ----------
  const loadSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listLocalSeo(serviceName).catch(() => []);
      if (ids.length > 0) {
        const data = await Promise.all(
          ids.map((id: string) => hostingService.getLocalSeo(serviceName, id))
        );
        setSubscriptions(data);
      }
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadSubscriptions(); }, [loadSubscriptions]);

  // ---------- HANDLERS ----------
  const handleTerminate = async (id: string) => {
    if (!confirm(t("localSeo.confirmTerminate"))) return;
    setTerminating(id);
    try {
      await hostingService.terminateLocalSeo(serviceName, id);
      loadSubscriptions();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setTerminating(null);
    }
  };

  const handleManage = (id: string) => {
    window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/localSeo/${id}`, "_blank");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  // ---------- RENDER ----------
  return (
    <div className="localseo-tab">
      <div className="tab-header">
        <div>
          <h3>{t("localSeo.title")}</h3>
          <p className="tab-description">{t("localSeo.description")}</p>
        </div>
      </div>

      {subscriptions.length > 0 ? (
        <>
          {/* Active subscriptions */}
          <section className="seo-subscriptions">
            <h4>Vos abonnements</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("localSeo.offer")}</th>
                  <th>{t("localSeo.country")}</th>
                  <th>{t("localSeo.since")}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.offer}</td>
                    <td>{sub.country}</td>
                    <td>{formatDate(sub.creationDate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleManage(sub.id)}
                        >
                          {t("localSeo.manage")} ↗
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleTerminate(sub.id)}
                          disabled={terminating === sub.id}
                        >
                          {terminating === sub.id ? "..." : t("localSeo.terminate")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <>
          {/* No subscription - Promo */}
          <section className="seo-promo">
            <div className="promo-icon">📍</div>
            <h4>{t("localSeo.promoTitle")}</h4>
            <p>{t("localSeo.promoDesc")}</p>
          </section>

          {/* Features */}
          <section className="seo-features">
            <h4>Fonctionnalités incluses</h4>
            <ul className="features-list">
              <li>📋 {t("localSeo.feature1")}</li>
              <li>⭐ {t("localSeo.feature2")}</li>
              <li>📊 {t("localSeo.feature3")}</li>
              <li>🗺️ {t("localSeo.feature4")}</li>
            </ul>
          </section>

          {/* What is */}
          <section className="seo-info-box">
            <h4>{t("localSeo.whatIs")}</h4>
            <p>{t("localSeo.explanation")}</p>
          </section>

          {/* Activate link */}
          <section className="seo-actions">
            <a 
              href={`https://www.ovh.com/manager/#/web/hosting/${serviceName}/localSeo/order`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t("localSeo.activate")} ↗
            </a>
          </section>
        </>
      )}
    </div>
  );
}

export default LocalSeoTab;
