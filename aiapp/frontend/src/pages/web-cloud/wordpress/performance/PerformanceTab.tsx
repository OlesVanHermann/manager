// ============================================================
// WORDPRESS TAB: PERFORMANCE
// ⚠️ API NON DISPONIBLE - Les endpoints /cdn et /cache n'existent pas dans l'API OLD MANAGER
// ============================================================

import { useTranslation } from 'react-i18next';
import './PerformanceTab.css';

interface Props {
  serviceName: string;
  offer?: string;
}

// ============================================================
// FEATURE DÉSACTIVÉE - API NON DISPONIBLE
// Les endpoints suivants n'existent pas dans l'API OVH:
// - GET /managedCMS/resource/{sn}/cdn
// - POST /managedCMS/resource/{sn}/cdn/enable
// - POST /managedCMS/resource/{sn}/cdn/disable
// - GET /managedCMS/resource/{sn}/cache
// - POST /managedCMS/resource/{sn}/cache/flush
// ============================================================

export function PerformanceTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  void serviceName; // Unused but kept for interface compatibility

  return (
    <div className="perf-tab">
      <div className="perf-unavailable">
        <div className="perf-unavailable-icon">🔒</div>
        <h3>{t('performance.unavailable.title') || 'Statistiques de performance non disponibles'}</h3>
        <p>{t('performance.unavailable.message') || 'Cette fonctionnalité n\'est pas disponible via l\'API. Utilisez le Manager OVH pour gérer les performances de votre site.'}</p>
        <a
          href="https://www.ovh.com/manager/"
          target="_blank"
          rel="noopener noreferrer"
          className="perf-btn perf-btn-outline"
        >
          {t('common.openManager') || 'Ouvrir le Manager OVH'}
        </a>
      </div>
    </div>
  );
}

export default PerformanceTab;
