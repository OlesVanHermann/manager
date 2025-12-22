// ============================================================
// HOSTING TAB: SSL - Certificats SSL
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, SslCertificate, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { ImportSslModal } from "../components/ImportSslModal";

interface Props { serviceName: string; }

/** Onglet SSL avec gestion des certificats. */
export function SslTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [ssl, setSsl] = useState<SslCertificate | null>(null);
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [activatingDomain, setActivatingDomain] = useState<string | null>(null);

  // ---------- LOAD ----------
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

  // ---------- HANDLERS ----------
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

  // ---------- HELPERS ----------
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

  // ---------- RENDER ----------
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

      {/* Current SSL Certificate */}
      {ssl ? (
        <section className="ssl-info">
          <h4>Certificat actuel</h4>
          <div className="info-grid-2col">
            <div className="info-item">
              <label>{t("ssl.mainDomain")}</label>
              <span>{ssl.domain || serviceName}</span>
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

          <div className="ssl-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleRegenerate}
              disabled={regenerating || ssl.status !== "created"}
            >
              {regenerating ? "Régénération..." : "🔄 Régénérer le certificat"}
            </button>
            <button className="btn btn-danger" onClick={handleDeleteSsl}>
              🗑 Supprimer le certificat
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
      <section className="ssl-domains">
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

      {/* External links */}
      <section className="ssl-order">
        <h4>Certificats payants</h4>
        <p>Besoin d'un certificat OV ou EV ? Commandez un certificat Sectigo.</p>
        <a 
          href={`https://www.ovh.com/manager/#/web/hosting/${serviceName}/ssl/order`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          {t("ssl.orderSectigo")} ↗
        </a>
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
