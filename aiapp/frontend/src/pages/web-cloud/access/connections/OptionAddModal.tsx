// ============================================================
// OPTION ADD MODAL - Souscription option connexion
// ============================================================

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import type { AvailableOption } from "./connections.types";

interface OptionAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: AvailableOption[];
  onSubscribe: (optionId: string) => Promise<void>;
}

export function OptionAddModal({ isOpen, onClose, options, onSubscribe }: OptionAddModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle subscription
  const handleSubscribe = useCallback(async () => {
    if (!selectedOption) return;

    setError(null);
    setSubscribing(true);
    try {
      await onSubscribe(selectedOption);
      setSelectedOption(null);
      onClose();
    } catch (err) {
      setError(t("optionAdd.errors.subscribeFailed"));
    } finally {
      setSubscribing(false);
    }
  }, [selectedOption, onSubscribe, onClose, t]);

  // Reset on close
  const handleClose = useCallback(() => {
    setSelectedOption(null);
    setError(null);
    onClose();
  }, [onClose]);

  // Get selected option details
  const selected = options.find((o) => o.id === selectedOption);

  const footer = (
    <>
      <button
        className="conn-modal-btn-secondary"
        onClick={handleClose}
        disabled={subscribing}
      >
        {t("cancel")}
      </button>
      <button
        className="conn-modal-btn-primary"
        onClick={handleSubscribe}
        disabled={subscribing || !selectedOption}
      >
        {subscribing ? t("optionAdd.subscribing") : t("optionAdd.subscribe")}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("optionAdd.title")}
      footer={footer}
      size="medium"
    >
      {error && (
        <div className="conn-modal-alert conn-modal-alert-error">
          {error}
        </div>
      )}

      <p className="conn-modal-description">
        {t("optionAdd.description")}
      </p>

      {options.length === 0 ? (
        <div className="conn-modal-empty">
          {t("optionAdd.noOptions")}
        </div>
      ) : (
        <div className="conn-option-list">
          {options.map((option) => (
            <label
              key={option.id}
              className={`conn-option-item ${selectedOption === option.id ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
              />
              <div className="conn-option-content">
                <div className="conn-option-header">
                  <span className="conn-option-label">{option.label}</span>
                  <span className="conn-option-price">
                    {option.price.toFixed(2)} €
                    <span className="conn-option-period">
                      /{option.period === "monthly" ? t("optionAdd.month") : t("optionAdd.oneTime")}
                    </span>
                  </span>
                </div>
                <p className="conn-option-description">{option.description}</p>
              </div>
              <span className="conn-option-radio"></span>
            </label>
          ))}
        </div>
      )}

      {/* Summary */}
      {selected && (
        <div className="conn-modal-summary">
          <h4>{t("optionAdd.summary")}</h4>
          <div className="conn-summary-row">
            <span>{selected.label}</span>
            <span className="conn-summary-price">
              {selected.price.toFixed(2)} €
              {selected.period === "monthly" && <span>/{t("optionAdd.month")}</span>}
            </span>
          </div>
          <p className="conn-summary-note">
            {selected.period === "monthly"
              ? t("optionAdd.monthlyNote")
              : t("optionAdd.oneTimeNote")
            }
          </p>
        </div>
      )}
    </Modal>
  );
}
