// ============================================================
// WORDPRESS TAB: DOMAINS
// ⚠️ API NON DISPONIBLE - Les endpoints /domains n'existent pas dans l'API OLD MANAGER
// ============================================================

import { useTranslation } from 'react-i18next';
import './DomainsTab.css';

interface Props {
  serviceName: string;
}

// ============================================================
// FEATURE DÉSACTIVÉE - API NON DISPONIBLE
// Les endpoints suivants n'existent pas dans l'API OVH:
// - GET /managedCMS/resource/{sn}/domains
// - POST /managedCMS/resource/{sn}/domains
// - DELETE /managedCMS/resource/{sn}/domains/{domain}
// - GET /managedCMS/resource/{sn}/domains/{domain}/ssl
// - POST /managedCMS/resource/{sn}/domains/{domain}/ssl
// ============================================================

export function DomainsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  void serviceName; // Unused but kept for interface compatibility

  return (
    <div className="domains-tab">
      <div className="domains-unavailable">
        <div className="domains-unavailable-icon">🔒</div>
        <h3>{t('domains.unavailable.title') || 'Gestion des domaines non disponible'}</h3>
        <p>{t('domains.unavailable.message') || 'Cette fonctionnalité n\'est pas disponible via l\'API. Utilisez le Manager OVH pour gérer vos domaines.'}</p>
        <a
          href="https://www.ovh.com/manager/"
          target="_blank"
          rel="noopener noreferrer"
          className="domains-btn domains-btn-outline"
        >
          {t('common.openManager') || 'Ouvrir le Manager OVH'}
        </a>
      </div>
    </div>
  );
}

export default DomainsTab;
