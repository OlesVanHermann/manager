// ============================================================
// MODAL - Delete (Suppression générique)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "account" | "redirection" | "responder" | "list" | "alias" | "resource" | "contact";
  itemName: string;
  consequences?: string[];
  onSubmit: () => Promise<void>;
}

/** Modal de suppression générique avec confirmation simplifiée. */
export function DeleteModal({
  isOpen,
  onClose,
  itemType,
  itemName,
  consequences,
  onSubmit,
}: DeleteModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default consequences based on item type
  const defaultConsequences = useMemo(() => {
    switch (itemType) {
      case "account":
        return [
          t("delete.consequences.account.emails"),
          t("delete.consequences.account.redirections"),
          t("delete.consequences.account.aliases"),
          t("delete.consequences.account.license"),
        ];
      case "redirection":
        return [t("delete.consequences.redirection.stop")];
      case "responder":
        return [t("delete.consequences.responder.stop")];
      case "list":
        return [
          t("delete.consequences.list.members"),
          t("delete.consequences.list.messages"),
        ];
      case "alias":
        return [t("delete.consequences.alias.stop")];
      case "resource":
        return [
          t("delete.consequences.resource.bookings"),
          t("delete.consequences.resource.calendar"),
        ];
      case "contact":
        return [t("delete.consequences.contact.remove")];
      default:
        return [];
    }
  }, [itemType, t]);

  const displayConsequences = consequences || defaultConsequences;

  // ---------- HANDLERS ----------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      await onSubmit();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("delete.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-danger">
        <div className="modal-header">
          <h2 className="modal-title">{t(`delete.titles.${itemType}`)}</h2>
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

            {/* Item info */}
            <div className="delete-item">
              <span className="delete-item-label">{t(`delete.labels.${itemType}`)}</span>
              <span className="delete-item-name">{itemName}</span>
            </div>

            {/* Consequences */}
            {displayConsequences.length > 0 && (
              <div className="delete-info">
                <p>{t("delete.consequencesTitle")}</p>
                <ul>
                  {displayConsequences.map((consequence, index) => (
                    <li key={index}>{consequence}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? t("common.deleting") : t("delete.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
