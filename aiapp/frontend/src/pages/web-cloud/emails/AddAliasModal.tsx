// ============================================================
// MODAL - Add Alias (Ajouter un alias)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "../types";
import { OfferBadge } from "./OfferBadge";

interface AddAliasModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  domain: string;
  offer: EmailOffer;
  existingAliases: string[];
  maxAliases: number;
  onSubmit: (alias: string) => Promise<void>;
  onDeleteAlias: (alias: string) => Promise<void>;
}

/** Modal d'ajout d'alias pour un compte email. */
export function AddAliasModal({
  isOpen,
  onClose,
  email,
  domain,
  offer,
  existingAliases,
  maxAliases,
  onSubmit,
  onDeleteAlias,
}: AddAliasModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPart, setLocalPart] = useState("");
  const [deletingAlias, setDeletingAlias] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setLocalPart("");
      setError(null);
    }
  }, [isOpen]);

  const previewEmail = localPart ? `${localPart}@${domain}` : "";
  const canAddMore = existingAliases.length < maxAliases;

  // ---------- HANDLERS ----------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!localPart.trim()) {
      setError(t("addAlias.errors.localPartRequired"));
      return;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(localPart)) {
      setError(t("addAlias.errors.invalidFormat"));
      return;
    }

    if (existingAliases.includes(previewEmail)) {
      setError(t("addAlias.errors.alreadyExists"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit(previewEmail);
      setLocalPart("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("addAlias.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlias = async (alias: string) => {
    setDeletingAlias(alias);
    try {
      await onDeleteAlias(alias);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("addAlias.errors.deleteError"));
    } finally {
      setDeletingAlias(null);
    }
  };

  const handleClose = () => {
    setLocalPart("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("addAlias.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="modal-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Info banner */}
          <div className="info-banner">
            <span className="info-icon">ℹ</span>
            <p>{t("addAlias.infoBanner")}</p>
          </div>

          {/* Account info */}
          <div className="account-info-card">
            <div className="account-primary">
              <span className="account-label">{t("addAlias.primaryAccount")}</span>
              <span className="account-email">{email}</span>
            </div>
            <OfferBadge offer={offer} />
          </div>

          {/* Add alias form */}
          {canAddMore ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t("addAlias.fields.alias")}</label>
                <div className="email-input-group">
                  <input
                    type="text"
                    className="form-input"
                    value={localPart}
                    onChange={(e) => setLocalPart(e.target.value.toLowerCase())}
                    placeholder="contact"
                    disabled={loading}
                  />
                  <span className="email-domain">@{domain}</span>
                </div>
              </div>

              {/* Preview */}
              {previewEmail && (
                <div className="alias-preview">
                  <span className="preview-arrow">→</span>
                  <span className="preview-mapping">
                    {previewEmail} → {email}
                  </span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading || !localPart}>
                {loading ? t("common.creating") : t("addAlias.submit")}
              </button>
            </form>
          ) : (
            <div className="limit-reached">
              <span className="limit-icon">⚠</span>
              <span>{t("addAlias.limitReached", { max: maxAliases })}</span>
            </div>
          )}

          {/* Existing aliases */}
          {existingAliases.length > 0 && (
            <div className="existing-aliases">
              <label className="form-label">
                {t("addAlias.existingAliases")} ({existingAliases.length}/{maxAliases})
              </label>
              <div className="alias-tags">
                {existingAliases.map((alias) => (
                  <div key={alias} className="alias-tag">
                    <span>{alias}</span>
                    <button
                      type="button"
                      className="alias-remove"
                      onClick={() => handleDeleteAlias(alias)}
                      disabled={deletingAlias === alias}
                    >
                      {deletingAlias === alias ? "..." : "×"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={handleClose}>
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
