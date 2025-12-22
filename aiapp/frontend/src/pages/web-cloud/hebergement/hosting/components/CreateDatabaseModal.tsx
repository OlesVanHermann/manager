// ============================================================
// CREATE DATABASE MODAL - Créer une base de données
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

const DB_TYPES = [
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
];

const DB_VERSIONS = {
  mysql: [
    { value: "8.0", label: "MySQL 8.0" },
    { value: "5.7", label: "MySQL 5.7" },
  ],
  postgresql: [
    { value: "15", label: "PostgreSQL 15" },
    { value: "14", label: "PostgreSQL 14" },
    { value: "13", label: "PostgreSQL 13" },
  ],
};

/** Modal pour créer une base de données. */
export function CreateDatabaseModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [type, setType] = useState("mysql");
  const [version, setVersion] = useState("8.0");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation du mot de passe OVH
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 9) return "Minimum 9 caractères";
    if (pwd.length > 30) return "Maximum 30 caractères";
    if (!/\d/.test(pwd)) return "Au moins 1 chiffre requis";
    if (!/[a-z]/.test(pwd)) return "Au moins 1 minuscule requise";
    if (!/[A-Z]/.test(pwd)) return "Au moins 1 majuscule requise";
    if (!/^[a-zA-Z0-9]+$/.test(pwd)) return "Caractères alphanumériques uniquement";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user.trim()) {
      setError("Le nom d'utilisateur est obligatoire");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createDatabase(serviceName, {
        type,
        user: user.trim(),
        password,
        version,
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
    setType("mysql");
    setVersion("8.0");
    setUser("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    // Reset version to first available for new type
    const versions = DB_VERSIONS[newType as keyof typeof DB_VERSIONS];
    if (versions && versions.length > 0) {
      setVersion(versions[0].value);
    }
  };

  const primaryLogin = serviceName.split('.')[0];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("database.create")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label className="form-label required">Type de base</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                {DB_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Version</label>
              <select
                className="form-select"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              >
                {DB_VERSIONS[type as keyof typeof DB_VERSIONS]?.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Nom d'utilisateur</label>
              <div className="input-prefix-group">
                <span className="input-prefix">{primaryLogin}</span>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={user}
                  onChange={(e) => setUser(e.target.value.replace(/[^a-z0-9]/gi, '').slice(0, 2))}
                  placeholder="01"
                  maxLength={2}
                  required
                />
              </div>
              <span className="form-hint">2 caractères max. Nom final: {primaryLogin}{user || '01'}</span>
            </div>

            <div className="form-group">
              <label className="form-label required">Mot de passe</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
              />
              <span className="form-hint">9-30 caractères, 1 majuscule, 1 minuscule, 1 chiffre</span>
            </div>

            <div className="form-group">
              <label className="form-label required">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••"
                required
              />
            </div>

            <div className="info-banner" style={{ marginTop: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <div>
                <p><strong>Informations de connexion</strong></p>
                <p>Serveur: {primaryLogin}{user || '01'}.mysql.db</p>
                <p>Nom de la base: {primaryLogin}{user || '01'}</p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Création..." : "Créer la base"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDatabaseModal;
