// ============================================================
// CARBON > GENERAL TAB - Calculatrice empreinte carbone OVHcloud
// Préfixe CSS : .general-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as generalService from "./GeneralTab.service";
import "./GeneralTab.css";

// ============ COMPOSANT ============

/** Affiche l'empreinte carbone des services OVHcloud avec graphique et détails. */
export function GeneralTab() {
  const { t } = useTranslation('general/carbon/general');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<generalService.CarbonSummary | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // ---------- EFFECTS ----------
  useEffect(() => { loadCarbonData(); }, []);

  // ---------- LOADERS ----------
  const loadCarbonData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generalService.getAccountCarbonFootprint();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDownload = async () => {
    const blob = await generalService.downloadCarbonReport();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carbon-report-${new Date().toISOString().slice(0, 7)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // ---------- HELPERS ----------
  const formatCO2 = (kg: number) => {
    if (kg >= 1000) return (kg / 1000).toFixed(2) + " t";
    return kg.toFixed(2) + " kg";
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  };

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // ---------- RENDER ----------
  return (
    <div className="general-container">
      <div className="general-page-header">
        <h1>{t('title')}</h1>
        <p className="general-page-description">{t('description')}</p>
      </div>

      {/* Section explicative */}
      <div className="general-section">
        <h2>{t('composition.title')}</h2>
        <p>{t('composition.intro')}</p>
        
        <div className="general-formula">
          <div className="general-formula-item">
            <div className="general-formula-icon">🏭</div>
            <span>{t('composition.manufacturing')}</span>
          </div>
          <span className="general-formula-operator">+</span>
          <div className="general-formula-item">
            <div className="general-formula-icon">⚡</div>
            <span>{t('composition.electricity')}</span>
          </div>
          <span className="general-formula-operator">+</span>
          <div className="general-formula-item">
            <div className="general-formula-icon">⚙️</div>
            <span>{t('composition.operations')}</span>
          </div>
          <span className="general-formula-operator">=</span>
          <div className="general-formula-item general-result">
            <div className="general-formula-icon">🌍</div>
            <span>{t('composition.emissions')}</span>
          </div>
        </div>
      </div>

      {/* Données carbone */}
      {loading ? (
        <div className="general-section">
          <div className="general-loading-state">
            <div className="general-spinner"></div>
            <p>{t('loading')}</p>
          </div>
        </div>
      ) : error ? (
        <div className="general-section">
          <div className="general-error-banner">
            {error}
            <button onClick={loadCarbonData} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>
              {tCommon('actions.refresh')}
            </button>
          </div>
        </div>
      ) : summary ? (
        <>
          {/* Résumé global */}
          <div className="general-section general-summary-card">
            <div className="general-summary-header">
              <h2>{t('summary.title')}</h2>
              <span className="general-period-badge">
                {formatDate(summary.period.from)} - {formatDate(summary.period.to)}
              </span>
            </div>

            <div className="general-total">
              <span className="general-total-value">{formatCO2(summary.totalCO2eKg)}</span>
              <span className="general-total-label">CO₂e</span>
            </div>

            <p className="general-services-count">{t('summary.servicesCount', { count: summary.totalServices })}</p>

            {/* Graphique barres */}
            <div className="general-breakdown">
              <h3>{t('summary.breakdown')}</h3>
              <div className="general-breakdown-bars">
                <div className="general-bar-item">
                  <div className="general-bar-label">
                    <span>🏭 {t('composition.manufacturing')}</span>
                    <span>{formatCO2(summary.byCategory.manufacturing)} ({getPercentage(summary.byCategory.manufacturing, summary.totalCO2eKg)}%)</span>
                  </div>
                  <div className="general-bar-track">
                    <div className="general-bar-fill general-manufacturing" style={{ width: getPercentage(summary.byCategory.manufacturing, summary.totalCO2eKg) + "%" }}></div>
                  </div>
                </div>
                <div className="general-bar-item">
                  <div className="general-bar-label">
                    <span>⚡ {t('composition.electricity')}</span>
                    <span>{formatCO2(summary.byCategory.electricity)} ({getPercentage(summary.byCategory.electricity, summary.totalCO2eKg)}%)</span>
                  </div>
                  <div className="general-bar-track">
                    <div className="general-bar-fill general-electricity" style={{ width: getPercentage(summary.byCategory.electricity, summary.totalCO2eKg) + "%" }}></div>
                  </div>
                </div>
                <div className="general-bar-item">
                  <div className="general-bar-label">
                    <span>⚙️ {t('composition.operations')}</span>
                    <span>{formatCO2(summary.byCategory.operations)} ({getPercentage(summary.byCategory.operations, summary.totalCO2eKg)}%)</span>
                  </div>
                  <div className="general-bar-track">
                    <div className="general-bar-fill general-operations" style={{ width: getPercentage(summary.byCategory.operations, summary.totalCO2eKg) + "%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="general-actions">
              <button onClick={() => setShowDetails(!showDetails)} className="btn btn-secondary">
                {showDetails ? t('actions.hideDetails') : t('actions.showDetails')}
              </button>
              <button onClick={handleDownload} className="btn btn-primary">
                {t('actions.download')}
              </button>
            </div>
          </div>

          {/* Détails par service */}
          {showDetails && summary.services.length > 0 && (
            <div className="general-section">
              <h3>{t('details.title')}</h3>
              <div className="general-table-container">
                <table className="general-table">
                  <thead>
                    <tr>
                      <th>{t('details.service')}</th>
                      <th>{t('details.type')}</th>
                      <th>{t('composition.manufacturing')}</th>
                      <th>{t('composition.electricity')}</th>
                      <th>{t('composition.operations')}</th>
                      <th>{t('details.total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.services.map((svc, idx) => (
                      <tr key={idx}>
                        <td className="general-service-name">{svc.serviceName}</td>
                        <td>{svc.serviceType}</td>
                        <td>{formatCO2(svc.breakdown.manufacturing)}</td>
                        <td>{formatCO2(svc.breakdown.electricity)}</td>
                        <td>{formatCO2(svc.breakdown.operations)}</td>
                        <td><strong>{formatCO2(svc.totalCO2eKg)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Pas de données - afficher info */
        <div className="general-section">
          <div className="general-empty-state">
            <p>{t('noData.message')}</p>
            <p className="general-empty-hint">{t('noData.hint')}</p>
          </div>
        </div>
      )}

      {/* Info méthodologie */}
      <div className="general-section">
        <h2>{t('methodology.title')}</h2>
        <p>{t('methodology.description')}</p>
        <ul className="general-list">
          <li dangerouslySetInnerHTML={{ __html: t('services.baremetal') }} />
          <li dangerouslySetInnerHTML={{ __html: t('services.hpc') }} />
          <li dangerouslySetInnerHTML={{ __html: t('services.publicCloud') }} />
        </ul>
        <p dangerouslySetInnerHTML={{ __html: t('services.billingContact') }} />
      </div>

      {/* Lien documentation */}
      <div className="general-section general-info">
        <h3>{t('info.title')}</h3>
        <p>{t('info.description')}</p>
        <a href="https://corporate.ovhcloud.com/fr/sustainability/environment/" target="_blank" rel="noopener noreferrer" className="general-info-link">
          {t('info.learnMore')}
        </a>
      </div>
    </div>
  );
}
