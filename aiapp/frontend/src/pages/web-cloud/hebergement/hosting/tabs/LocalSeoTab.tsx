// ============================================================
// HOSTING TAB: LOCAL SEO - Visibilité Pro (sans redirection)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface LocalSeoSubscription {
  id: string;
  offer: string;
  country: string;
  status: string;
  creationDate: string;
  email?: string;
  name?: string;
}

interface LocalSeoAccount {
  id: string;
  email: string;
  creationDate: string;
}

interface Props { serviceName: string; }

/** Modal pour gérer un abonnement Local SEO. */
function ManageSeoModal({ serviceName, subscription, isOpen, onClose, onSuccess }: {
  serviceName: string;
  subscription: LocalSeoSubscription | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [account, setAccount] = useState<LocalSeoAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!isOpen || !subscription) return;
    setLoading(true);
    hostingService.getLocalSeoAccount(serviceName, subscription.id)
      .then(setAccount)
      .catch(() => setAccount(null))
      .finally(() => setLoading(false));
  }, [serviceName, subscription, isOpen]);

  if (!isOpen || !subscription) return null;

  const handleLogin = async () => {
    setLoggingIn(true);
    try {
      const result = await hostingService.loginLocalSeo(serviceName, subscription.id);
      if (result?.url) {
        window.open(result.url, "_blank");
      }
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Gérer Visibilité Pro</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="skeleton-block" />
          ) : (
            <>
              <div className="info-grid">
                <div className="info-item">
                  <label>Offre</label>
                  <span>{subscription.offer}</span>
                </div>
                <div className="info-item">
                  <label>Pays</label>
                  <span>{subscription.country}</span>
                </div>
                <div className="info-item">
                  <label>Statut</label>
                  <span className="badge success">{subscription.status}</span>
                </div>
                {account && (
                  <div className="info-item">
                    <label>Email compte</label>
                    <span className="font-mono">{account.email}</span>
                  </div>
                )}
              </div>

              <div className="info-banner" style={{ marginTop: 'var(--space-4)' }}>
                <span className="info-icon">ℹ</span>
                <p>Accédez à l'interface de gestion pour modifier vos informations sur les annuaires.</p>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
          <button className="btn btn-primary" onClick={handleLogin} disabled={loggingIn}>
            {loggingIn ? "Connexion..." : "Accéder à l'interface"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Modal pour commander Visibilité Pro. */
function OrderSeoModal({ serviceName, isOpen, onClose, onSuccess }: {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [country, setCountry] = useState("FR");
  const [loading, setLoading] = useState(false);

  const countries = [
    { code: "FR", label: "France" },
    { code: "BE", label: "Belgique" },
    { code: "ES", label: "Espagne" },
    { code: "DE", label: "Allemagne" },
    { code: "IT", label: "Italie" },
    { code: "UK", label: "Royaume-Uni" },
  ];

  if (!isOpen) return null;

  const handleOrder = async () => {
    setLoading(true);
    try {
      const result = await hostingService.orderLocalSeo(serviceName, country);
      if (result?.url) {
        window.open(result.url, "_blank");
      }
      alert("Redirection vers le bon de commande...");
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
          <h3>Commander Visibilité Pro</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-banner">
            <span className="info-icon">📍</span>
            <p>Visibilité Pro synchronise automatiquement vos informations sur plus de 50 annuaires locaux.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Pays cible</label>
            <select className="form-select" value={country} onChange={e => setCountry(e.target.value)}>
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <span className="form-hint">Sélectionnez le pays où votre établissement est situé.</span>
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

/** Onglet Visibilité Pro avec gestion des abonnements. */
export function LocalSeoTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [subscriptions, setSubscriptions] = useState<LocalSeoSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);
  const [manageModal, setManageModal] = useState<{ open: boolean; sub: LocalSeoSubscription | null }>({ open: false, sub: null });
  const [showOrderModal, setShowOrderModal] = useState(false);

  const loadSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listLocalSeo(serviceName).catch(() => []);
      if (ids.length > 0) {
        const data = await Promise.all(
          ids.map((id: string) => hostingService.getLocalSeo(serviceName, id))
        );
        setSubscriptions(data);
      }
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadSubscriptions(); }, [loadSubscriptions]);

  const handleTerminate = async (id: string) => {
    if (!confirm(t("localSeo.confirmTerminate"))) return;
    setTerminating(id);
    try {
      await hostingService.terminateLocalSeo(serviceName, id);
      loadSubscriptions();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setTerminating(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="localseo-tab">
      <div className="tab-header">
        <div>
          <h3>{t("localSeo.title")}</h3>
          <p className="tab-description">{t("localSeo.description")}</p>
        </div>
      </div>

      {subscriptions.length > 0 ? (
        <>
          <section className="seo-subscriptions">
            <h4>Vos abonnements</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("localSeo.offer")}</th>
                  <th>{t("localSeo.country")}</th>
                  <th>{t("localSeo.since")}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.offer}</td>
                    <td>{sub.country}</td>
                    <td>{formatDate(sub.creationDate)}</td>
                    <td>
                      <div className="action-buttons">
                        {/* SANS REDIRECTION - Modal native */}
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setManageModal({ open: true, sub })}
                        >
                          {t("localSeo.manage")}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleTerminate(sub.id)}
                          disabled={terminating === sub.id}
                        >
                          {terminating === sub.id ? "..." : t("localSeo.terminate")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <>
          <section className="seo-promo">
            <div className="promo-icon">📍</div>
            <h4>{t("localSeo.promoTitle")}</h4>
            <p>{t("localSeo.promoDesc")}</p>
          </section>

          <section className="seo-features">
            <h4>Fonctionnalités incluses</h4>
            <ul className="features-list">
              <li>📋 {t("localSeo.feature1")}</li>
              <li>⭐ {t("localSeo.feature2")}</li>
              <li>📊 {t("localSeo.feature3")}</li>
              <li>🗺️ {t("localSeo.feature4")}</li>
            </ul>
          </section>

          <section className="seo-info-box">
            <h4>{t("localSeo.whatIs")}</h4>
            <p>{t("localSeo.explanation")}</p>
          </section>

          {/* SANS REDIRECTION - Modal native */}
          <section className="seo-actions">
            <button className="btn btn-primary" onClick={() => setShowOrderModal(true)}>
              {t("localSeo.activate")}
            </button>
          </section>
        </>
      )}

      <ManageSeoModal
        serviceName={serviceName}
        subscription={manageModal.sub}
        isOpen={manageModal.open}
        onClose={() => setManageModal({ open: false, sub: null })}
        onSuccess={loadSubscriptions}
      />

      <OrderSeoModal
        serviceName={serviceName}
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSuccess={loadSubscriptions}
      />
    </div>
  );
}

export default LocalSeoTab;
