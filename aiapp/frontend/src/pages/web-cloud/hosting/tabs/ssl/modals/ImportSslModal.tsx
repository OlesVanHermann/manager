import { useState } from "react";
import { sslService } from "../SslTab.service";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportSslModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [certificate, setCertificate] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [chain, setChain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!certificate.trim() || !privateKey.trim()) {
      setError("Le certificat et la clé privée sont obligatoires");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sslService.importSsl(serviceName, certificate, privateKey, chain || undefined);
      onSuccess();
      onClose();
      setCertificate(""); setPrivateKey(""); setChain("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ssl-modal-overlay" onClick={onClose}>
      <div className="ssl-modal" onClick={e => e.stopPropagation()}>
        <div className="ssl-modal-header">
          <h3>Importer un certificat SSL</h3>
          <button className="ssl-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ssl-modal-body">
          <div className="ssl-form-group">
            <label className="ssl-form-label">Certificat (PEM) *</label>
            <textarea 
              className="ssl-form-textarea" 
              value={certificate} 
              onChange={e => setCertificate(e.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----"
              rows={5}
            />
          </div>
          <div className="ssl-form-group">
            <label className="ssl-form-label">Clé privée (PEM) *</label>
            <textarea 
              className="ssl-form-textarea" 
              value={privateKey} 
              onChange={e => setPrivateKey(e.target.value)}
              placeholder="-----BEGIN PRIVATE KEY-----"
              rows={5}
            />
          </div>
          <div className="ssl-form-group">
            <label className="ssl-form-label">Chaîne de certification (optionnel)</label>
            <textarea 
              className="ssl-form-textarea" 
              value={chain} 
              onChange={e => setChain(e.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----"
              rows={3}
            />
          </div>
          {error && <p className="ssl-form-error">{error}</p>}
        </div>
        <div className="ssl-modal-footer">
          <button className="ssl-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="ssl-btn-confirm" onClick={handleImport} disabled={loading || !certificate.trim() || !privateKey.trim()}>
            {loading ? "Importation..." : "Importer"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ImportSslModal;
