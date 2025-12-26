// ============================================================
// VOICEMAILS TAB - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { voicemailsService } from './VoicemailsTab.service';
import type { TelephonyVoicemail } from '../../voip.types';
import './VoicemailsTab.css';

interface Props {
  billingAccount: string;
}

export function VoicemailsTab({ billingAccount }: Props) {
  const { t } = useTranslation('web-cloud/telecom/voip/voicemails');
  const [voicemails, setVoicemails] = useState<TelephonyVoicemail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await voicemailsService.getVoicemails(billingAccount);
        setVoicemails(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [billingAccount]);

  if (loading) {
    return (
      <div className="voip-voicemails-loading">
        <div className="voip-voicemails-skeleton" />
      </div>
    );
  }

  return (
    <div className="voicemails-tab">
      <div className="voicemails-header">
        <div>
          <h3>{t('title')}</h3>
        </div>
        <span className="voicemails-count">{voicemails.length}</span>
      </div>

      {voicemails.length === 0 ? (
        <div className="voicemails-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="voicemails-cards">
          {voicemails.map(vm => (
            <div key={vm.serviceName} className="voicemails-card">
              <div className="voicemails-icon">📬</div>
              <h4>{vm.serviceName}</h4>
              <p>{vm.description || t('noDescription')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VoicemailsTab;
