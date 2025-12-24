import { useState } from "react";
import { hostingService } from "../../../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  primaryLogin: string;  // Préfixe obligatoire (ex: "jezbyvt")
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateFtpUserModal({ serviceName, primaryLogin, isOpen, onClose, onSuccess }: Props) {
  const [loginSuffix, setLoginSuffix] = useState("");
  const [password, setPassword] = useState("");
  const [home, setHome] = useState("./");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Le préfixe est le primaryLogin + "-"
  const prefix = `${primaryLogin}-`;
  
  // Login complet = préfixe + suffixe saisi
  const fullLogin = `${prefix}${loginSuffix}`;

  const handleCreate = async () => {
    if (!loginSuffix.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      await hostingService.createFtpUser(serviceName, { 
        login: fullLogin,  // Envoie le login complet avec préfixe
        password, 
        home 
      });
      onSuccess();
      onClose();
      setLoginSuffix(""); 
      setPassword(""); 
      setHome("./");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoginSuffix("");
    setPassword("");
    setHome("./");
    setError("");
    onClose();
  };

  return (
    <div className="ftp-modal-overlay" onClick={handleClose}>
      <div className="ftp-modal" onClick={e => e.stopPropagation()}>
        <div className="ftp-modal-header">
          <h3>Créer un utilisateur FTP</h3>
          <button className="ftp-modal-close" onClick={handleClose}>✕</button>
        </div>
        <div className="ftp-modal-body">
          <div className="ftp-form-group">
            <label className="ftp-form-label">Login</label>
            <div className="ftp-input-prefix-group">
              <span className="ftp-input-prefix">{prefix}</span>
              <input 
                type="text" 
                className="ftp-form-input ftp-input-with-prefix" 
                value={loginSuffix} 
                onChange={e => setLoginSuffix(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} 
                placeholder="nouvel-utilisateur" 
              />
            </div>
            <p className="ftp-form-hint">Le login complet sera : <strong>{fullLogin || `${prefix}...`}</strong></p>
          </div>
          <div className="ftp-form-group">
            <label className="ftp-form-label">Mot de passe</label>
            <input 
              type="password" 
              className="ftp-form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <p className="ftp-form-hint">9-30 caractères, 1 chiffre, 1 minuscule, 1 majuscule</p>
          </div>
          <div className="ftp-form-group">
            <label className="ftp-form-label">Répertoire home</label>
            <input 
              type="text" 
              className="ftp-form-input" 
              value={home} 
              onChange={e => setHome(e.target.value)} 
              placeholder="./" 
            />
          </div>
          {error && <p className="ftp-form-error">{error}</p>}
        </div>
        <div className="ftp-modal-footer">
          <button className="ftp-btn-cancel" onClick={handleClose}>Annuler</button>
          <button 
            className="ftp-btn-confirm" 
            onClick={handleCreate} 
            disabled={loading || !loginSuffix.trim() || !password.trim()}
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateFtpUserModal;
