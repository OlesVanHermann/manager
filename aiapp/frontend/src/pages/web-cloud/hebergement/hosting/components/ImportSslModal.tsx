// ============================================================
// IMPORT SSL MODAL - Importer un certificat SSL personnalisé
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

/** Modal pour importer un certificat SSL personnalisé. */
export function ImportSslModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [certificate, setCertificate] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [chain, setChain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificate.trim()) {
      setError("Le certificat est obligatoire");
      return;
    }
    
    if (!privateKey.trim()) {
      setError("La clé privée est obligatoire");
      return;
    }

    // Basic PEM validation
    if (!certificate.includes("-----BEGIN CERTIFICATE-----")) {
      setError("Le certificat doit être au format PEM (commençant par -----BEGIN CERTIFICATE-----)");
      return;
    }

    if (!privateKey.includes("-----BEGIN") || !privateKey.includes("PRIVATE KEY-----")) {
      setError("La clé privée doit être au format PEM");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.importSsl(serviceName, {
        certificate: certificate.trim(),
        key: privateKey.trim(),
        chain: chain.trim() || undefined,
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
    setCertificate("");
    setPrivateKey("");
    setChain("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("ssl.importOwn")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <div>
                <p><strong>Formats acceptés:</strong> PEM (encodé en base64)</p>
                <p style={{ marginTop: 'var(--space-1)' }}>
                  Vous pouvez importer un certificat acheté auprès d'une autorité de certification.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Certificat SSL</label>
              <textarea
                className="form-textarea font-mono"
                value={certificate}
                onChange={(e) => setCertificate(e.target.value)}
                placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDXTCCAkWgAwIBAgIJAJC1...&#10;-----END CERTIFICATE-----"
                rows={6}
                required
              />
              <span className="form-hint">Collez le contenu de votre fichier .crt ou .pem</span>
            </div>

            <div className="form-group">
              <label className="form-label required">Clé privée</label>
              <textarea
                className="form-textarea font-mono"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;MIIEowIBAAKCAQEA0Z3VS0...&#10;-----END RSA PRIVATE KEY-----"
                rows={6}
                required
              />
              <span className="form-hint">Clé privée RSA non chiffrée (sans mot de passe)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Chaîne de certificats (optionnel)</label>
              <textarea
                className="form-textarea font-mono"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                placeholder="-----BEGIN CERTIFICATE-----&#10;...certificats intermédiaires...&#10;-----END CERTIFICATE-----"
                rows={4}
              />
              <span className="form-hint">Certificats intermédiaires de l'autorité de certification</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Import..." : "Importer le certificat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportSslModal;
