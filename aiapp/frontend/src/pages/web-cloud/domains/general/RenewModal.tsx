// ============================================================
// MODAL: RenewModal - Renouveler le domaine
// Basé sur target SVG modal-renew.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  domain: string;
  expirationDate?: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// ============ COMPOSANT ============

export function RenewModal({ domain, expirationDate, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const durations = [1, 2, 3, 5, 10];
  const pricePerYear = 9.99;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Redirection vers le manager OVH pour le renouvellement
      const url = `https://www.ovh.com/manager/#/dedicated/billing/autorenew?searchText=${encodeURIComponent(domain)}`;
      window.open(url, "_blank");
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.renew.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{domain}</div>

          {expirationDate && (
            <div className="dom-modal-expiration">
              <CalendarIcon />
              <span>{t("modals.renew.currentExpiration")}: {expirationDate}</span>
            </div>
          )}

          <div className="dom-modal-info-banner">
            {t("modals.renew.info")}
          </div>

          {/* Duration selection */}
          <div className="dom-modal-field">
            <label>{t("modals.renew.duration")}</label>
            <div className="dom-modal-duration-options">
              {durations.map((d) => (
                <button
                  key={d}
                  className={`dom-modal-duration-btn ${duration === d ? "selected" : ""}`}
                  onClick={() => setDuration(d)}
                >
                  {d} {t("modals.renew.year", { count: d })}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="dom-modal-price">
            <span className="dom-modal-label">{t("modals.renew.totalPrice")}</span>
            <span className="dom-modal-value">{(pricePerYear * duration).toFixed(2)} € HT</span>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "..." : t("modals.renew.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RenewModal;
