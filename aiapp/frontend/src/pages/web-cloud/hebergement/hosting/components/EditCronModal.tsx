// ============================================================
// MODAL: Edit Cron Job
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, CronJob } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  cron: CronJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FREQUENCIES = [
  { value: "*/5 * * * *", label: "Toutes les 5 minutes" },
  { value: "*/15 * * * *", label: "Toutes les 15 minutes" },
  { value: "*/30 * * * *", label: "Toutes les 30 minutes" },
  { value: "0 * * * *", label: "Toutes les heures" },
  { value: "0 */2 * * *", label: "Toutes les 2 heures" },
  { value: "0 */6 * * *", label: "Toutes les 6 heures" },
  { value: "0 0 * * *", label: "Tous les jours à minuit" },
  { value: "0 0 * * 0", label: "Tous les dimanches" },
  { value: "0 0 1 * *", label: "Le 1er de chaque mois" },
];

const LANGUAGES = [
  { value: "php", label: "PHP" },
  { value: "node14", label: "Node.js 14" },
  { value: "node16", label: "Node.js 16" },
  { value: "node18", label: "Node.js 18" },
  { value: "python", label: "Python" },
];

/** Modal pour modifier une tâche planifiée. */
export function EditCronModal({ serviceName, cron, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [command, setCommand] = useState("");
  const [frequency, setFrequency] = useState("0 * * * *");
  const [language, setLanguage] = useState("php");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- INIT ----------
  useEffect(() => {
    if (cron && isOpen) {
      setCommand(cron.command || "");
      setFrequency(cron.frequency || "0 * * * *");
      setLanguage(cron.language || "php");
      setEmail(cron.email || "");
      setDescription(cron.description || "");
    }
  }, [cron, isOpen]);

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    if (!cron || !command.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await hostingService.updateCron(serviceName, cron.id, {
        command: command.trim(),
        frequency,
        language,
        email: email.trim() || undefined,
        description: description.trim() || undefined
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !cron) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("cron.edit")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>{t("cron.command")} *</label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="www/cron.php"
            />
            <small className="field-hint">Chemin relatif depuis /home/</small>
          </div>

          <div className="form-group">
            <label>{t("cron.frequency")} *</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t("cron.language")}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t("cron.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="notifications@example.com"
            />
            <small className="field-hint">Recevoir les résultats par email</small>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la tâche"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={!command.trim() || loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCronModal;
