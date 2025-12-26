// ============================================================
// MODAL: Add Whitelist Entry - Private Database
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../../services/api";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = "/hosting/privateDatabase";

export function AddWhitelistModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [ip, setIp] = useState("");
  const [name, setName] = useState("");
  const [service, setService] = useState(true);
  const [sftp, setSftp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIp, setCurrentIp] = useState<string | null>(null);

  // Récupérer l'IP actuelle
  useEffect(() => {
    if (isOpen) {
      fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => setCurrentIp(data.ip))
        .catch(() => setCurrentIp(null));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`${BASE_PATH}/${serviceName}/whitelist`, { 
        ip, 
        name: name || undefined, 
        service, 
        sftp 
      });
      onSuccess();
      setIp("");
      setName("");
      setService(true);
      setSftp(false);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentIp = () => {
    if (currentIp) setIp(currentIp);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("whitelist.addTitle")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="form-group">
              <label>{t("whitelist.ip")}</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="form-input"
                  value={ip}
                  onChange={e => setIp(e.target.value)}
                  placeholder="192.168.1.1 ou 192.168.1.0/24"
                  required
                  style={{ flex: 1 }}
                />
                {currentIp && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleUseCurrentIp}>
                    Mon IP
                  </button>
                )}
              </div>
              {currentIp && <small className="form-hint">Votre IP: {currentIp}</small>}
            </div>

            <div className="form-group">
              <label>{t("whitelist.name")} ({t("common.optional")})</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Bureau, Serveur prod..."
              />
            </div>

            <div className="form-group">
              <label>{t("whitelist.options")}</label>
              <div style={{ display: "flex", gap: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="checkbox" checked={service} onChange={e => setService(e.target.checked)} />
                  Service (MySQL/PostgreSQL)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="checkbox" checked={sftp} onChange={e => setSftp(e.target.checked)} />
                  SFTP
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="privdb-modal-btn-primary" disabled={loading}>
              {loading ? t("common.adding") : t("whitelist.add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWhitelistModal;
