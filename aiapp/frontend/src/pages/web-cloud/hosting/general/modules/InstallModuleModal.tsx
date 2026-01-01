import { useState } from "react";
interface Props { serviceName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function InstallModuleModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleInstall = async () => { console.log('[Modal:InstallModule] Action: installer', { serviceName }); setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (
    <div className="modules-modal-overlay" onClick={onClose}><div className="modules-modal-container" onClick={e => e.stopPropagation()}>
      <div className="modules-modal-header"><h2>Installer un module</h2><button className="modules-modal-close" onClick={onClose}>×</button></div>
      <div className="modules-modal-body"><p>Installation de module pour {serviceName} - Fonctionnalité en cours.</p></div>
      <div className="modules-modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-primary" onClick={handleInstall} disabled={loading}>{loading ? "..." : "Installer"}</button></div>
    </div></div>
  );
}
export default InstallModuleModal;
