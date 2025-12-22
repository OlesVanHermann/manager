// ============================================================
// HOSTING TAB: GENERAL - Informations générales (3 colonnes)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { RestoreSnapshotModal, OvhConfigModal } from "../components";
import { hostingService, Hosting, HostingServiceInfos } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

// --- MODAL: Changer PHP ---
function ChangePhpModal({ serviceName, currentVersion, isOpen, onClose, onSuccess }: {
  serviceName: string;
  currentVersion: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [version, setVersion] = useState(currentVersion);
  const [loading, setLoading] = useState(false);
  const versions = ["5.6", "7.0", "7.1", "7.2", "7.3", "7.4", "8.0", "8.1", "8.2", "8.3"];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await hostingService.updateHosting(serviceName, { phpVersion: version });
      onSuccess();
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
          <h3>Modifier la version PHP</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Version PHP</label>
            <select className="form-select" value={version} onChange={e => setVersion(e.target.value)}>
              {versions.map(v => (
                <option key={v} value={v}>PHP {v} {parseFloat(v) < 8.0 ? "(obsolète)" : ""}</option>
              ))}
            </select>
          </div>
          {parseFloat(version) < 8.0 && (
            <div className="info-banner warning">
              <span className="info-icon">⚠</span>
              <span>Les versions PHP inférieures à 8.0 ne reçoivent plus de mises à jour de sécurité.</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Modification..." : "Appliquer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL: Changer nom d'affichage ---
function ChangeDisplayNameModal({ serviceName, currentName, isOpen, onClose, onSuccess }: {
  serviceName: string;
  currentName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await hostingService.updateHosting(serviceName, { displayName: name });
      onSuccess();
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
          <h3>Modifier le nom d'affichage</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Nom d'affichage</label>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={e => setName(e.target.value)}
              maxLength={250}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? "Modification..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL: Upgrade offre ---
function UpgradeOfferModal({ serviceName, currentOffer, isOpen, onClose }: {
  serviceName: string;
  currentOffer: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    hostingService.getAvailableOffers(serviceName)
      .then(data => setOffers(data || []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, [serviceName, isOpen]);

  if (!isOpen) return null;

  const handleOrder = async () => {
    if (!selectedOffer) return;
    setOrdering(true);
    try {
      const orderUrl = await hostingService.orderUpgrade(serviceName, selectedOffer);
      if (orderUrl) window.open(orderUrl, "_blank");
      onClose();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setOrdering(false);
    }
  };

  const offerOrder = ["START", "PERSO", "PRO", "PERFORMANCE_1", "PERFORMANCE_2", "PERFORMANCE_3", "PERFORMANCE_4"];
  const currentIndex = offerOrder.indexOf(currentOffer);
  const upgradableOffers = offers.filter(o => offerOrder.indexOf(o.planCode) > currentIndex);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Changer d'offre</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Offre actuelle : <strong>{currentOffer}</strong></p>
          {loading ? (
            <div className="skeleton-block" />
          ) : upgradableOffers.length === 0 ? (
            <div className="info-banner">
              <span className="info-icon">ℹ</span>
              <span>Vous disposez déjà de l'offre la plus élevée.</span>
            </div>
          ) : (
            <div className="offers-grid">
              {upgradableOffers.map(offer => (
                <div 
                  key={offer.planCode}
                  className={`offer-card ${selectedOffer === offer.planCode ? "selected" : ""}`}
                  onClick={() => setSelectedOffer(offer.planCode)}
                >
                  <h4>{offer.planCode}</h4>
                  <p className="offer-desc">{offer.description || "Hébergement web OVHcloud"}</p>
                  {offer.price && <p className="offer-price">{offer.price.text}/mois</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleOrder} disabled={ordering || !selectedOffer}>
            {ordering ? "Commande..." : "Commander"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL: Résiliation ---
function TerminateModal({ serviceName, isOpen, onClose }: {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTerminate = async () => {
    if (confirm !== serviceName) return;
    setLoading(true);
    try {
      await hostingService.terminateHosting(serviceName);
      alert("Demande de résiliation envoyée.");
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
          <h3>Résilier l'hébergement</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-banner error">
            <span className="info-icon">⚠</span>
            <span>Cette action est irréversible. Toutes les données seront supprimées.</span>
          </div>
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>Tapez <strong>{serviceName}</strong> pour confirmer</label>
            <input 
              type="text" 
              className="form-input" 
              value={confirm} 
              onChange={e => setConfirm(e.target.value)}
              placeholder={serviceName}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button 
            className="btn btn-danger" 
            onClick={handleTerminate} 
            disabled={loading || confirm !== serviceName}
          >
            {loading ? "Résiliation..." : "Résilier définitivement"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export function GeneralTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [serviceInfos, setServiceInfos] = useState<HostingServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showPhpModal, setShowPhpModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [showOvhConfigModal, setShowOvhConfigModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hostingData, infos] = await Promise.all([
        hostingService.getHosting(serviceName),
        hostingService.getServiceInfos(serviceName)
      ]);
      setHosting(hostingData);
      setServiceInfos(infos);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  // --- HELPERS ---
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatQuota = (bytes: number | undefined) => {
    if (!bytes) return "0";
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} Go`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} Mo`;
    return `${bytes} octets`;
  };

  if (loading) {
    return (
      <div className="general-tab">
        <div className="general-grid">
          <div className="general-card skeleton"><div className="skeleton-block" style={{ height: "300px" }} /></div>
          <div className="general-card skeleton"><div className="skeleton-block" style={{ height: "300px" }} /></div>
          <div className="general-card skeleton"><div className="skeleton-block" style={{ height: "300px" }} /></div>
        </div>
      </div>
    );
  }

  if (error || !hosting) {
    return <div className="error-state">{error || "Impossible de charger les données"}</div>;
  }

  const quotaPercent = hosting.quotaSize ? Math.round((hosting.quotaUsed || 0) / hosting.quotaSize * 100) : 0;

  return (
    <div className="general-tab">
      {/* Actions rapides */}
      <div className="tab-header" style={{ marginBottom: "1rem" }}>
        <div className="tab-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setShowSnapshotModal(true)}>
            📸 {t("actions.snapshot")}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowOvhConfigModal(true)}>
            ⚙️ {t("actions.ovhconfig")}
          </button>
        </div>
      </div>

      {/* Grille 3 colonnes */}
      <div className="general-grid">
        {/* COLONNE 1 : Informations générales */}
        <section className="general-card">
          <h4>Informations générales</h4>

          <div className="info-row with-action">
            <span className="info-label">Nom du service</span>
            <span className="info-value"><code>{serviceName}</code></span>
          </div>

          <div className="info-row with-action">
            <span className="info-label">Nom d'affichage</span>
            <span className="info-value">{hosting.displayName || serviceName}</span>
            <button className="btn-action" onClick={() => setShowNameModal(true)} title="Modifier">✏️</button>
          </div>

          <div className="info-row">
            <span className="info-label">Offre</span>
            <span className="info-value">
              <span className="badge primary">{hosting.offer || "-"}</span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">État</span>
            <span className="info-value">
              <span className={`badge ${hosting.state === "active" ? "success" : "warning"}`}>
                {hosting.state === "active" ? "Actif" : hosting.state}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">IPv4</span>
            <span className="info-value copyable">
              <code>{hosting.hostingIp || "-"}</code>
              {hosting.hostingIp && (
                <button className="copy-btn" onClick={() => copyToClipboard(hosting.hostingIp)} title="Copier">📋</button>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">IPv6</span>
            <span className="info-value copyable">
              <code>{hosting.hostingIpv6 || "-"}</code>
              {hosting.hostingIpv6 && (
                <button className="copy-btn" onClick={() => copyToClipboard(hosting.hostingIpv6!)} title="Copier">📋</button>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Espace disque</span>
            <span className="info-value">
              <div className="quota-display">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${quotaPercent > 90 ? 'danger' : quotaPercent > 70 ? 'warning' : ''}`}
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
                <span className="quota-text">{formatQuota(hosting.quotaUsed)} / {formatQuota(hosting.quotaSize)}</span>
              </div>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Datacenter</span>
            <span className="info-value">{hosting.datacenter || "-"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Cluster</span>
            <span className="info-value">{hosting.cluster || "-"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Dossier racine</span>
            <span className="info-value"><code>{hosting.home || "-"}</code></span>
          </div>
        </section>

        {/* COLONNE 2 : Configuration */}
        <section className="general-card">
          <h4>Configuration</h4>

          <div className="info-row with-action">
            <span className="info-label">Version PHP globale</span>
            <span className="info-value">
              <code>{hosting.phpVersion || "-"}</code>
              {hosting.phpVersion && parseFloat(hosting.phpVersion) < 8.0 && (
                <span className="badge warning" title="Version obsolète">⚠️</span>
              )}
            </span>
            <button className="btn-action" onClick={() => setShowPhpModal(true)} title="Modifier">✏️</button>
          </div>

          <div className="info-row">
            <span className="info-label">Certificat SSL</span>
            <span className="info-value">
              <span className={`badge ${hosting.hasHostedSsl ? 'success' : 'inactive'}`}>
                {hosting.hasHostedSsl ? "Actif" : "Non"}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Option CDN</span>
            <span className="info-value">
              <span className={`badge ${hosting.hasCdn ? 'success' : 'inactive'}`}>
                {hosting.hasCdn ? "Actif" : "Non"}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Adresses e-mails</span>
            <span className="info-value">
              <span className={`badge ${hosting.hasEmail ? 'success' : 'inactive'}`}>
                {hosting.hasEmail ? "Actif" : "Non"}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Bases de données</span>
            <span className="info-value">
              {hosting.databaseCount !== undefined ? (
                <div className="quota-display" style={{ maxWidth: "150px" }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(hosting.databaseCount / 5) * 100}%` }} />
                  </div>
                  <span className="quota-text">{hosting.databaseCount} / 5</span>
                </div>
              ) : "-"}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Web Cloud Databases</span>
            <span className="info-value">{hosting.privateDbCount || "0"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Système</span>
            <span className="info-value">{hosting.operatingSystem || "Linux"}</span>
          </div>
        </section>

        {/* COLONNE 3 : Abonnement */}
        <section className="general-card">
          <h4>Abonnement</h4>

          <div className="info-row with-action">
            <span className="info-label">Offre</span>
            <span className="info-value"><strong>{hosting.offer || "-"}</strong></span>
            <button className="btn-action" onClick={() => setShowUpgradeModal(true)} title="Changer d'offre">⬆️</button>
          </div>

          <div className="info-row">
            <span className="info-label">Renouvellement</span>
            <span className="info-value">
              {serviceInfos?.renew?.automatic ? (
                <span className="badge success">Automatique</span>
              ) : (
                <span className="badge warning">Manuel</span>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Boost</span>
            <span className="info-value">
              {hosting.boostOffer ? (
                <span className="badge success">{hosting.boostOffer}</span>
              ) : (
                <span className="badge inactive">Non activé</span>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Contacts</span>
            <span className="info-value contacts-list">
              {serviceInfos?.contactAdmin && <span><small>Admin:</small> {serviceInfos.contactAdmin}</span>}
              {serviceInfos?.contactTech && <span><small>Tech:</small> {serviceInfos.contactTech}</span>}
              {serviceInfos?.contactBilling && <span><small>Fact:</small> {serviceInfos.contactBilling}</span>}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Date de création</span>
            <span className="info-value">{formatDate(serviceInfos?.creation)}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Date d'expiration</span>
            <span className="info-value">{formatDate(serviceInfos?.expiration)}</span>
          </div>

          <div className="section-divider" />

          <div className="danger-zone">
            <button className="btn btn-danger btn-sm" onClick={() => setShowTerminateModal(true)}>
              Résilier l'hébergement
            </button>
          </div>
        </section>
      </div>

      {/* Ligne 2 : Liens utiles + Aperçu + Conseils */}
      <div className="general-grid" style={{ marginTop: "1.5rem" }}>
        <section className="general-card">
          <h4>Liens utiles</h4>
          <div className="links-list">
            <a href={`https://logs.ovh.net/${serviceName}/`} target="_blank" rel="noopener noreferrer" className="link-item">
              Website Statistiques <span className="link-external">↗</span>
            </a>
            <a href={`https://${hosting.cluster}.hosting.ovh.net/`} target="_blank" rel="noopener noreferrer" className="link-item">
              Accès HTTP au cluster <span className="link-external">↗</span>
            </a>
            <a href="https://www.ovhcloud.com/fr/web-hosting/uc-programming-language/" target="_blank" rel="noopener noreferrer" className="link-item">
              Versions des langages disponibles <span className="link-external">↗</span>
            </a>
          </div>
        </section>

        <section className="general-card">
          <h4>Aperçu du site</h4>
          <div className="site-preview">
            <div className="preview-placeholder">
              <span>🌐</span>
              <a href={`https://${serviceName}`} target="_blank" rel="noopener noreferrer">
                {serviceName} ↗
              </a>
            </div>
          </div>
        </section>

        <section className="general-card">
          <h4>Conseils OVHcloud</h4>
          <div className="tips-card">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Optimisez votre hébergement</strong>
              <p>Activez le CDN pour améliorer les performances de votre site.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <ChangePhpModal
        serviceName={serviceName}
        currentVersion={hosting.phpVersion || "8.0"}
        isOpen={showPhpModal}
        onClose={() => setShowPhpModal(false)}
        onSuccess={loadData}
      />
      <ChangeDisplayNameModal
        serviceName={serviceName}
        currentName={hosting.displayName || ""}
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSuccess={loadData}
      />
      <UpgradeOfferModal
        serviceName={serviceName}
        currentOffer={hosting.offer || ""}
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      <TerminateModal
        serviceName={serviceName}
        isOpen={showTerminateModal}
        onClose={() => setShowTerminateModal(false)}
      />
      <RestoreSnapshotModal
        serviceName={serviceName}
        isOpen={showSnapshotModal}
        onClose={() => setShowSnapshotModal(false)}
        onSuccess={loadData}
      />
      <OvhConfigModal
        serviceName={serviceName}
        isOpen={showOvhConfigModal}
        onClose={() => setShowOvhConfigModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

export default GeneralTab;
