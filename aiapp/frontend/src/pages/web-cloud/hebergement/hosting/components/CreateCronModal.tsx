// ============================================================
// CREATE CRON MODAL - Créer une tâche planifiée
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

const LANGUAGES = [
  { value: "php", label: "PHP" },
  { value: "node14", label: "Node.js 14" },
  { value: "node16", label: "Node.js 16" },
  { value: "node18", label: "Node.js 18" },
  { value: "python", label: "Python" },
  { value: "ruby", label: "Ruby" },
];

const FREQUENCIES = [
  { value: "0 * * * *", label: "Toutes les heures" },
  { value: "0 0 * * *", label: "Tous les jours à minuit" },
  { value: "0 0 * * 0", label: "Tous les dimanches" },
  { value: "0 0 1 * *", label: "Le 1er de chaque mois" },
  { value: "*/5 * * * *", label: "Toutes les 5 minutes" },
  { value: "*/15 * * * *", label: "Toutes les 15 minutes" },
  { value: "*/30 * * * *", label: "Toutes les 30 minutes" },
  { value: "custom", label: "Personnalisé" },
];

/** Modal pour créer une tâche planifiée (cron). */
export function CreateCronModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [command, setCommand] = useState("");
  const [frequencyPreset, setFrequencyPreset] = useState("0 0 * * *");
  const [customFrequency, setCustomFrequency] = useState("");
  const [language, setLanguage] = useState("php");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) {
      setError("La commande est obligatoire");
      return;
    }

    const frequency = frequencyPreset === "custom" ? customFrequency : frequencyPreset;
    if (!frequency.trim()) {
      setError("La fréquence est obligatoire");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createCron(serviceName, {
        command: command.trim(),
        frequency,
        language,
        email: email.trim() || undefined,
        description: description.trim() || undefined,
        status: "enabled",
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
    setCommand("");
    setFrequencyPreset("0 0 * * *");
    setCustomFrequency("");
    setLanguage("php");
    setEmail("");
    setDescription("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("cron.create")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label className="form-label required">Commande</label>
              <input
                type="text"
                className="form-input"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="www/cron/script.php"
                required
              />
              <span className="form-hint">Chemin relatif depuis votre dossier home</span>
            </div>

            <div className="form-group">
              <label className="form-label required">Fréquence</label>
              <select
                className="form-select"
                value={frequencyPreset}
                onChange={(e) => setFrequencyPreset(e.target.value)}
              >
                {FREQUENCIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {frequencyPreset === "custom" && (
              <div className="form-group">
                <label className="form-label required">Expression cron</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={customFrequency}
                  onChange={(e) => setCustomFrequency(e.target.value)}
                  placeholder="* * * * *"
                  required
                />
                <span className="form-hint">Format: minute heure jour mois jour_semaine</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label required">Langage</label>
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

            <div className="form-group">
              <label className="form-label">Email de notification</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="notifications@example.com"
              />
              <span className="form-hint">Recevez un email en cas d'erreur</span>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Backup quotidien"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Création..." : "Créer la tâche"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCronModal;
