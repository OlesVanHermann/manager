// ============================================================
// HOSTING TAB: SSL - Certificats SSL
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, SslCertificate, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { ImportSslModal } from "../components/ImportSslModal";

interface Props { serviceName: string; }

/** Onglet SSL avec workflow complet Let's Encrypt et import. */
export function SslTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [ssl, setSsl] = useState<SslCertificate | null>(null);
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [activating, setActivating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sslData, domainNames] = await Promise.all([
        hostingService.getSsl(serviceName).catch(() => null),
        hostingService.listAttachedDomains(serviceName),
      ]);
      setSsl(sslData);
      
      const domainsData = await Promise.all(domainNames.map(d => hostingService.getAttachedDomain(serviceName, d)));
      setDomains(domainsData);
      
      // Pre-select first domain without SSL
      const eligible = domainsData.filter(d => !d.ssl);
      if (eligible.length > 0) setSelectedDomain(eligible[0].domain);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleActivateLetsEncrypt = async () => {
    if (!selectedDomain) return;
    try {
      setActivating(true);
      await hostingService.enableSsl(serviceName, selectedDomain);
      loadData();
    } catch (err) { alert(String(err)); }
    finally { setActivating(false); }
  };

  const handleExportCsv = () => {
    if (!ssl) return;
    const headers = ['Domaine', 'Type', 'État', 'Création', 'Expiration'];
    const rows = [[
      ssl.domain || serviceName,
      ssl.provider || 'Let\'s Encrypt',
      ssl.status || 'active',
      ssl.creationDate || '-',
      ssl.expirationDate || '-',
    ]];
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ssl-${serviceName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOrderSectigo = () => {
    window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/ssl/order`, '_blank');
  };

  const eligibleDomains = domains.filter(d => !d.ssl);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="ssl-tab">
      <div className="tab-header">
        <div>
          <h3>{t("ssl.title")}</h3>
          <p className="tab-description">{t("ssl.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleOrderSectigo}>
            {t("ssl.orderSectigo")} ↗
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowImportModal(true)}>
            {t("ssl.importOwn")}
          </button>
          {ssl && (
            <button className="btn btn-secondary btn-sm" onClick={handleExportCsv}>
              {t("ssl.exportCsv")}
            </button>
          )}
        </div>
      </div>

      {/* Activation Let's Encrypt */}
      {eligibleDomains.length > 0 && (
        <section className="ssl-activate-section">
          <h4>{t("ssl.activateTitle")}</h4>
          <div className="ssl-activate-row">
            <select 
              className="form-select select-domain"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {eligibleDomains.map(d => (
                <option key={d.domain} value={d.domain}>{d.domain}</option>
              ))}
            </select>
            <button 
              className="btn btn-primary"
              onClick={handleActivateLetsEncrypt}
              disabled={activating || !selectedDomain}
            >
              {activating ? "Activation..." : t("ssl.activateLetsEncrypt")}
            </button>
          </div>
        </section>
      )}

      {/* Current SSL */}
      {ssl ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("ssl.mainDomain")}</th>
              <th>{t("ssl.type")}</th>
              <th>{t("ssl.state")}</th>
              <th>{t("ssl.creationDate")}</th>
              <th>{t("ssl.expirationDate")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-mono">{ssl.domain || serviceName}</td>
              <td>{ssl.provider || 'Let\'s Encrypt'}</td>
              <td>
                <span className={`badge ${ssl.status === 'active' || ssl.status === 'created' ? 'success' : 'warning'}`}>
                  {ssl.status === 'active' || ssl.status === 'created' ? 'Actif' : ssl.status}
                </span>
              </td>
              <td>{ssl.creationDate ? new Date(ssl.creationDate).toLocaleDateString() : '-'}</td>
              <td>{ssl.expirationDate ? new Date(ssl.expirationDate).toLocaleDateString() : '-'}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>{t("ssl.empty")}</p>
        </div>
      )}

      {/* Domains SSL status */}
      <section style={{ marginTop: 'var(--space-6)' }}>
        <h4>État SSL par domaine</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>Domaine</th>
              <th>SSL</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(d => (
              <tr key={d.domain}>
                <td className="font-mono">{d.domain}</td>
                <td>
                  <span className={`badge ${d.ssl ? 'success' : 'inactive'}`}>
                    {d.ssl ? 'Actif' : 'Inactif'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ImportSslModal
        serviceName={serviceName}
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

export default SslTab;
