// ============================================================
// HOSTING TAB: SSL - Certificats SSL (corrigé - sans redirection)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, SslCertificate, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { ImportSslModal } from "../components/ImportSslModal";

interface Props { serviceName: string; }

/** Modal pour commander un certificat Sectigo. */
function OrderSectigoModal({ serviceName, isOpen, onClose }: {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [certType, setCertType] = useState<"DV" | "OV" | "EV">("DV");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOrder = async () => {
    setLoading(true);
    try {
      // Appel API pour commander via /order/cartServiceOption/webHosting
      const result = await hostingService.orderSectigo(serviceName, certType);
      if (result?.url) {
        window.open(result.url, "_blank");
      }
      alert("Redirection vers le bon de commande...");
      onClose();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Commander un certificat Sectigo</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-banner">
            <span className="info-icon">ℹ</span>
            <p>Les certificats Sectigo offrent une validation plus poussée et une meilleure confiance pour vos visiteurs.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Type de certificat</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="certType" value="DV" checked={certType === "DV"} onChange={() => setCertType("DV")} />
                <div>
                  <strong>DV (Domain Validation)</strong>
                  <span className="text-muted">Validation du domaine uniquement</span>
                </div>
              </label>
              <label className="radio-label">
                <input type="radio" name="certType" value="OV" checked={certType === "OV"} onChange={() => setCertType("OV")} />
                <div>
                  <strong>OV (Organization Validation)</strong>
                  <span className="text-muted">Validation de l'organisation</span>
                </div>
              </label>
              <label className="radio-label">
                <input type="radio" name="certType" value="EV" checked={certType === "EV"} onChange={() => setCertType("EV")} />
                <div>
                  <strong>EV (Extended Validation)</strong>
                  <span className="text-muted">Validation étendue - barre verte</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleOrder} disabled={loading}>
            {loading ? "Commande..." : "Commander"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Onglet SSL avec gestion des certificats. */
export function SslTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [ssl, setSsl] = useState<SslCertificate | null>(null);
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSectigoModal, setShowSectigoModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [activatingDomain, setActivatingDomain] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sslData, domainNames] = await Promise.all([
        hostingService.getSsl(serviceName).catch(() => null),
        hostingService.listAttachedDomains(serviceName)
      ]);
      setSsl(sslData);
      const domainDetails = await Promise.all(
        domainNames.map(d => hostingService.getAttachedDomain(serviceName, d))
      );
      setDomains(domainDetails);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRegenerate = async () => {
    if (!confirm("Régénérer le certificat SSL ? Cette opération peut prendre quelques minutes.")) return;
    setRegenerating(true);
    try {
      await hostingService.regenerateSsl(serviceName);
      alert("Régénération demandée. Le nouveau certificat sera actif dans quelques minutes.");
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setRegenerating(false);
    }
  };

  const handleDeleteSsl = async () => {
    if (!confirm("Supprimer le certificat SSL ? Les sites ne seront plus accessibles en HTTPS.")) return;
    try {
      await hostingService.deleteSsl(serviceName);
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    }
  };

  const handleActivateDomain = async (domain: string) => {
    setActivatingDomain(domain);
    try {
      await hostingService.activateSslForDomain(serviceName, domain);
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActivatingDomain(null);
    }
  };

  const handleExportCsv = () => {
    if (!ssl) return;
    const headers = ["Domaine principal", "Type", "État", "Date création", "Date expiration"];
    const rows = [
      [ssl.domain || serviceName, ssl.provider || "-", ssl.status || "-", 
       ssl.creationDate || "-", ssl.expirationDate || "-"]
    ];
    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ssl_${serviceName}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  const getStatusBadge = (status?: string) => {
    const map: Record<string, { class: string; label: string }> = {
      created: { class: "success", label: "Actif" },
      creating: { class: "warning", label: "Création..." },
      deleting: { class: "warning", label: "Suppression..." },
      regenerating: { class: "warning", label: "Régénération..." },
      error: { class: "error", label: "Erreur" },
    };
    return map[status || ""] || { class: "inactive", label: status || "-" };
  };

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
          <button className="btn btn-secondary btn-sm" onClick={handleExportCsv} disabled={!ssl}>
            📊 {t("ssl.exportCsv")}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowImportModal(true)}>
            📥 {t("ssl.importOwn")}
          </button>
        </div>
      </div>

      {/* Current SSL Certificate - Layout SVG: card avec actions à droite */}
      {ssl ? (
        <section className="ssl-card">
          <div className="ssl-card-content">
            <h4>Certificat actuel</h4>
            <div className="info-grid-2col">
              <div className="info-item">
                <label>{t("ssl.mainDomain")}</label>
                <span className="font-mono">{ssl.domain || serviceName}</span>
              </div>
              <div className="info-item">
                <label>{t("ssl.provider")}</label>
                <span>{ssl.provider || "Let's Encrypt"}</span>
              </div>
              <div className="info-item">
                <label>{t("ssl.status")}</label>
                <span className={`badge ${getStatusBadge(ssl.status).class}`}>
                  {getStatusBadge(ssl.status).label}
                </span>
              </div>
              <div className="info-item">
                <label>{t("ssl.type")}</label>
                <span>{ssl.type || "DV"}</span>
              </div>
              <div className="info-item">
                <label>{t("ssl.creationDate")}</label>
                <span>{formatDate(ssl.creationDate)}</span>
              </div>
              <div className="info-item">
                <label>{t("ssl.expirationDate")}</label>
                <span>{formatDate(ssl.expirationDate)}</span>
              </div>
            </div>
          </div>
          <div className="ssl-card-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleRegenerate}
              disabled={regenerating || ssl.status !== "created"}
            >
              🔄 Régénérer le certificat
            </button>
            <button className="btn btn-danger" onClick={handleDeleteSsl}>
              🗑 Supprimer
            </button>
          </div>
        </section>
      ) : (
        <section className="ssl-empty">
          <div className="empty-state">
            <h4>Aucun certificat SSL actif</h4>
            <p>Activez SSL sur vos domaines pour sécuriser vos sites en HTTPS.</p>
          </div>
        </section>
      )}

      {/* Domains without SSL */}
      <section className="ssl-domains-section">
        <h4>{t("ssl.activateTitle")}</h4>
        <p className="section-description">
          Sélectionnez les domaines pour lesquels activer Let's Encrypt.
        </p>

        {domains.filter(d => !d.ssl).length === 0 ? (
          <div className="info-box">
            <p>Tous vos domaines ont déjà SSL activé.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("multisite.domain")}</th>
                <th>{t("ssl.status")}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {domains.filter(d => !d.ssl).map(d => (
                <tr key={d.domain}>
                  <td className="font-mono">{d.domain}</td>
                  <td>
                    <span className="badge inactive">Non activé</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleActivateDomain(d.domain)}
                      disabled={activatingDomain === d.domain}
                    >
                      {activatingDomain === d.domain ? "Activation..." : t("ssl.activateLetsEncrypt")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Certificats payants - SANS REDIRECTION */}
      <section className="ssl-order-section">
        <h4>Certificats payants</h4>
        <p>Besoin d'un certificat OV ou EV ? Commandez un certificat Sectigo.</p>
        <button className="btn btn-secondary" onClick={() => setShowSectigoModal(true)}>
          {t("ssl.orderSectigo")}
        </button>
      </section>

      <ImportSslModal
        serviceName={serviceName}
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={loadData}
      />

      <OrderSectigoModal
        serviceName={serviceName}
        isOpen={showSectigoModal}
        onClose={() => setShowSectigoModal(false)}
      />
    </div>
  );
}

export default SslTab;
