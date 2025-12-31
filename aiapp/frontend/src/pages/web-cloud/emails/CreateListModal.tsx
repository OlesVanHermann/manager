// ============================================================
// MODAL - Create List (Création de liste de diffusion)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  onSubmit: (data: CreateListData) => Promise<void>;
}

interface CreateListData {
  name: string;
  localPart: string;
  moderationType: "open" | "moderated" | "closed";
  description?: string;
  welcomeMessage?: string;
}

/** Modal de création d'une liste de diffusion. */
export function CreateListModal({
  isOpen,
  onClose,
  domain,
  onSubmit,
}: CreateListModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [localPart, setLocalPart] = useState("");
  const [moderationType, setModerationType] = useState<"open" | "moderated" | "closed">("moderated");
  const [description, setDescription] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(t("createList.errors.nameRequired"));
      return;
    }

    if (!localPart.trim()) {
      setError(t("createList.errors.localPartRequired"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name,
        localPart,
        moderationType,
        description: description || undefined,
        welcomeMessage: welcomeMessage || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createList.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setLocalPart("");
    setModerationType("moderated");
    setDescription("");
    setWelcomeMessage("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("createList.title")}</h2>
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

            {/* List name */}
            <div className="form-group">
              <label className="form-label">{t("createList.fields.name")}</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("createList.placeholders.name")}
                disabled={loading}
              />
            </div>

            {/* Email address */}
            <div className="form-group">
              <label className="form-label">{t("createList.fields.email")}</label>
              <div className="email-input-group">
                <input
                  type="text"
                  className="form-input"
                  value={localPart}
                  onChange={(e) => setLocalPart(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="team"
                  disabled={loading}
                />
                <span className="email-domain">@{domain}</span>
              </div>
            </div>

            {/* Moderation type */}
            <div className="form-group">
              <label className="form-label">{t("createList.fields.moderationType")}</label>
              <div className="moderation-options">
                <label className={`moderation-option ${moderationType === "open" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="moderationType"
                    value="open"
                    checked={moderationType === "open"}
                    onChange={() => setModerationType("open")}
                    disabled={loading}
                  />
                  <div className="moderation-content">
                    <span className="moderation-title">{t("createList.moderation.open")}</span>
                    <span className="moderation-desc">{t("createList.moderation.openDesc")}</span>
                  </div>
                </label>
                <label className={`moderation-option ${moderationType === "moderated" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="moderationType"
                    value="moderated"
                    checked={moderationType === "moderated"}
                    onChange={() => setModerationType("moderated")}
                    disabled={loading}
                  />
                  <div className="moderation-content">
                    <span className="moderation-title">{t("createList.moderation.moderated")}</span>
                    <span className="moderation-desc">{t("createList.moderation.moderatedDesc")}</span>
                  </div>
                </label>
                <label className={`moderation-option ${moderationType === "closed" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="moderationType"
                    value="closed"
                    checked={moderationType === "closed"}
                    onChange={() => setModerationType("closed")}
                    disabled={loading}
                  />
                  <div className="moderation-content">
                    <span className="moderation-title">{t("createList.moderation.closed")}</span>
                    <span className="moderation-desc">{t("createList.moderation.closedDesc")}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">{t("createList.fields.description")}</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("createList.placeholders.description")}
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("createList.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
