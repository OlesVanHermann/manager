// ============================================================
// ADD WHITELIST MODAL - Ajouter une IP autorisée CloudDB
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour ajouter une IP à la whitelist CloudDB. */
export function AddWhitelistModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [ip, setIp] = useState("");
  const [name, setName] = useState("");
  const [service, setService] = useState(true);
  const [sftp, setSftp] = useState(false);
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current IP on mount
  useEffect(() => {
    if (isOpen) {
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setCurrentIp(data.ip))
        .catch(() => setCurrentIp(null));
    }
  }, [isOpen]);

  const validateIp = (ipStr: string): string | null => {
    // IPv4 validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    // IPv6 validation (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}(\/\d{1,3})?$/;
    
    if (!ipv4Regex.test(ipStr) && !ipv6Regex.test(ipStr)) {
      return "Adresse IP invalide. Formats acceptés: IPv4 ou IPv6, avec ou sans masque CIDR";
    }
    
    // Additional IPv4 validation
    if (ipv4Regex.test(ipStr)) {
      const parts = ipStr.split('/')[0].split('.');
      for (const part of parts) {
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) {
          return "Chaque octet doit être entre 0 et 255";
        }
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const ipError = validateIp(ip);
    if (ipError) {
      setError(ipError);
      return;
    }

    if (!service && !sftp) {
      setError("Veuillez sélectionner au moins une option (Service ou SFTP)");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await privateDatabaseService.addWhitelistEntry(
        serviceName, 
        ip.trim(), 
        name.trim() || undefined, 
        service, 
        sftp
      );
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
    setIp("");
    setName("");
    setService(true);
    setSftp(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUseCurrentIp = () => {
    if (currentIp) {
      setIp(currentIp);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("modals.addWhitelist")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <div>
                <p>Seules les adresses IP de cette liste peuvent se connecter à vos bases de données.</p>
                {currentIp && (
                  <p style={{ marginTop: 'var(--space-2)' }}>
                    <strong>Votre IP actuelle:</strong> <code>{currentIp}</code>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm" 
                      style={{ marginLeft: 'var(--space-2)' }}
                      onClick={handleUseCurrentIp}
                    >
                      Utiliser cette IP
                    </button>
                  </p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Adresse IP</label>
              <input
                type="text"
                className="form-input font-mono"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.1 ou 192.168.1.0/24"
                required
              />
              <span className="form-hint">
                IPv4 ou IPv6, avec ou sans masque CIDR (ex: /24 pour un sous-réseau)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Nom (optionnel)</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bureau, Serveur web, etc."
                maxLength={255}
              />
              <span className="form-hint">Un nom pour identifier facilement cette IP</span>
            </div>

            <div className="form-group">
              <label className="form-label">Options d'accès</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={service}
                    onChange={(e) => setService(e.target.checked)}
                  />
                  Service (connexion MySQL/PostgreSQL)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sftp}
                    onChange={(e) => setSftp(e.target.checked)}
                  />
                  SFTP (import/export de dumps)
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Ajout..." : "Ajouter l'IP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWhitelistModal;
