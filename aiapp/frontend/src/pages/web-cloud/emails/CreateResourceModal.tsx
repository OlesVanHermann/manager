// ============================================================
// MODAL - Create Resource (Création de ressource partagée)
// Aligné avec target_.web-cloud.emails.modal.create-resource.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "./OfferBadge";

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  onSubmit: (data: CreateResourceData) => Promise<void>;
}

interface CreateResourceData {
  name: string;
  localPart: string;
  type: "room" | "equipment";
  capacity?: number;
  location?: string;
  bookable: boolean;
  autoAccept: boolean;
  allowConflicts: boolean;
}

/** Modal de création d'une ressource partagée (salle ou équipement). */
export function CreateResourceModal({
  isOpen,
  onClose,
  domain,
  onSubmit,
}: CreateResourceModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [localPart, setLocalPart] = useState("");
  const [type, setType] = useState<"room" | "equipment">("room");
  const [capacity, setCapacity] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [bookable, setBookable] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [allowConflicts, setAllowConflicts] = useState(false);

  // Auto-generate localPart from name
  const generateLocalPart = (resourceName: string): string => {
    return resourceName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 30);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-fill localPart if empty or was auto-generated
    if (!localPart || localPart === generateLocalPart(name)) {
      setLocalPart(generateLocalPart(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(t("createResource.errors.nameRequired"));
      return;
    }

    if (!localPart.trim()) {
      setError(t("createResource.errors.localPartRequired"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name,
        localPart,
        type,
        capacity: type === "room" && capacity ? Number(capacity) : undefined,
        location: location || undefined,
        bookable,
        autoAccept,
        allowConflicts,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createResource.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setLocalPart("");
    setType("room");
    setCapacity("");
    setLocation("");
    setBookable(true);
    setAutoAccept(false);
    setAllowConflicts(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">🏢</span>
          <h2 className="modal-title">{t("createResource.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Exchange only badge */}
            <div className="feature-badge feature-badge-exchange">
              <OfferBadge offer="exchange" size="sm" />
              <span className="feature-text">{t("createResource.exchangeOnly")}</span>
              <span className="feature-domain">{domain}</span>
            </div>

            {error && (
              <div className="modal-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            {/* Resource type */}
            <div className="form-group">
              <label className="form-label">{t("createResource.fields.type")}</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${type === "room" ? "selected" : ""}`}
                  onClick={() => setType("room")}
                  disabled={loading}
                >
                  🏢 {t("createResource.types.room")}
                </button>
                <button
                  type="button"
                  className={`type-btn ${type === "equipment" ? "selected" : ""}`}
                  onClick={() => setType("equipment")}
                  disabled={loading}
                >
                  🖨️ {t("createResource.types.equipment")}
                </button>
              </div>
            </div>

            {/* Resource name */}
            <div className="form-group">
              <label className="form-label">{t("createResource.fields.name")} *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={type === "room" ? t("createResource.placeholders.roomName") : t("createResource.placeholders.equipmentName")}
                disabled={loading}
              />
            </div>

            {/* Email address */}
            <div className="form-group">
              <label className="form-label">{t("createResource.fields.email")}</label>
              <div className="email-input-group">
                <input
                  type="text"
                  className="form-input"
                  value={localPart}
                  onChange={(e) => setLocalPart(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder={type === "room" ? "salle-a" : "videoproj"}
                  disabled={loading}
                />
                <span className="email-domain">@{domain}</span>
              </div>
            </div>

            {/* Room-specific fields */}
            {type === "room" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t("createResource.fields.capacity")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : "")}
                      placeholder="10"
                      min={1}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("createResource.fields.location")}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t("createResource.placeholders.location")}
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Booking options */}
            <div className="form-group">
              <label className="form-label">{t("createResource.fields.bookingOptions")}</label>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={bookable}
                    onChange={(e) => setBookable(e.target.checked)}
                    disabled={loading}
                  />
                  {t("createResource.options.bookable")}
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={autoAccept}
                    onChange={(e) => setAutoAccept(e.target.checked)}
                    disabled={loading || !bookable}
                  />
                  {t("createResource.options.autoAccept")}
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={allowConflicts}
                    onChange={(e) => setAllowConflicts(e.target.checked)}
                    disabled={loading || !bookable}
                  />
                  {t("createResource.options.allowConflicts")}
                </label>
              </div>
            </div>

            {/* Info box */}
            <div className="info-box info-box-primary">
              <span className="info-icon">ℹ️</span>
              <div className="info-content">
                <p>{t("createResource.info.visibility")}</p>
                <p>{t("createResource.info.booking")}</p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("createResource.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
