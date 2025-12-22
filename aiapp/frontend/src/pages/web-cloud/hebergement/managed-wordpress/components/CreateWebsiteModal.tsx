// ============================================================
// MODAL: Créer un site WordPress
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { managedWordPressService } from "../../../../../services/web-cloud.managed-wordpress";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    domain: "",
    title: "Mon site WordPress",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
    language: "fr_FR",
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const languages = [
    { value: "fr_FR", label: "Français" },
    { value: "en_US", label: "English" },
    { value: "de_DE", label: "Deutsch" },
    { value: "es_ES", label: "Español" },
    { value: "it_IT", label: "Italiano" },
    { value: "pt_PT", label: "Português" },
  ];

  const isValid = form.domain && form.adminEmail && form.adminPassword && 
                  form.adminPassword === form.confirmPassword &&
                  form.adminPassword.length >= 8;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await managedWordPressService.createWebsite(serviceName, {
        domain: form.domain,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
        language: form.language,
        title: form.title,
      });
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("create.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="info-banner error">
              <span className="info-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>{t("create.domain")} *</label>
            <input
              type="text"
              className="form-input"
              placeholder="www.example.com"
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
            />
            <span className="form-hint">{t("create.domainHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("create.siteTitle")}</label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t("create.adminEmail")} *</label>
              <input
                type="email"
                className="form-input"
                value={form.adminEmail}
                onChange={e => setForm({ ...form, adminEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{t("create.language")}</label>
              <select
                className="form-select"
                value={form.language}
                onChange={e => setForm({ ...form, language: e.target.value })}
              >
                {languages.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t("create.adminPassword")} *</label>
              <input
                type="password"
                className="form-input"
                value={form.adminPassword}
                onChange={e => setForm({ ...form, adminPassword: e.target.value })}
              />
              <span className="form-hint">{t("create.passwordHint")}</span>
            </div>
            <div className="form-group">
              <label>{t("create.confirmPassword")} *</label>
              <input
                type="password"
                className="form-input"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              />
              {form.confirmPassword && form.adminPassword !== form.confirmPassword && (
                <span className="form-error">{t("create.passwordMismatch")}</span>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !isValid}>
            {loading ? t("common.creating") : t("create.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWebsiteModal;
