// ============================================================
// CREATE PDB USER MODAL - Créer un utilisateur CloudDB
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour créer un utilisateur sur CloudDB. */
export function CreatePdbUserModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUserName = (name: string): string | null => {
    if (name.length < 1) return "Le nom est obligatoire";
    if (name.length > 16) return "Maximum 16 caractères";
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
      return "Le nom doit commencer par une lettre et contenir uniquement des lettres, chiffres et underscores";
    }
    return null;
  };

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
    
    const userError = validateUserName(userName);
    if (userError) {
      setError(userError);
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
      await privateDatabaseService.createUser(serviceName, userName.trim(), password);
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
    setUserName("");
    setPassword("");
    setConfirmPassword("");
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
          <h3>{t("modals.createUser")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <p>L'utilisateur sera créé sans droits. Vous pourrez ensuite lui attribuer des droits sur les bases de données.</p>
            </div>

            <div className="form-group">
              <label className="form-label required">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-input font-mono"
                value={userName}
                onChange={(e) => setUserName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="mon_user"
                maxLength={16}
                required
              />
              <span className="form-hint">
                Maximum 16 caractères. Lettres, chiffres et underscores uniquement.
              </span>
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
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Création..." : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePdbUserModal;
