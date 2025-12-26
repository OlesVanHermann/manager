// ============================================================
// GENERAL TAB - Composant isolé pour Private Cloud Dashboard
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { ServiceCount } from "../../general.types";
import { generalService } from "./GeneralTab.service";
import "./GeneralTab.css";

// ========================================
// COMPOSANT
// ========================================

export default function GeneralTab() {
  const { t } = useTranslation("private-cloud/general/general");
  const { t: tCommon } = useTranslation("common");

  const [counts, setCounts] = useState<ServiceCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generalService.getServiceCounts();
      setCounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getCount = (type: string): number => {
    return counts.find((c) => c.type === type)?.count || 0;
  };

  if (loading) {
    return <div className="general-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="general-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadCounts}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="general-tab">
      <header className="general-header">
        <h1>{t("title")}</h1>
        <p className="general-description">{t("description")}</p>
      </header>

      <div className="general-service-grid">
        <Link to="/private-cloud/vmware" className="general-service-card">
          <div className="general-service-icon">🖥️</div>
          <div className="general-service-info">
            <h3>{t("types.vmware")}</h3>
            <p className="general-service-description">{t("descriptions.vmware")}</p>
            <span className="general-service-count">
              {getCount("vmware")} {t("services")}
            </span>
          </div>
        </Link>

        <Link to="/private-cloud/nutanix" className="general-service-card">
          <div className="general-service-icon">🔷</div>
          <div className="general-service-info">
            <h3>{t("types.nutanix")}</h3>
            <p className="general-service-description">{t("descriptions.nutanix")}</p>
            <span className="general-service-count">
              {getCount("nutanix")} {t("services")}
            </span>
          </div>
        </Link>

        <Link to="/private-cloud/managed-baremetal" className="general-service-card">
          <div className="general-service-icon">🏗️</div>
          <div className="general-service-info">
            <h3>{t("types.managedBaremetal")}</h3>
            <p className="general-service-description">{t("descriptions.managedBaremetal")}</p>
            <span className="general-service-count">
              {getCount("managedBaremetal")} {t("services")}
            </span>
          </div>
        </Link>

        <Link to="/private-cloud/sap" className="general-service-card">
          <div className="general-service-icon">💎</div>
          <div className="general-service-info">
            <h3>{t("types.sap")}</h3>
            <p className="general-service-description">{t("descriptions.sap")}</p>
            <span className="general-service-count">
              {getCount("sap")} {t("services")}
            </span>
          </div>
        </Link>

        <Link to="/private-cloud/veeam" className="general-service-card">
          <div className="general-service-icon">💾</div>
          <div className="general-service-info">
            <h3>{t("types.veeam")}</h3>
            <p className="general-service-description">{t("descriptions.veeam")}</p>
            <span className="general-service-count">
              {getCount("veeam")} {t("services")}
            </span>
          </div>
        </Link>
      </div>

      <section className="general-info-section">
        <h2>{t("info.title")}</h2>
        <p>{t("info.description")}</p>
        <a
          href="https://www.ovhcloud.com/fr/hosted-private-cloud/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          {t("info.learnMore")}
        </a>
      </section>
    </div>
  );
}
