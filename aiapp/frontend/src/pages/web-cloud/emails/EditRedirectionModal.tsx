// ============================================================
// MODAL - Edit Redirection (Modification de redirection)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Redirection {
  id: string;
  from: string;
  to: string;
  keepCopy: boolean;
}

interface EditRedirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  redirection: Redirection | null;
  onSubmit: (id: string, data: EditRedirectionData) => Promise<void>;
}

interface EditRedirectionData {
  to: string;
  keepCopy: boolean;
}

/** Modal de modification d'une redirection email. */
export function EditRedirectionModal({
  isOpen,
  onClose,
  domain,
  redirection,
  onSubmit,
}: EditRedirectionModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [to, setTo] = useState("");
  const [keepCopy, setKeepCopy] = useState(true);

  // Reset form when redirection changes
  useEffect(() => {
    if (redirection) {
      setTo(redirection.to);
      setKeepCopy(redirection.keepCopy);
      setError(null);
    }
  }, [redirection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!redirection) return;

    if (!to.includes("@")) {
      setError(t("editRedirection.errors.toInvalid"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit(redirection.id, { to, keepCopy });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("editRedirection.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTo("");
    setKeepCopy(true);
    setError(null);
    onClose();
  };

  if (!isOpen || !redirection) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{t("editRedirection.title")}</h2>
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

            {/* From address (read-only) */}
            <div className="form-group">
              <label className="form-label">{t("editRedirection.fields.from")}</label>
              <input
                type="text"
                className="form-input"
                value={redirection.from}
                disabled
              />
              <span className="form-hint">{t("editRedirection.fromHint")}</span>
            </div>

            {/* To address */}
            <div className="form-group">
              <label className="form-label">{t("editRedirection.fields.to")}</label>
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
                {t("editRedirection.fields.keepCopy")}
              </label>
              <span className="form-hint">{t("editRedirection.keepCopyHint")}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.saving") : t("editRedirection.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
