// ============================================================
// MODAL: Créer une tâche planifiée (cron)
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

const FREQUENCIES = [
  { value: "0 * * * *", label: "Toutes les heures" },
  { value: "0 0 * * *", label: "Tous les jours à minuit" },
  { value: "0 0 * * 0", label: "Tous les dimanches" },
  { value: "0 0 1 * *", label: "Le 1er du mois" },
  { value: "*/5 * * * *", label: "Toutes les 5 minutes" },
  { value: "*/15 * * * *", label: "Toutes les 15 minutes" },
  { value: "*/30 * * * *", label: "Toutes les 30 minutes" },
];

const LANGUAGES = [
  { value: "php", label: "PHP" },
  { value: "node18", label: "Node.js 18" },
  { value: "node16", label: "Node.js 16" },
  { value: "python3", label: "Python 3" },
  { value: "ruby", label: "Ruby" },
  { value: "other", label: "Autre (script shell)" },
];

/** Modal de création de tâche planifiée. */
export function CreateCronModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [command, setCommand] = useState("");
  const [frequency, setFrequency] = useState("0 * * * *");
  const [customFrequency, setCustomFrequency] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [language, setLanguage] = useState("php");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // ---------- HANDLERS ----------
  const handleClose = () => {
    setCommand("");
    setFrequency("0 * * * *");
    setCustomFrequency("");
    setUseCustom(false);
    setLanguage("php");
    setEmail("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!command.trim()) {
      setError(t("createCron.errorCommandRequired"));
      return;
    }
    const finalFrequency = useCustom ? customFrequency.trim() : frequency;
    if (!finalFrequency) {
      setError(t("createCron.errorFrequencyRequired"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createCronJob(serviceName, {
        command: command.trim(),
        frequency: finalFrequency,
        language,
        email: email.trim() || undefined,
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
          <h3>{t("createCron.title")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label>{t("createCron.commandLabel")}</label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="php www/cron.php"
              className="form-input font-mono"
              autoFocus
            />
            <span className="form-hint">{t("createCron.commandHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createCron.languageLabel")}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-select"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t("createCron.frequencyLabel")}</label>
            {!useCustom ? (
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="form-select"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label} ({f.value})</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
                placeholder="*/10 * * * *"
                className="form-input font-mono"
              />
            )}
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
              />
              <span>{t("createCron.customFrequency")}</span>
            </label>
          </div>

          <div className="form-group">
            <label>{t("createCron.emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="form-input"
            />
            <span className="form-hint">{t("createCron.emailHint")}</span>
          </div>
        </div>

        <div className="modal-footer">
          <div></div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
              {t("createCron.cancel")}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? t("createCron.creating") : t("createCron.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCronModal;
