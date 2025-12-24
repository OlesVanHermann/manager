// ============================================================
// HOSTING TAB: SSL - Certificats SSL
// Target: target_.web-cloud.hebergement.hosting.ssl.svg
// Utilise UNIQUEMENT attachedDomain (pas /ssl qui peut échouer)
// ============================================================

import "./ssl.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../../services/web-cloud.hosting";
import { ImportSslModal } from "./modals";

interface Props { serviceName: string; }

export function SslTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.ssl");
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [regenerateModal, setRegenerateModal] = useState<{ open: boolean; domain: string }>({ open: false, domain: "" });
  const [disableModal, setDisableModal] = useState<{ open: boolean; domain: string }>({ open: false, domain: "" });

  // === LOAD DATA - Utilise UNIQUEMENT attachedDomain ===
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Récupérer la liste des domaines attachés
      const domainNames = await hostingService.listAttachedDomains(serviceName);
      const domainsData = await Promise.all(
        domainNames.map(n => hostingService.getAttachedDomain(serviceName, n))
      );
      
      setDomains(domainsData);
      
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  // === FORMAT HELPERS ===
  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // === STATUS LOGIC basée sur attachedDomain ===
  // ssl: true + status: "created" = SSL actif et fonctionnel
  const getStatusBadge = (d: AttachedDomain) => {
    if (!d.ssl) {
      return { label: "Non activé", className: "ssl-badge-state inactive" };
    }
    // Si ssl=true et status="created", le SSL est actif
    if (d.status === "created" || d.status === "active") {
      return { label: "Actif", className: "ssl-badge-state active" };
    }
    // Autres cas (creating, etc.)
    return { label: "En cours", className: "ssl-badge-state pending" };
  };

  // === FILTER DOMAINS (seulement ceux avec SSL) ===
  const filteredDomains = useMemo(() => {
    let result = domains.filter(d => d.ssl); // Seulement ceux avec SSL=true
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d => d.domain.toLowerCase().includes(term));
    }
    return result;
  }, [domains, searchTerm]);

  // === ACTIONS ===
  const handleExportCsv = () => {
    const headers = ["Domaine principal", "Domaine suppl. (SAN)", "Type de certificat", "state", "creationDate", "expirationDate"];
    const rows = filteredDomains.map(d => {
      const status = getStatusBadge(d);
      return [
        d.domain,
        "-",
        "Let's Encrypt",
        status.label,
        "-", // Pas de date création disponible via attachedDomain
        "-"  // Pas de date expiration disponible via attachedDomain
      ];
    });
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssl-certificates-${serviceName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    setActionLoading(true);
    try {
      await hostingService.regenerateSsl(serviceName);
      alert("Régénération du certificat lancée");
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(false);
      setRegenerateModal({ open: false, domain: "" });
    }
  };

  const handleDisableSsl = async (domain: string) => {
    setActionLoading(true);
    try {
      await hostingService.deactivateDomainSsl(serviceName, domain);
      alert("SSL désactivé pour " + domain);
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(false);
      setDisableModal({ open: false, domain: "" });
    }
  };

  // === RENDER ===
  if (loading) {
    return (
      <div className="ssl-tab">
        <div className="ssl-skeleton-toolbar" />
        <div className="ssl-skeleton-table" />
      </div>
    );
  }

  if (error) return <div className="ssl-error-state">{error}</div>;

  return (
    <div className="ssl-tab">
      {/* ========== TOOLBAR ========== */}
      <div className="ssl-toolbar">
        <button className="ssl-toolbar-refresh" onClick={loadData} title="Actualiser">↻</button>
        <div className="ssl-search-box">
          <input
            type="text"
            placeholder="Rechercher le nom de domaine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="ssl-btn-export" onClick={handleExportCsv}>
          Exporter en CSV <span className="ssl-icon-down">↓</span>
        </button>
      </div>

      {/* ========== TABLE 7 COLONNES ========== */}
      <div className="ssl-table-container">
        <table className="ssl-table">
          <thead>
            <tr>
              <th>Domaine principal</th>
              <th>Domaine suppl. (SAN)</th>
              <th>Type de certificat</th>
              <th>state</th>
              <th>creationDate</th>
              <th>expirationDate</th>
              <th>désactiver</th>
            </tr>
          </thead>
          <tbody>
            {filteredDomains.length === 0 ? (
              <tr>
                <td colSpan={7} className="ssl-empty-row">
                  {searchTerm ? "Aucun résultat" : "Aucun certificat SSL actif"}
                </td>
              </tr>
            ) : (
              filteredDomains.map(d => {
                const status = getStatusBadge(d);
                return (
                  <tr key={d.domain}>
                    {/* Domaine principal */}
                    <td>
                      <a 
                        href={`https://${d.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ssl-domain-link"
                      >
                        {d.domain}
                      </a>
                    </td>

                    {/* SAN */}
                    <td className="ssl-cell-muted">-</td>

                    {/* Type + icônes ⟳ ↑ */}
                    <td>
                      <div className="ssl-type-cell">
                        <span className="ssl-badge-type">Let's Encrypt</span>
                        <button 
                          className="ssl-action-regenerate"
                          onClick={() => setRegenerateModal({ open: true, domain: d.domain })}
                          title="Régénérer le certificat"
                          disabled={actionLoading}
                        >
                          ⟳
                        </button>
                        <button 
                          className="ssl-action-import"
                          onClick={() => setShowImportModal(true)}
                          title="Importer un certificat"
                          disabled={actionLoading}
                        >
                          ↑
                        </button>
                      </div>
                    </td>

                    {/* State - basé sur ssl + status de attachedDomain */}
                    <td>
                      <span className={status.className}>
                        {status.label}
                      </span>
                    </td>

                    {/* Creation date - non disponible via attachedDomain */}
                    <td className="ssl-cell-date">-</td>

                    {/* Expiration date - non disponible via attachedDomain */}
                    <td className="ssl-cell-date">-</td>

                    {/* Désactiver ✕ */}
                    <td>
                      <button 
                        className="ssl-btn-disable"
                        onClick={() => setDisableModal({ open: true, domain: d.domain })}
                        title="Désactiver SSL pour ce domaine"
                        disabled={actionLoading}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========== WARNING BOX ========== */}
      <div className="ssl-warning-box">
        <span className="ssl-warning-icon">⚠️</span>
        <div className="ssl-warning-content">
          <p>Si vous avez ajouté des hébergements multisites il y a moins de deux heures,</p>
          <p>il est possible qu'ils ne soient pas inclus dans votre certificat SSL.</p>
        </div>
      </div>

      {/* ========== MODALS ========== */}
      <ImportSslModal
        serviceName={serviceName}
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={loadData}
      />

      {regenerateModal.open && (
        <div className="ssl-modal-overlay" onClick={() => setRegenerateModal({ open: false, domain: "" })}>
          <div className="ssl-modal" onClick={e => e.stopPropagation()}>
            <div className="ssl-modal-header">
              <h3>Régénérer le certificat</h3>
              <button className="ssl-modal-close" onClick={() => setRegenerateModal({ open: false, domain: "" })}>✕</button>
            </div>
            <div className="ssl-modal-body">
              <p>Voulez-vous régénérer le certificat SSL ?</p>
              <p className="ssl-modal-info">Cette opération peut prendre quelques minutes.</p>
            </div>
            <div className="ssl-modal-footer">
              <button className="ssl-btn-cancel" onClick={() => setRegenerateModal({ open: false, domain: "" })}>Annuler</button>
              <button className="ssl-btn-confirm" onClick={handleRegenerate} disabled={actionLoading}>
                {actionLoading ? "..." : "Régénérer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {disableModal.open && (
        <div className="ssl-modal-overlay" onClick={() => setDisableModal({ open: false, domain: "" })}>
          <div className="ssl-modal" onClick={e => e.stopPropagation()}>
            <div className="ssl-modal-header">
              <h3>Désactiver SSL</h3>
              <button className="ssl-modal-close" onClick={() => setDisableModal({ open: false, domain: "" })}>✕</button>
            </div>
            <div className="ssl-modal-body">
              <p>Voulez-vous désactiver le certificat SSL pour <strong>{disableModal.domain}</strong> ?</p>
              <p className="ssl-modal-warning">⚠️ Le site ne sera plus accessible en HTTPS.</p>
            </div>
            <div className="ssl-modal-footer">
              <button className="ssl-btn-cancel" onClick={() => setDisableModal({ open: false, domain: "" })}>Annuler</button>
              <button className="ssl-btn-danger" onClick={() => handleDisableSsl(disableModal.domain)} disabled={actionLoading}>
                {actionLoading ? "..." : "Désactiver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SslTab;
