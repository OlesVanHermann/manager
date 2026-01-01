// ============================================================
// WORDPRESS TAB: BACKUPS
// ⚠️ API NON DISPONIBLE - Les endpoints /backup n'existent pas dans l'API OLD MANAGER
// ============================================================

import { useTranslation } from 'react-i18next';
import './BackupsTab.css';

interface Props {
  serviceName: string;
  offer?: string;
}

// ============================================================
// FEATURE DÉSACTIVÉE - API NON DISPONIBLE
// Les endpoints suivants n'existent pas dans l'API OVH:
// - GET /managedCMS/resource/{sn}/backup
// - POST /managedCMS/resource/{sn}/backup
// - POST /managedCMS/resource/{sn}/backup/{id}/restore
// - DELETE /managedCMS/resource/{sn}/backup/{id}
// ============================================================

export function BackupsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  void serviceName; // Unused but kept for interface compatibility

  return (
    <div className="backups-tab">
      <div className="backups-unavailable">
        <div className="backups-unavailable-icon">🔒</div>
        <h3>{t('backups.unavailable.title') || 'Sauvegardes non disponibles'}</h3>
        <p>{t('backups.unavailable.message') || 'Cette fonctionnalité n\'est pas disponible via l\'API. Utilisez le Manager OVH pour gérer vos sauvegardes.'}</p>
        <a
          href="https://www.ovh.com/manager/"
          target="_blank"
          rel="noopener noreferrer"
          className="backups-btn backups-btn-outline"
        >
          {t('common.openManager') || 'Ouvrir le Manager OVH'}
        </a>
      </div>
    </div>
  );
}

export default BackupsTab;
