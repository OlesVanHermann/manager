// ============================================================
// MODAL: Create Website - Managed WordPress
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../services/api";
import type { CreateWebsiteParams } from "../managed-wordpress.types";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export function CreateWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [formData, setFormData] = useState<CreateWebsiteParams>({
    domain: "",
    adminEmail: "",
    adminPassword: "",
    language: "fr_FR",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CreateWebsiteParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain || !formData.adminEmail || !formData.adminPassword) return;

    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`${BASE_PATH}/${serviceName}/website`, formData, API_OPTIONS);
      onSuccess();
      setFormData({ domain: "", adminEmail: "", adminPassword: "", language: "fr_FR", title: "" });
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("website.createTitle")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="form-group">
              <label>{t("website.domain")} *</label>
              <input type="text" className="form-input" value={formData.domain} onChange={e => handleChange("domain", e.target.value)} placeholder="example.com" required />
            </div>

            <div className="form-group">
              <label>{t("website.title")}</label>
              <input type="text" className="form-input" value={formData.title} onChange={e => handleChange("title", e.target.value)} placeholder="Mon site WordPress" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t("website.adminEmail")} *</label>
                <input type="email" className="form-input" value={formData.adminEmail} onChange={e => handleChange("adminEmail", e.target.value)} placeholder="admin@example.com" required />
              </div>
              <div className="form-group">
                <label>{t("website.adminPassword")} *</label>
                <input type="password" className="form-input" value={formData.adminPassword} onChange={e => handleChange("adminPassword", e.target.value)} minLength={8} required />
              </div>
            </div>

            <div className="form-group">
              <label>{t("website.language")}</label>
              <select className="form-select" value={formData.language} onChange={e => handleChange("language", e.target.value)}>
                <option value="fr_FR">Français</option>
                <option value="en_US">English</option>
                <option value="de_DE">Deutsch</option>
                <option value="es_ES">Español</option>
                <option value="it_IT">Italiano</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
            <button type="submit" className="mwp-modal-btn-primary" disabled={loading}>{loading ? t("common.creating") : t("website.create")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWebsiteModal;
