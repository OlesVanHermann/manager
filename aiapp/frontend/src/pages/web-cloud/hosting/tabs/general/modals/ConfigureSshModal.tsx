// ============================================================
// CONFIGURE SSH MODAL - Conforme OLD Manager
// Modal pour configurer l'accès SSH
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "../GeneralTab.service";

interface Props {
  serviceName: string;
  primaryLogin: string;
  currentSshState: "active" | "none" | "sftponly";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type SshState = "active" | "none" | "sftponly";

interface SshOption {
  value: SshState;
  label: string;
  description: string;
}

export function ConfigureSshModal({ serviceName, primaryLogin, currentSshState, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.general");
  
  const [sshState, setSshState] = useState<SshState>(currentSshState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sshOptions: SshOption[] = [
    {
      value: "none",
      label: t("general.ssh.optionNone", "Désactivé"),
      description: t("general.ssh.optionNoneDesc", "Aucun accès SSH ou SFTP")
    },
    {
      value: "sftponly",
      label: t("general.ssh.optionSftp", "SFTP uniquement"),
      description: t("general.ssh.optionSftpDesc", "Transfert de fichiers sécurisé sans accès shell")
    },
    {
      value: "active",
      label: t("general.ssh.optionActive", "SSH activé"),
      description: t("general.ssh.optionActiveDesc", "Accès complet en ligne de commande")
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setSshState(currentSshState);
      setError(null);
    }
  }, [isOpen, currentSshState]);

  const handleSubmit = async () => {
    if (sshState === currentSshState) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await generalService.updateUser(serviceName, primaryLogin, { sshState });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t("common.error", "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("general.ssh.title", "Configurer l'accès SSH")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            {t("general.ssh.description", "Choisissez le niveau d'accès SSH pour le compte principal.")}
          </p>

          <div className="general-info-block compact">
            <label>{t("general.ssh.account", "Compte")}</label>
            <p><strong>{primaryLogin}</strong></p>
          </div>

          <div className="radio-group">
            {sshOptions.map(option => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="sshState"
                  value={option.value}
                  checked={sshState === option.value}
                  onChange={() => setSshState(option.value)}
                />
                <div className="radio-content">
                  <span className="radio-label">{option.label}</span>
                  <span className="radio-description">{option.description}</span>
                </div>
              </label>
            ))}
          </div>

          {sshState === "active" && (
            <div className="alert alert-warning">
              <span className="alert-icon">⚠️</span>
              <p>{t("general.ssh.activeWarning", "L'accès SSH complet permet d'exécuter des commandes sur le serveur. Assurez-vous de sécuriser votre mot de passe.")}</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="wh-modal-btn-secondary" onClick={onClose} disabled={loading}>
            {t("common.cancel", "Annuler")}
          </button>
          <button type="button" className="wh-modal-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner-small" /> {t("common.saving", "Enregistrement...")}</> : t("common.save", "Enregistrer")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigureSshModal;
