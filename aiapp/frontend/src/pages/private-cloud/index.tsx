// ============================================================
// PRIVATE CLOUD - Dashboard Private Cloud OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as privateCloudService from "../../services/private-cloud";
import "./styles.css";

// ============================================================
// TYPES
// ============================================================

interface ServiceCount {
  type: string;
  count: number;
  icon: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Dashboard Private Cloud. Résumé de tous les services Hosted Private Cloud. */
export default function PrivateCloudDashboard() {
  const { t } = useTranslation("private-cloud/index");

  // ---------- STATE ----------
  const [counts, setCounts] = useState<ServiceCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadCounts();
  }, []);

  // ---------- LOADERS ----------
  const loadCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await privateCloudService.getServiceCounts();
      setCounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="page-content private-cloud-dashboard">
      <header className="page-header">
        <h1>{t("title")}</h1>
        <p className="page-description">{t("description")}</p>
      </header>

      {loading ? (
        <div className="loading-state">{t("loading")}</div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadCounts}>{t("error.retry")}</button>
        </div>
      ) : (
        <div className="service-grid">
          <Link to="/private-cloud/vmware" className="service-card">
            <div className="service-icon">🖥️</div>
            <div className="service-info">
              <h3>{t("types.vmware")}</h3>
              <p className="service-description">{t("descriptions.vmware")}</p>
              <span className="service-count">{counts.find(c => c.type === "vmware")?.count || 0} {t("services")}</span>
            </div>
          </Link>

          <Link to="/private-cloud/nutanix" className="service-card">
            <div className="service-icon">🔷</div>
            <div className="service-info">
              <h3>{t("types.nutanix")}</h3>
              <p className="service-description">{t("descriptions.nutanix")}</p>
              <span className="service-count">{counts.find(c => c.type === "nutanix")?.count || 0} {t("services")}</span>
            </div>
          </Link>

          <Link to="/private-cloud/managed-baremetal" className="service-card">
            <div className="service-icon">🏗️</div>
            <div className="service-info">
              <h3>{t("types.managedBaremetal")}</h3>
              <p className="service-description">{t("descriptions.managedBaremetal")}</p>
              <span className="service-count">{counts.find(c => c.type === "managedBaremetal")?.count || 0} {t("services")}</span>
            </div>
          </Link>

          <Link to="/private-cloud/sap" className="service-card">
            <div className="service-icon">💎</div>
            <div className="service-info">
              <h3>{t("types.sap")}</h3>
              <p className="service-description">{t("descriptions.sap")}</p>
              <span className="service-count">{counts.find(c => c.type === "sap")?.count || 0} {t("services")}</span>
            </div>
          </Link>

          <Link to="/private-cloud/veeam" className="service-card">
            <div className="service-icon">💾</div>
            <div className="service-info">
              <h3>{t("types.veeam")}</h3>
              <p className="service-description">{t("descriptions.veeam")}</p>
              <span className="service-count">{counts.find(c => c.type === "veeam")?.count || 0} {t("services")}</span>
            </div>
          </Link>
        </div>
      )}

      <section className="info-section">
        <h2>{t("info.title")}</h2>
        <p>{t("info.description")}</p>
        <a href="https://www.ovhcloud.com/fr/hosted-private-cloud/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          {t("info.learnMore")}
        </a>
      </section>
    </div>
  );
}
