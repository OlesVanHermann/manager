// ============================================================
// MODAL: Importer un site WordPress existant
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

export function ImportWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domain: "",
    ftpUrl: "",
    ftpUser: "",
    ftpPassword: "",
    dbUrl: "",
    dbUser: "",
    dbPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isStep1Valid = form.domain && form.ftpUrl && form.ftpUser && form.ftpPassword;
  const isStep2Valid = !form.dbUrl || (form.dbUrl && form.dbUser && form.dbPassword);

  const handleSubmit = async () => {
    if (!isStep1Valid) return;
    setLoading(true);
    setError(null);
    try {
      await managedWordPressService.importWebsite(serviceName, {
        domain: form.domain,
        ftpUrl: form.ftpUrl,
        ftpUser: form.ftpUser,
        ftpPassword: form.ftpPassword,
        dbUrl: form.dbUrl || undefined,
        dbUser: form.dbUser || undefined,
        dbPassword: form.dbPassword || undefined,
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
          <h3>{t("import.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="info-banner error">
              <span className="info-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Steps indicator */}
          <div className="steps-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1. {t("import.step1")}</div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2. {t("import.step2")}</div>
          </div>

          {step === 1 && (
            <>
              <div className="form-group">
                <label>{t("import.domain")} *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="www.example.com"
                  value={form.domain}
                  onChange={e => setForm({ ...form, domain: e.target.value })}
                />
              </div>

              <h4>{t("import.ftpAccess")}</h4>
              <div className="form-group">
                <label>{t("import.ftpUrl")} *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ftp://ftp.example.com/www"
                  value={form.ftpUrl}
                  onChange={e => setForm({ ...form, ftpUrl: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t("import.ftpUser")} *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.ftpUser}
                    onChange={e => setForm({ ...form, ftpUser: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{t("import.ftpPassword")} *</label>
                  <input
                    type="password"
                    className="form-input"
                    value={form.ftpPassword}
                    onChange={e => setForm({ ...form, ftpPassword: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="info-banner info">
                <span className="info-icon">ℹ️</span>
                <span>{t("import.dbOptional")}</span>
              </div>

              <h4>{t("import.dbAccess")}</h4>
              <div className="form-group">
                <label>{t("import.dbUrl")}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="mysql://host:3306/database"
                  value={form.dbUrl}
                  onChange={e => setForm({ ...form, dbUrl: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t("import.dbUser")}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.dbUser}
                    onChange={e => setForm({ ...form, dbUser: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{t("import.dbPassword")}</label>
                  <input
                    type="password"
                    className="form-input"
                    value={form.dbPassword}
                    onChange={e => setForm({ ...form, dbPassword: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
          {step === 1 && (
            <button 
              className="btn btn-primary" 
              onClick={() => setStep(2)} 
              disabled={!isStep1Valid}
            >
              {t("common.next")}
            </button>
          )}
          {step === 2 && (
            <>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                {t("common.previous")}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit} 
                disabled={loading || !isStep2Valid}
              >
                {loading ? t("common.importing") : t("import.submit")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImportWebsiteModal;
