// ============================================================
// MIGRATE MODAL - Migrer une offre connexion
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { connectionsService } from "./connections.service";

interface MigrateModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  currentOffer: string;
  onSuccess: () => void;
}

interface MigrationOffer {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export function MigrateModal({ isOpen, onClose, connectionId, currentOffer, onSuccess }: MigrateModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");
  const [offers, setOffers] = useState<MigrationOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOffers();
    }
  }, [isOpen, connectionId]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const availableOffers = await connectionsService.getMigrationOffers(connectionId);
      setOffers(availableOffers);
      // Pre-select recommended offer
      const recommended = availableOffers.find(o => o.recommended);
      if (recommended) {
        setSelectedOffer(recommended.id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOffer || !confirmed) return;

    try {
      setSubmitting(true);
      setError(null);
      await connectionsService.migrateConnection(connectionId, selectedOffer);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedOffer(null);
    setConfirmed(false);
    setError(null);
    onClose();
  };

  const selectedOfferData = offers.find(o => o.id === selectedOffer);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("migrate.title")}
      size="medium"
      footer={
        <>
          <button className="conn-modal-btn-secondary" onClick={handleClose}>
            {t("common.cancel")}
          </button>
          <button
            className="conn-modal-btn-primary"
            onClick={handleSubmit}
            disabled={!selectedOffer || !confirmed || submitting}
          >
            {submitting ? t("migrate.migrating") : t("migrate.confirm")}
          </button>
        </>
      }
    >
      {loading ? (
        <div className="conn-modal-empty">
          <div className="spinner" />
          <p>{t("migrate.loading")}</p>
        </div>
      ) : error ? (
        <div className="conn-modal-alert conn-modal-alert-error">
          {error}
        </div>
      ) : (
        <>
          {/* Current Offer */}
          <div className="conn-modal-section">
            <h4 className="conn-modal-section-title">{t("migrate.currentOffer")}</h4>
            <div className="conn-modal-band-indicator">
              <span className="conn-band-badge conn-band-24">{currentOffer}</span>
              <span className="conn-band-desc">{t("migrate.currentOfferHint")}</span>
            </div>
          </div>

          {/* Available Offers */}
          <div className="conn-modal-section">
            <h4 className="conn-modal-section-title">{t("migrate.availableOffers")}</h4>

            {offers.length === 0 ? (
              <div className="conn-modal-empty">
                <p>{t("migrate.noOffers")}</p>
              </div>
            ) : (
              <div className="conn-option-list">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`conn-option-item ${selectedOffer === offer.id ? "selected" : ""}`}
                    onClick={() => setSelectedOffer(offer.id)}
                  >
                    <div className="conn-option-radio" />
                    <div className="conn-option-content">
                      <div className="conn-option-header">
                        <span className="conn-option-label">
                          {offer.name}
                          {offer.recommended && (
                            <span className="migrate-recommended-badge">
                              {t("migrate.recommended")}
                            </span>
                          )}
                        </span>
                        <span className="conn-option-price">
                          {offer.price.toFixed(2)} EUR
                          <span className="conn-option-period">/{t("migrate.month")}</span>
                        </span>
                      </div>
                      <p className="conn-option-description">{offer.description}</p>
                      {offer.features.length > 0 && (
                        <ul className="migrate-features">
                          {offer.features.map((feature, i) => (
                            <li key={i}>+ {feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="conn-modal-warning">
            <span className="warning-icon">⚠️</span>
            <div>
              <strong>{t("migrate.warningTitle")}</strong>
              <p>{t("migrate.warningText")}</p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          {selectedOfferData && (
            <div className="conn-modal-section">
              <label className="conn-modal-checkbox">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                {t("migrate.confirmCheckbox")}
              </label>
            </div>
          )}

          {/* Summary */}
          {selectedOfferData && confirmed && (
            <div className="conn-modal-summary">
              <h4>{t("migrate.summary")}</h4>
              <div className="conn-summary-row">
                <span>{t("migrate.newOffer")}: {selectedOfferData.name}</span>
                <span className="conn-summary-price">
                  {selectedOfferData.price.toFixed(2)} EUR
                  <span>/{t("migrate.month")}</span>
                </span>
              </div>
              <p className="conn-summary-note">{t("migrate.effectiveDate")}</p>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
