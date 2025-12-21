// ============================================================
// MODAL: Installer un module en 1 clic
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ModuleTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
}

const MODULE_TEMPLATES: ModuleTemplate[] = [
  { id: "wordpress", name: "WordPress", icon: "📝", description: "CMS le plus populaire", category: "cms" },
  { id: "prestashop", name: "PrestaShop", icon: "🛒", description: "E-commerce professionnel", category: "ecommerce" },
  { id: "joomla", name: "Joomla", icon: "🌐", description: "CMS flexible", category: "cms" },
  { id: "drupal", name: "Drupal", icon: "💧", description: "CMS entreprise", category: "cms" },
  { id: "nextcloud", name: "Nextcloud", icon: "☁️", description: "Cloud privé", category: "tools" },
  { id: "dolibarr", name: "Dolibarr", icon: "📊", description: "ERP/CRM", category: "business" },
];

/** Modal d'installation de module en 1 clic. */
export function InstallModuleModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [step, setStep] = useState(1);
  const [selectedModule, setSelectedModule] = useState<ModuleTemplate | null>(null);
  const [domain, setDomain] = useState("");
  const [path, setPath] = useState("/");
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [language, setLanguage] = useState("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // ---------- HANDLERS ----------
  const handleClose = () => {
    setStep(1);
    setSelectedModule(null);
    setDomain("");
    setPath("/");
    setAdminUser("admin");
    setAdminPassword("");
    setAdminEmail("");
    setError(null);
    onClose();
  };

  const handleSelectModule = (module: ModuleTemplate) => {
    setSelectedModule(module);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!selectedModule) return;
    if (!domain.trim()) {
      setError(t("installModule.errorDomainRequired"));
      return;
    }
    if (!adminPassword || adminPassword.length < 8) {
      setError(t("installModule.errorPasswordMin"));
      return;
    }
    if (!adminEmail.includes("@")) {
      setError(t("installModule.errorEmailInvalid"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.installModule(serviceName, {
        moduleId: selectedModule.id,
        domain: domain.trim(),
        path: path.trim() || "/",
        adminName: adminUser.trim(),
        adminPassword,
        adminEmail: adminEmail.trim(),
        language,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("installModule.title")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          {step === 1 && (
            <div className="step-content">
              <p className="step-description">{t("installModule.step1Desc")}</p>
              <div className="module-grid">
                {MODULE_TEMPLATES.map((mod) => (
                  <button
                    key={mod.id}
                    className="module-option"
                    onClick={() => handleSelectModule(mod)}
                  >
                    <span className="module-icon">{mod.icon}</span>
                    <span className="module-name">{mod.name}</span>
                    <span className="module-desc">{mod.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedModule && (
            <div className="step-content">
              <div className="selected-module-header">
                <span className="module-icon-lg">{selectedModule.icon}</span>
                <div>
                  <h4>{selectedModule.name}</h4>
                  <p>{selectedModule.description}</p>
                </div>
              </div>

              <div className="form-group">
                <label>{t("installModule.domainLabel")}</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="monsite.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>{t("installModule.pathLabel")}</label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/"
                  className="form-input font-mono"
                />
                <span className="form-hint">{t("installModule.pathHint")}</span>
              </div>
            </div>
          )}

          {step === 3 && selectedModule && (
            <div className="step-content">
              <p className="step-description">{t("installModule.step3Desc")}</p>

              <div className="form-row">
                <div className="form-group">
                  <label>{t("installModule.adminUserLabel")}</label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>{t("installModule.languageLabel")}</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="form-select">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{t("installModule.adminEmailLabel")}</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>{t("installModule.adminPasswordLabel")}</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="form-input"
                />
                <span className="form-hint">{t("installModule.passwordHint")}</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="step-indicator">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`step-dot ${step >= s ? "active" : ""}`} />
            ))}
          </div>
          <div className="modal-actions">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={() => setStep(step - 1)} disabled={loading}>
                {t("installModule.back")}
              </button>
            )}
            {step === 2 && (
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                {t("installModule.next")}
              </button>
            )}
            {step === 3 && (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? t("installModule.installing") : t("installModule.confirm")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallModuleModal;
