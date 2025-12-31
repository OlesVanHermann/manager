// ============================================================
// MODAL - Create Contact (Création de contact partagé)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: { id: string; name: string }[];
  onSubmit: (data: CreateContactData) => Promise<void>;
}

interface CreateContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  department?: string;
  folderId: string;
}

/** Modal de création d'un contact partagé. */
export function CreateContactModal({
  isOpen,
  onClose,
  folders,
  onSubmit,
}: CreateContactModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [folderId, setFolderId] = useState(folders[0]?.id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() && !lastName.trim()) {
      setError(t("createContact.errors.nameRequired"));
      return;
    }

    if (!email.includes("@")) {
      setError(t("createContact.errors.emailInvalid"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        company: company || undefined,
        department: department || undefined,
        folderId,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createContact.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setDepartment("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("createContact.title")}</h2>
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

            {/* Name */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t("createContact.fields.firstName")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("createContact.fields.lastName")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">{t("createContact.fields.email")} *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@example.com"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">{t("createContact.fields.phone")}</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                disabled={loading}
              />
            </div>

            {/* Company */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t("createContact.fields.company")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("createContact.fields.department")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Direction"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Folder */}
            <div className="form-group">
              <label className="form-label">{t("createContact.fields.folder")}</label>
              <select
                className="form-select"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                disabled={loading}
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("createContact.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
