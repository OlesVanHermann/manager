// ============================================================
// CARBON PAGE - Calculatrice empreinte carbone OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as carbonPageService from "./carbon.service";
import "./index.css";

// ============ COMPOSANT ============

/** Affiche l'empreinte carbone des services OVHcloud avec graphique et détails. */
export default function CarbonPage() {
  const { t } = useTranslation('home/carbon/index');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<carbonPageService.CarbonSummary | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // ---------- EFFECTS ----------
  useEffect(() => { loadCarbonData(); }, []);

  // ---------- LOADERS ----------
  const loadCarbonData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carbonPageService.getAccountCarbonFootprint();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDownload = async () => {
    const blob = await carbonPageService.downloadCarbonReport();
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
    <div className="carbon-page">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p className="page-description">{t('description')}</p>
      </div>

      {/* Section explicative */}
      <div className="carbon-section">
        <h2>{t('composition.title')}</h2>
        <p>{t('composition.intro')}</p>
        
        <div className="carbon-formula">
          <div className="formula-item">
            <div className="formula-icon">🏭</div>
            <span>{t('composition.manufacturing')}</span>
          </div>
          <span className="formula-operator">+</span>
          <div className="formula-item">
            <div className="formula-icon">⚡</div>
            <span>{t('composition.electricity')}</span>
          </div>
          <span className="formula-operator">+</span>
          <div className="formula-item">
            <div className="formula-icon">⚙️</div>
            <span>{t('composition.operations')}</span>
          </div>
          <span className="formula-operator">=</span>
          <div className="formula-item result">
            <div className="formula-icon">🌍</div>
            <span>{t('composition.emissions')}</span>
          </div>
        </div>
      </div>

      {/* Données carbone */}
      {loading ? (
        <div className="carbon-section">
          <div className="carbon-loading-state">
            <div className="carbon-spinner"></div>
            <p>{t('loading')}</p>
          </div>
        </div>
      ) : error ? (
        <div className="carbon-section">
          <div className="carbon-error-banner">
            {error}
            <button onClick={loadCarbonData} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>
              {tCommon('actions.refresh')}
            </button>
          </div>
        </div>
      ) : summary ? (
        <>
          {/* Résumé global */}
          <div className="carbon-section carbon-summary-card">
            <div className="summary-header">
              <h2>{t('summary.title')}</h2>
              <span className="period-badge">
                {formatDate(summary.period.from)} - {formatDate(summary.period.to)}
              </span>
            </div>

            <div className="carbon-total">
              <span className="total-value">{formatCO2(summary.totalCO2eKg)}</span>
              <span className="total-label">CO₂e</span>
            </div>

            <p className="services-count">{t('summary.servicesCount', { count: summary.totalServices })}</p>

            {/* Graphique barres */}
            <div className="carbon-breakdown">
              <h3>{t('summary.breakdown')}</h3>
              <div className="breakdown-bars">
                <div className="bar-item">
                  <div className="bar-label">
                    <span>🏭 {t('composition.manufacturing')}</span>
                    <span>{formatCO2(summary.byCategory.manufacturing)} ({getPercentage(summary.byCategory.manufacturing, summary.totalCO2eKg)}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill manufacturing" style={{ width: getPercentage(summary.byCategory.manufacturing, summary.totalCO2eKg) + "%" }}></div>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">
                    <span>⚡ {t('composition.electricity')}</span>
                    <span>{formatCO2(summary.byCategory.electricity)} ({getPercentage(summary.byCategory.electricity, summary.totalCO2eKg)}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill electricity" style={{ width: getPercentage(summary.byCategory.electricity, summary.totalCO2eKg) + "%" }}></div>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">
                    <span>⚙️ {t('composition.operations')}</span>
                    <span>{formatCO2(summary.byCategory.operations)} ({getPercentage(summary.byCategory.operations, summary.totalCO2eKg)}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill operations" style={{ width: getPercentage(summary.byCategory.operations, summary.totalCO2eKg) + "%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="carbon-actions">
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
            <div className="carbon-section">
              <h3>{t('details.title')}</h3>
              <div className="services-table-container">
                <table className="services-table">
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
                        <td className="service-name">{svc.serviceName}</td>
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
        <div className="carbon-section">
          <div className="carbon-empty-state">
            <p>{t('noData.message')}</p>
            <p className="empty-hint">{t('noData.hint')}</p>
          </div>
        </div>
      )}

      {/* Info méthodologie */}
      <div className="carbon-section">
        <h2>{t('methodology.title')}</h2>
        <p>{t('methodology.description')}</p>
        <ul className="carbon-list">
          <li dangerouslySetInnerHTML={{ __html: t('services.baremetal') }} />
          <li dangerouslySetInnerHTML={{ __html: t('services.hpc') }} />
          <li dangerouslySetInnerHTML={{ __html: t('services.publicCloud') }} />
        </ul>
        <p dangerouslySetInnerHTML={{ __html: t('services.billingContact') }} />
      </div>

      {/* Lien documentation */}
      <div className="carbon-section carbon-info">
        <h3>{t('info.title')}</h3>
        <p>{t('info.description')}</p>
        <a href="https://corporate.ovhcloud.com/fr/sustainability/environment/" target="_blank" rel="noopener noreferrer" className="info-link">
          {t('info.learnMore')}
        </a>
      </div>
    </div>
  );
}
