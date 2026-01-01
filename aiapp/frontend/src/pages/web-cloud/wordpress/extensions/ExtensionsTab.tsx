// ============================================================
// WORDPRESS TAB: EXTENSIONS
// ⚠️ API NON DISPONIBLE - Les endpoints /theme et /plugin n'existent pas dans l'API OLD MANAGER
// ============================================================

import { useTranslation } from 'react-i18next';
import './Extensions.css';

interface Props {
  serviceName: string;
}

// ============================================================
// FEATURE DÉSACTIVÉE - API NON DISPONIBLE
// Les endpoints suivants n'existent pas dans l'API OVH:
// - GET /managedCMS/resource/{sn}/theme
// - POST /managedCMS/resource/{sn}/theme/{name}/update
// - GET /managedCMS/resource/{sn}/plugin
// - POST /managedCMS/resource/{sn}/plugin/{name}/update
// - POST /managedCMS/resource/{sn}/plugin/{name}/activate
// - POST /managedCMS/resource/{sn}/plugin/{name}/deactivate
// - POST /managedCMS/resource/{sn}/plugin/updateAll
// ============================================================

export function ExtensionsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  void serviceName; // Unused but kept for interface compatibility

  return (
    <div className="extensions-tab">
      <div className="extensions-unavailable">
        <div className="extensions-unavailable-icon">🔒</div>
        <h3>{t('extensions.unavailable.title') || 'Gestion des extensions non disponible'}</h3>
        <p>{t('extensions.unavailable.message') || 'Cette fonctionnalité n\'est pas disponible via l\'API. Utilisez le Manager OVH ou l\'admin WordPress pour gérer vos extensions.'}</p>
        <a
          href="https://www.ovh.com/manager/"
          target="_blank"
          rel="noopener noreferrer"
          className="ext-btn ext-btn-outline"
        >
          {t('common.openManager') || 'Ouvrir le Manager OVH'}
        </a>
      </div>
    </div>
  );
}

export default ExtensionsTab;
