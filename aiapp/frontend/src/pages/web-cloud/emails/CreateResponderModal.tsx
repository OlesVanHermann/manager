// ============================================================
// MODAL - Create Responder (Création de répondeur automatique)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateResponderModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingEmails: string[];
  onSubmit: (data: CreateResponderData) => Promise<void>;
}

interface CreateResponderData {
  email: string;
  content: string;
  startDate: string;
  endDate: string | null;
  copyTo?: string;
}

/** Modal de création d'un répondeur automatique. */
export function CreateResponderModal({
  isOpen,
  onClose,
  existingEmails,
  onSubmit,
}: CreateResponderModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [hasEndDate, setHasEndDate] = useState(true);
  const [endDate, setEndDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  });
  const [copyTo, setCopyTo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError(t("createResponder.errors.emailRequired"));
      return;
    }

    if (!content.trim()) {
      setError(t("createResponder.errors.contentRequired"));
      return;
    }

    if (hasEndDate && endDate < startDate) {
      setError(t("createResponder.errors.endDateInvalid"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        email,
        content,
        startDate,
        endDate: hasEndDate ? endDate : null,
        copyTo: copyTo || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createResponder.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setContent("");
    setCopyTo("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("createResponder.title")}</h2>
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

            {/* Email selection */}
            <div className="form-group">
              <label className="form-label">{t("createResponder.fields.email")}</label>
              <select
                className="form-select"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              >
                <option value="">{t("createResponder.selectEmail")}</option>
                {existingEmails.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
            </div>

            {/* Message content */}
            <div className="form-group">
              <label className="form-label">{t("createResponder.fields.content")}</label>
              <textarea
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("createResponder.placeholders.content")}
                rows={6}
                disabled={loading}
              />
            </div>

            {/* Date range */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t("createResponder.fields.startDate")}</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <span>{t("createResponder.fields.endDate")}</span>
                  <label className="checkbox-inline">
                    <input
                      type="checkbox"
                      checked={hasEndDate}
                      onChange={(e) => setHasEndDate(e.target.checked)}
                      disabled={loading}
                    />
                    {t("createResponder.hasEndDate")}
                  </label>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={loading || !hasEndDate}
                />
              </div>
            </div>

            {/* Copy to */}
            <div className="form-group">
              <label className="form-label">{t("createResponder.fields.copyTo")}</label>
              <input
                type="email"
                className="form-input"
                value={copyTo}
                onChange={(e) => setCopyTo(e.target.value)}
                placeholder={t("createResponder.placeholders.copyTo")}
                disabled={loading}
              />
              <span className="form-hint">{t("createResponder.copyToHint")}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("createResponder.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
