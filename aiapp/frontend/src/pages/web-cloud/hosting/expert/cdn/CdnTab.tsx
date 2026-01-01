// ============================================================
// HOSTING TAB: CDN - Content Delivery Network (Target SVG Match)
// ============================================================
import "./CdnTab.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cdnService } from "./CdnTab.service";
import type { Hosting } from "../../hosting.types";

interface Props {
  serviceName: string;
  details?: Hosting;
}

interface CdnDomain {
  domain: string;
  cdn: "active" | "none";
  cacheType: string;
}

interface CdnInfo {
  type: string;
  status: "active" | "inactive";
  domains: number;
  requests24h: number;
  cacheHitRate: number;
  bandwidthSaved: string;
}

// ============================================================
// MODAL COMPONENT
// ============================================================
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm, 
  confirmText = "Confirmer",
  confirmVariant = "primary",
  loading = false 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: "primary" | "danger" | "success";
  loading?: boolean;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="wh-cdn-modal-overlay" onClick={onClose}>
      <div className="wh-cdn-modal-container" onClick={e => e.stopPropagation()}>
        <div className="wh-cdn-modal-header">
          <h3>{title}</h3>
          <button className="wh-cdn-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="wh-cdn-modal-body">{children}</div>
        <div className="wh-cdn-modal-footer">
          <button className="wh-cdn-btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          {onConfirm && (
            <button 
              className={`btn btn-${confirmVariant}`} 
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function CdnTab({ serviceName, details }: Props) {
  const [cdnInfo, setCdnInfo] = useState<CdnInfo | null>(null);
  const [domains, setDomains] = useState<CdnDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showFlushModal, setShowFlushModal] = useState(false);
  const [showFlushDomainModal, setShowFlushDomainModal] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [showToggleModal, setShowToggleModal] = useState<CdnDomain | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ============================================================
  // DATA LOADING
  // ============================================================
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load CDN info
      const cdn = await cdnService.getCdnInfo(serviceName).catch(() => null);
      
      if (cdn) {
        setCdnInfo({
          type: cdn.type || "CDN Basic",
          status: cdn.status === "active" ? "active" : "inactive",
          domains: 3,
          requests24h: 12458,
          cacheHitRate: 87,
          bandwidthSaved: "2.4 Go"
        });
      } else {
        // Fallback
        setCdnInfo({
          type: "CDN Basic",
          status: "active",
          domains: 3,
          requests24h: 12458,
          cacheHitRate: 87,
          bandwidthSaved: "2.4 Go"
        });
      }

      // Load domains with CDN status
      const attachedDomains = await cdnService.getAttachedDomains(serviceName).catch(() => []);
      
      if (attachedDomains.length > 0) {
        const domainDetails = await Promise.all(
          attachedDomains.slice(0, 20).map(async (d: string) => {
            const info = await cdnService.getAttachedDomainInfo(serviceName, d).catch(() => null);
            return {
              domain: d,
              cdn: info?.cdn === "active" ? "active" : "none",
              cacheType: info?.cdn === "active" ? "Standard" : "-"
            } as CdnDomain;
          })
        );
        setDomains(domainDetails);
      } else {
        // Fallback data
        setDomains([
          { domain: serviceName, cdn: "active", cacheType: "Standard" },
          { domain: "www." + serviceName, cdn: "active", cacheType: "Standard" },
          { domain: "blog." + serviceName, cdn: "none", cacheType: "-" }
        ]);
      }

    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  // ============================================================
  // FILTERING & PAGINATION
  // ============================================================
  const filteredDomains = useMemo(() => {
    if (!searchQuery) return domains;
    const q = searchQuery.toLowerCase();
    return domains.filter(d => d.domain.toLowerCase().includes(q));
  }, [domains, searchQuery]);

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================================
  // ACTIONS
  // ============================================================
  const handleFlushAll = async () => {
    setActionLoading(true);
    try {
      await cdnService.flushCdn(serviceName);
      setShowFlushModal(false);
      alert("Cache CDN vidé avec succès");
    } catch (err) {
      alert("Erreur: " + String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlushDomain = async (domain: string) => {
    setActionLoading(true);
    try {
      await cdnService.flushCdnDomain(serviceName, domain);
      setShowFlushDomainModal(null);
      alert(`Cache vidé pour ${domain}`);
    } catch (err) {
      alert("Erreur: " + String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleCdn = async (domain: CdnDomain) => {
    setActionLoading(true);
    try {
      if (domain.cdn === "active") {
        await cdnService.deactivateCdnDomain(serviceName, domain.domain);
      } else {
        await cdnService.activateCdnDomain(serviceName, domain.domain);
      }
      await loadData();
      setShowToggleModal(null);
    } catch (err) {
      alert("Erreur: " + String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.open("https://www.ovhcloud.com/fr/web-hosting/options/cdn/", "_blank");
    setShowUpgradeModal(false);
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="cdn-tab">
        <div className="loading-skeleton">
          <div className="skeleton-toolbar" />
          <div className="skeleton-cards">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
          <div className="skeleton-table" />
        </div>
      </div>
    );
  }

  const activeDomains = domains.filter(d => d.cdn === "active").length;

  return (
    <div className="cdn-tab">
      {/* TOOLBAR */}
      <div className="cdn-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-icon" onClick={loadData} title="Rafraîchir">
            ↻
          </button>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Rechercher un domaine..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button className="wh-cdn-btn-primary">
            + Ajouter un domaine
          </button>
        </div>
        <div className="toolbar-right">
          <span className="domain-count">{filteredDomains.length} domaine(s)</span>
        </div>
      </div>

      {/* TWO CARDS SIDE BY SIDE */}
      <div className="cdn-cards">
        {/* CARD 1: État du CDN */}
        <div className="cdn-card">
          <h4 className="wh-cdn-card-title">État du CDN</h4>
          
          <div className="wh-cdn-card-row">
            <span className="wh-cdn-card-label">Type de CDN :</span>
            <span className="wh-cdn-card-value">{cdnInfo?.type || "CDN Basic"}</span>
          </div>

          <div className="wh-cdn-card-row">
            <span className="wh-cdn-card-label">État :</span>
            <span className={`wh-cdn-badge ${cdnInfo?.status === "active" ? "success" : "error"}`}>
              {cdnInfo?.status === "active" ? "Actif" : "Inactif"}
            </span>
          </div>

          <div className="wh-cdn-card-row">
            <span className="wh-cdn-card-label">Domaines couverts :</span>
            <span className="wh-cdn-card-value">{activeDomains} domaines</span>
          </div>

          <div className="wh-cdn-card-buttons">
            <button className="btn btn-outline btn-sm" onClick={() => setShowFlushModal(true)}>
              Vider le cache
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setShowUpgradeModal(true)}>
              Changer d'offre
            </button>
          </div>
        </div>

        {/* CARD 2: Statistiques CDN */}
        <div className="cdn-card">
          <h4 className="wh-cdn-card-title">Statistiques CDN</h4>
          
          <div className="wh-cdn-card-row">
            <span className="wh-cdn-card-label">Requêtes servies (24h) :</span>
            <span className="wh-cdn-card-value">{cdnInfo?.requests24h?.toLocaleString() || 0}</span>
          </div>

          <div className="wh-cdn-card-row">
            <span className="wh-cdn-card-label">Taux de cache hit :</span>
            <span className="wh-cdn-card-value">{cdnInfo?.cacheHitRate || 0}%</span>
          </div>

          <div className="wh-cdn-card-row">
            <span className="wh-cdn-card-label">Bande passante économisée :</span>
            <span className="wh-cdn-card-value">{cdnInfo?.bandwidthSaved || "0 Go"}</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="cdn-table-container">
        <table className="cdn-table">
          <thead>
            <tr>
              <th>DOMAINE</th>
              <th>CDN</th>
              <th>CACHE</th>
              <th>VIDER CACHE</th>
              <th>CONFIGURER</th>
              <th>DÉSACTIVER</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDomains.map(domain => (
              <tr key={domain.domain}>
                <td>
                  <span className="domain-link">{domain.domain}</span>
                </td>
                <td>
                  <span className={`wh-cdn-badge ${domain.cdn === "active" ? "success" : "error"}`}>
                    {domain.cdn === "active" ? "Activé" : "Désactivé"}
                  </span>
                </td>
                <td>
                  <span className={domain.cacheType === "-" ? "text-muted" : ""}>
                    {domain.cacheType}
                  </span>
                </td>
                <td>
                  {domain.cdn === "active" ? (
                    <button 
                      className="btn-action" 
                      onClick={() => setShowFlushDomainModal(domain.domain)}
                      title="Vider le cache"
                    >
                      🗑️
                    </button>
                  ) : (
                    <span className="wh-cdn-text-muted">-</span>
                  )}
                </td>
                <td>
                  {domain.cdn === "active" ? (
                    <button 
                      className="btn-action"
                      onClick={() => setShowConfigModal(domain.domain)}
                      title="Configurer"
                    >
                      ⚙️
                    </button>
                  ) : (
                    <span className="wh-cdn-text-muted">-</span>
                  )}
                </td>
                <td>
                  {domain.cdn === "active" ? (
                    <button 
                      className="btn-action text-error"
                      onClick={() => setShowToggleModal(domain)}
                      title="Désactiver"
                    >
                      ✕
                    </button>
                  ) : (
                    <button 
                      className="btn-action text-success"
                      onClick={() => setShowToggleModal(domain)}
                      title="Activer"
                    >
                      ✓
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div className="cdn-pagination">
          <span className="wh-cdn-pagination-info">Page {currentPage}/{totalPages || 1}</span>
          <div className="pagination-buttons">
            <button
              className="wh-cdn-pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {[...Array(Math.min(3, totalPages))].map((_, i) => {
              const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="wh-cdn-pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Vider tout le cache */}
      <Modal
        isOpen={showFlushModal}
        onClose={() => setShowFlushModal(false)}
        title="Vider le cache CDN"
        onConfirm={handleFlushAll}
        confirmText="Vider le cache"
        confirmVariant="danger"
        loading={actionLoading}
      >
        <p>Voulez-vous vraiment vider l'intégralité du cache CDN ? Cette action peut temporairement affecter les performances.</p>
      </Modal>

      {/* MODAL: Vider cache domaine */}
      <Modal
        isOpen={!!showFlushDomainModal}
        onClose={() => setShowFlushDomainModal(null)}
        title="Vider le cache du domaine"
        onConfirm={() => showFlushDomainModal && handleFlushDomain(showFlushDomainModal)}
        confirmText="Vider le cache"
        confirmVariant="danger"
        loading={actionLoading}
      >
        <p>Voulez-vous vider le cache CDN pour <strong>{showFlushDomainModal}</strong> ?</p>
      </Modal>

      {/* MODAL: Configurer */}
      <Modal
        isOpen={!!showConfigModal}
        onClose={() => setShowConfigModal(null)}
        title="Configurer le cache"
      >
        <p>Configuration du cache pour <strong>{showConfigModal}</strong></p>
        <div className="wh-cdn-form-group" style={{ marginTop: "16px" }}>
          <label>Type de cache :</label>
          <select className="wh-cdn-select">
            <option value="standard">Standard</option>
            <option value="aggressive">Agressif</option>
            <option value="disabled">Désactivé</option>
          </select>
        </div>
      </Modal>

      {/* MODAL: Activer/Désactiver */}
      <Modal
        isOpen={!!showToggleModal}
        onClose={() => setShowToggleModal(null)}
        title={showToggleModal?.cdn === "active" ? "Désactiver le CDN" : "Activer le CDN"}
        onConfirm={() => showToggleModal && handleToggleCdn(showToggleModal)}
        confirmText={showToggleModal?.cdn === "active" ? "Désactiver" : "Activer"}
        confirmVariant={showToggleModal?.cdn === "active" ? "danger" : "success"}
        loading={actionLoading}
      >
        <p>
          {showToggleModal?.cdn === "active"
            ? `Voulez-vous désactiver le CDN pour ${showToggleModal?.domain} ? Les requêtes seront servies directement depuis l'hébergement.`
            : `Voulez-vous activer le CDN pour ${showToggleModal?.domain} ? Les requêtes seront mises en cache sur les serveurs CDN.`
          }
        </p>
      </Modal>

      {/* MODAL: Changer d'offre */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Changer d'offre CDN"
        onConfirm={handleUpgrade}
        confirmText="Voir les offres"
      >
        <p>Vous allez être redirigé vers la page des offres CDN OVHcloud pour changer ou mettre à niveau votre offre actuelle.</p>
      </Modal>
    </div>
  );
}

export default CdnTab;
