// ============================================================
// LICENSE - Dashboard des licences OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as licenseService from "../../services/license";
import "./styles.css";

// ============================================================
// TYPES
// ============================================================

interface LicenseCount {
  type: string;
  count: number;
  icon: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Dashboard des licences. Affiche un résumé de toutes les licences par type. */
export default function LicenseDashboard() {
  const { t } = useTranslation("license/index");

  // ---------- STATE ----------
  const [counts, setCounts] = useState<LicenseCount[]>([]);
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
      const data = await licenseService.getLicenseCounts();
      setCounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="page-content license-dashboard">
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
        <div className="license-grid">
          <Link to="/license/windows" className="license-card">
            <div className="license-icon">🪟</div>
            <div className="license-info">
              <h3>{t("types.windows")}</h3>
              <span className="license-count">{counts.find(c => c.type === "windows")?.count || 0}</span>
            </div>
          </Link>

          <Link to="/license/cpanel" className="license-card">
            <div className="license-icon">🎛️</div>
            <div className="license-info">
              <h3>{t("types.cpanel")}</h3>
              <span className="license-count">{counts.find(c => c.type === "cpanel")?.count || 0}</span>
            </div>
          </Link>

          <Link to="/license/plesk" className="license-card">
            <div className="license-icon">🔧</div>
            <div className="license-info">
              <h3>{t("types.plesk")}</h3>
              <span className="license-count">{counts.find(c => c.type === "plesk")?.count || 0}</span>
            </div>
          </Link>

          <Link to="/license/sqlserver" className="license-card">
            <div className="license-icon">🗄️</div>
            <div className="license-info">
              <h3>{t("types.sqlserver")}</h3>
              <span className="license-count">{counts.find(c => c.type === "sqlserver")?.count || 0}</span>
            </div>
          </Link>

          <Link to="/license/virtuozzo" className="license-card">
            <div className="license-icon">📦</div>
            <div className="license-info">
              <h3>{t("types.virtuozzo")}</h3>
              <span className="license-count">{counts.find(c => c.type === "virtuozzo")?.count || 0}</span>
            </div>
          </Link>

          <Link to="/license/directadmin" className="license-card">
            <div className="license-icon">⚙️</div>
            <div className="license-info">
              <h3>{t("types.directadmin")}</h3>
              <span className="license-count">{counts.find(c => c.type === "directadmin")?.count || 0}</span>
            </div>
          </Link>

          <Link to="/license/cloudlinux" className="license-card">
            <div className="license-icon">☁️</div>
            <div className="license-info">
              <h3>{t("types.cloudlinux")}</h3>
              <span className="license-count">{counts.find(c => c.type === "cloudlinux")?.count || 0}</span>
            </div>
          </Link>
        </div>
      )}

      <section className="info-section">
        <h2>{t("info.title")}</h2>
        <p>{t("info.description")}</p>
        <a href="https://www.ovhcloud.com/fr/bare-metal/os/licenses/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          {t("info.orderLink")}
        </a>
      </section>
    </div>
  );
}
