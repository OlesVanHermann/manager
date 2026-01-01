// ============================================================
// MODAL - Create Redirection (Création de redirection)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateRedirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  existingEmails: string[];
  onSubmit: (data: CreateRedirectionData) => Promise<void>;
}

interface CreateRedirectionData {
  from: string;
  to: string;
  keepCopy: boolean;
}

/** Modal de création d'une redirection email. */
export function CreateRedirectionModal({
  isOpen,
  onClose,
  domain,
  existingEmails,
  onSubmit,
}: CreateRedirectionModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fromType, setFromType] = useState<"existing" | "new">("existing");
  const [fromExisting, setFromExisting] = useState("");
  const [fromNew, setFromNew] = useState("");
  const [to, setTo] = useState("");
  const [keepCopy, setKeepCopy] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const from = fromType === "existing" ? fromExisting : `${fromNew}@${domain}`;

    if (!from) {
      setError(t("createRedirection.errors.fromRequired"));
      return;
    }

    if (!to.includes("@")) {
      setError(t("createRedirection.errors.toInvalid"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ from, to, keepCopy });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createRedirection.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFromExisting("");
    setFromNew("");
    setTo("");
    setKeepCopy(true);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{t("createRedirection.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="modal-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            {/* From address */}
            <div className="form-group">
              <label className="form-label">{t("createRedirection.fields.from")}</label>

              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="fromType"
                    checked={fromType === "existing"}
                    onChange={() => setFromType("existing")}
                    disabled={loading}
                  />
                  {t("createRedirection.fromExisting")}
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="fromType"
                    checked={fromType === "new"}
                    onChange={() => setFromType("new")}
                    disabled={loading}
                  />
                  {t("createRedirection.fromNew")}
                </label>
              </div>

              {fromType === "existing" ? (
                <select
                  className="form-select"
                  value={fromExisting}
                  onChange={(e) => setFromExisting(e.target.value)}
                  disabled={loading}
                >
                  <option value="">{t("createRedirection.selectEmail")}</option>
                  {existingEmails.map((email) => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              ) : (
                <div className="email-input-group">
                  <input
                    type="text"
                    className="form-input"
                    value={fromNew}
                    onChange={(e) => setFromNew(e.target.value.toLowerCase())}
                    placeholder="alias"
                    disabled={loading}
                  />
                  <span className="email-domain">@{domain}</span>
                </div>
              )}
            </div>

            {/* To address */}
            <div className="form-group">
              <label className="form-label">{t("createRedirection.fields.to")}</label>
              <input
                type="email"
                className="form-input"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="destination@example.com"
                disabled={loading}
              />
            </div>

            {/* Keep copy */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={keepCopy}
                  onChange={(e) => setKeepCopy(e.target.checked)}
                  disabled={loading}
                />
                {t("createRedirection.fields.keepCopy")}
              </label>
              <span className="form-hint">{t("createRedirection.keepCopyHint")}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("createRedirection.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
