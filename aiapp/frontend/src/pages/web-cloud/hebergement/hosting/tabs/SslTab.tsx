// ============================================================
// HOSTING TAB: SSL - Certificats SSL
// ============================================================

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, SslCertificate, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { ImportSslModal } from "../components";

interface Props { serviceName: string; }

export function SslTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [ssl, setSsl] = useState<SslCertificate | null>(null);
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals & menus
  const [showImportModal, setShowImportModal] = useState(false);
  const [showOrderMenu, setShowOrderMenu] = useState(false);
  const orderMenuRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sslData, domainNames] = await Promise.all([
        hostingService.getSsl(serviceName).catch(() => null),
        hostingService.listAttachedDomains(serviceName)
      ]);
      setSsl(sslData);
      const domainsData = await Promise.all(domainNames.map(n => hostingService.getAttachedDomain(serviceName, n)));
      setDomains(domainsData);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (orderMenuRef.current && !orderMenuRef.current.contains(e.target as Node)) {
        setShowOrderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const handleGenerateLetsEncrypt = async () => {
    setActionLoading(true);
    try {
      await hostingService.generateLetsEncrypt(serviceName);
      alert("Génération du certificat Let's Encrypt lancée");
      loadData();
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
      setShowOrderMenu(false);
    }
  };

  const handleOrderSectigo = () => {
    window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/ssl/order`, "_blank");
    setShowOrderMenu(false);
  };

  const handleRegenerate = async () => {
    if (!confirm("Voulez-vous régénérer le certificat SSL ?")) return;
    setActionLoading(true);
    try {
      await hostingService.regenerateSsl(serviceName);
      alert("Régénération lancée");
      loadData();
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("ssl.confirmDelete"))) return;
    setActionLoading(true);
    try {
      await hostingService.deleteSsl(serviceName);
      alert("Certificat supprimé");
      loadData();
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // Domaines avec leur statut SSL
  const domainsWithSsl = useMemo(() => {
    return domains.map(d => ({
      ...d,
      sslStatus: d.ssl ? (ssl?.status === "ok" ? "active" : "pending") : "none"
    }));
  }, [domains, ssl]);

  if (loading) {
    return (
      <div className="ssl-tab">
        <div className="skeleton-block" style={{ height: "400px" }} />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="ssl-tab">
      {/* Header avec dropdown */}
      <div className="tab-header">
        <div>
          <h3>{t("ssl.title")}</h3>
          <p className="tab-description">{t("ssl.description")}</p>
        </div>
        <div className="tab-actions">
          <div className="dropdown-container" ref={orderMenuRef}>
            <button 
              className="btn btn-primary"
              onClick={() => setShowOrderMenu(!showOrderMenu)}
              disabled={actionLoading}
            >
              Commander un certificat ▼
            </button>
            {showOrderMenu && (
              <div className="dropdown-menu">
                <button onClick={handleGenerateLetsEncrypt}>
                  🔒 Générer Let's Encrypt (gratuit)
                </button>
                <button onClick={handleOrderSectigo}>
                  🛡️ Commander Sectigo (payant)
                </button>
                <div className="dropdown-divider" />
                <button onClick={() => { setShowImportModal(true); setShowOrderMenu(false); }}>
                  📥 Importer un certificat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Infos certificat actuel */}
      {ssl && (
        <div className="ssl-info-card">
          <div className="ssl-info-header">
            <h4>Certificat actuel</h4>
            <div className="ssl-actions">
              <button className="btn btn-secondary btn-sm" onClick={handleRegenerate} disabled={actionLoading}>
                {t("ssl.regenerate")}
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={actionLoading}>
                {t("ssl.delete")}
              </button>
            </div>
          </div>
          <div className="ssl-info-grid">
            <div className="info-item">
              <span className="info-label">{t("ssl.type")}</span>
              <span className="info-value">{ssl.type || "Let's Encrypt"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t("ssl.provider")}</span>
              <span className="info-value">{ssl.provider || "-"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t("ssl.status")}</span>
              <span className={`badge ${ssl.status === "ok" ? "success" : ssl.status === "creating" ? "info" : "warning"}`}>
                {ssl.status === "ok" ? "Actif" : ssl.status === "creating" ? "En cours" : ssl.status}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">{t("ssl.expirationDate")}</span>
              <span className="info-value">{formatDate(ssl.expirationDate)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Table domaines */}
      <table className="data-table" style={{ marginTop: "1.5rem" }}>
        <thead>
          <tr>
            <th>{t("ssl.domain")}</th>
            <th>{t("ssl.type")}</th>
            <th>{t("ssl.status")}</th>
            <th>{t("ssl.expirationDate")}</th>
            <th>Rapport</th>
          </tr>
        </thead>
        <tbody>
          {domainsWithSsl.map(domain => (
            <tr key={domain.domain}>
              <td className="font-mono">{domain.domain}</td>
              <td>{ssl?.type || "Let's Encrypt"}</td>
              <td>
                {domain.ssl ? (
                  <span className={`badge ${ssl?.status === "ok" ? "success" : ssl?.status === "creating" ? "info" : "warning"}`}>
                    {ssl?.status === "ok" ? "Actif" : ssl?.status === "creating" ? "En cours" : "À générer"}
                  </span>
                ) : (
                  <span className="badge inactive">Non activé</span>
                )}
              </td>
              <td>{domain.ssl ? formatDate(ssl?.expirationDate) : "-"}</td>
              <td>
                {domain.ssl && ssl?.status === "ok" ? (
                  <a 
                    href={`https://www.ssllabs.com/ssltest/analyze.html?d=${domain.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-action"
                  >
                    Voir le rapport
                  </a>
                ) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal import */}
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
