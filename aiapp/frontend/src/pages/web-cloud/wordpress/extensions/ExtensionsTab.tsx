// ============================================================
// WORDPRESS TAB: EXTENSIONS (NAV4 Container)
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ThemesTab from './ThemesTab';
import PluginsTab from './PluginsTab';
import './Extensions.css';

interface Props {
  serviceName: string;
}

type SubTab = 'themes' | 'plugins';

export function ExtensionsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('themes');

  return (
    <div className="extensions-tab">
      {/* NAV4 - Sub-tabs */}
      <div className="extensions-nav4">
        <button
          className={`ext-nav4-tab ${activeSubTab === 'themes' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('themes')}
        >
          {t('extensions.themes')}
        </button>
        <button
          className={`ext-nav4-tab ${activeSubTab === 'plugins' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('plugins')}
        >
          {t('extensions.plugins')}
        </button>
      </div>

      {/* Content */}
      <div className="extensions-content">
        {activeSubTab === 'themes' && <ThemesTab serviceName={serviceName} />}
        {activeSubTab === 'plugins' && <PluginsTab serviceName={serviceName} />}
      </div>
    </div>
  );
}

export default ExtensionsTab;
