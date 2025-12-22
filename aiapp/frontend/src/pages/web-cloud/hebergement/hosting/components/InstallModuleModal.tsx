// ============================================================
// INSTALL MODULE MODAL - Installer un module en 1 clic
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MODULES = [
  { id: 1, name: "WordPress", icon: "📝", desc: "CMS le plus populaire au monde" },
  { id: 2, name: "PrestaShop", icon: "🛒", desc: "Solution e-commerce complète" },
  { id: 3, name: "Joomla", icon: "🌐", desc: "CMS flexible et extensible" },
  { id: 4, name: "Drupal", icon: "💧", desc: "CMS robuste pour sites complexes" },
];

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
];

/** Modal wizard pour installer un module en 1 clic. */
export function InstallModuleModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [step, setStep] = useState(1);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [path, setPath] = useState("/");
  const [adminName, setAdminName] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [language, setLanguage] = useState("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDomains();
    }
  }, [isOpen]);

  const loadDomains = async () => {
    try {
      const names = await hostingService.listAttachedDomains(serviceName);
      const data = await Promise.all(names.map(d => hostingService.getAttachedDomain(serviceName, d)));
      setDomains(data);
      if (data.length > 0) setSelectedDomain(data[0].domain);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedModule || !selectedDomain) {
      setError("Veuillez sélectionner un module et un domaine");
      return;
    }
    if (!adminPassword || adminPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.installModule(serviceName, {
        moduleId: selectedModule,
        domain: selectedDomain,
        path: path.trim() || "/",
        adminName: adminName.trim(),
        adminPassword,
        language,
      });
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedModule(null);
    setSelectedDomain("");
    setPath("/");
    setAdminName("admin");
    setAdminPassword("");
    setAdminEmail("");
    setLanguage("fr");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return selectedModule !== null;
    if (step === 2) return selectedDomain !== "";
    if (step === 3) return adminPassword.length >= 8;
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("modules.install")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          {/* Progress */}
          <div className="wizard-progress">
            <div className={`wizard-step ${step >= 1 ? 'active' : ''}`}>1. Module</div>
            <div className={`wizard-step ${step >= 2 ? 'active' : ''}`}>2. Domaine</div>
            <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>3. Configuration</div>
          </div>

          {/* Step 1: Choix du module */}
          {step === 1 && (
            <div className="wizard-content">
              <h4>Choisissez un module</h4>
              <div className="module-grid">
                {MODULES.map(mod => (
                  <div
                    key={mod.id}
                    className={`module-card ${selectedModule === mod.id ? 'selected' : ''}`}
                    onClick={() => setSelectedModule(mod.id)}
                  >
                    <span className="module-icon">{mod.icon}</span>
                    <span className="module-name">{mod.name}</span>
                    <span className="module-desc">{mod.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choix du domaine */}
          {step === 2 && (
            <div className="wizard-content">
              <h4>Choisissez le domaine</h4>
              <div className="form-group">
                <label className="form-label">Domaine</label>
                <select
                  className="form-select"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  {domains.map(d => (
                    <option key={d.domain} value={d.domain}>{d.domain}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Chemin d'installation</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/"
                />
                <span className="form-hint">Laissez "/" pour installer à la racine</span>
              </div>
            </div>
          )}

          {/* Step 3: Configuration admin */}
          {step === 3 && (
            <div className="wizard-content">
              <h4>Configuration administrateur</h4>
              <div className="form-group">
                <label className="form-label">Identifiant admin</label>
                <input
                  type="text"
                  className="form-input"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="admin"
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Mot de passe admin</label>
                <input
                  type="password"
                  className="form-input"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <span className="form-hint">Minimum 8 caractères</span>
              </div>
              <div className="form-group">
                <label className="form-label">Langue</label>
                <select
                  className="form-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Annuler
          </button>
          {step > 1 && (
            <button type="button" className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              Précédent
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
            >
              {loading ? "Installation..." : "Installer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstallModuleModal;
