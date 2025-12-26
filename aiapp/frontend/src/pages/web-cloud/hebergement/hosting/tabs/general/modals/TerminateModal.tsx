interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TerminateModal({ serviceName, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Résilier le service</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="alert alert-warning">
            <span className="alert-icon">⚠️</span>
            <p>La résiliation de {serviceName} doit être effectuée depuis l'espace client OVHcloud.</p>
          </div>
          <p>
            <a href="https://www.ovh.com/manager/" target="_blank" rel="noopener noreferrer">
              Accéder à l'espace client →
            </a>
          </p>
        </div>
        <div className="modal-footer">
          <button className="wh-modal-btn-secondary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default TerminateModal;
