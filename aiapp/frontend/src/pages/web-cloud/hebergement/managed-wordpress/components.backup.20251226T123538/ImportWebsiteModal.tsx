// ============================================================
// MODAL: Import Website - Managed WordPress
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../services/api";
import type { ImportWebsiteParams } from "../managed-wordpress.types";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export function ImportWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [formData, setFormData] = useState<ImportWebsiteParams>({
    domain: "",
    ftpUrl: "",
    ftpUser: "",
    ftpPassword: "",
    dbUrl: "",
    dbUser: "",
    dbPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleChange = (field: keyof ImportWebsiteParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain || !formData.ftpUrl || !formData.ftpUser || !formData.ftpPassword) return;

    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`${BASE_PATH}/${serviceName}/website/import`, formData, API_OPTIONS);
      onSuccess();
      setFormData({ domain: "", ftpUrl: "", ftpUser: "", ftpPassword: "", dbUrl: "", dbUser: "", dbPassword: "" });
      setStep(1);
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
          <h3>{t("website.importTitle")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="steps-indicator">
              <span className={`step ${step >= 1 ? "active" : ""}`}>1. Domaine</span>
              <span className={`step ${step >= 2 ? "active" : ""}`}>2. FTP</span>
              <span className={`step ${step >= 3 ? "active" : ""}`}>3. Base de données</span>
            </div>

            {step === 1 && (
              <div className="form-group">
                <label>{t("website.domain")} *</label>
                <input type="text" className="form-input" value={formData.domain} onChange={e => handleChange("domain", e.target.value)} placeholder="example.com" required />
                <span className="form-hint">{t("website.domainHint")}</span>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label>{t("import.ftpUrl")} *</label>
                  <input type="text" className="form-input" value={formData.ftpUrl} onChange={e => handleChange("ftpUrl", e.target.value)} placeholder="ftp://ftp.example.com/www" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("import.ftpUser")} *</label>
                    <input type="text" className="form-input" value={formData.ftpUser} onChange={e => handleChange("ftpUser", e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>{t("import.ftpPassword")} *</label>
                    <input type="password" className="form-input" value={formData.ftpPassword} onChange={e => handleChange("ftpPassword", e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <label>{t("import.dbUrl")}</label>
                  <input type="text" className="form-input" value={formData.dbUrl || ""} onChange={e => handleChange("dbUrl", e.target.value)} placeholder="mysql://host:3306/database" />
                  <span className="form-hint">{t("import.dbOptional")}</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("import.dbUser")}</label>
                    <input type="text" className="form-input" value={formData.dbUser || ""} onChange={e => handleChange("dbUser", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>{t("import.dbPassword")}</label>
                    <input type="password" className="form-input" value={formData.dbPassword || ""} onChange={e => handleChange("dbPassword", e.target.value)} />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
            {step > 1 && <button type="button" className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Précédent</button>}
            {step < 3 ? (
              <button type="button" className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Suivant →</button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? t("common.importing") : t("website.import")}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportWebsiteModal;
