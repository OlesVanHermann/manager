// ============================================================
// LINE PHONE TAB - Gestion du téléphone associé
// Target: target_.web-cloud.voip.line.phone.svg
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { linesService } from '../../lines.service';
import { Tile, InfoRow, Badge, EmptyState } from '../../../components/RightPanel';
import type { TelephonyPhone } from '../../../voip.types';
import './PhoneTab.css';

interface PhoneTabProps {
  billingAccount: string;
  serviceName: string;
  phone: TelephonyPhone | null;
  onUpdate: (phone: TelephonyPhone | null) => void;
}

export function PhoneTab({ billingAccount, serviceName, phone, onUpdate }: PhoneTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/phone');
  const [rebooting, setRebooting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReboot = async () => {
    if (!confirm(t('confirm.reboot'))) return;

    try {
      setRebooting(true);
      await linesService.rebootPhone(billingAccount, serviceName);
      alert(t('success.reboot'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.reboot'));
    } finally {
      setRebooting(false);
    }
  };

  const handleResetConfig = async () => {
    if (!confirm(t('confirm.reset'))) return;

    try {
      setResetting(true);
      await linesService.resetPhoneConfig(billingAccount, serviceName);
      alert(t('success.reset'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.reset'));
    } finally {
      setResetting(false);
    }
  };

  if (!phone) {
    return (
      <div className="line-phone-tab">
        <EmptyState
          icon="📱"
          title={t('empty.title')}
          description={t('empty.description')}
          action={
            <button className="btn btn-primary">{t('actions.orderPhone')}</button>
          }
        />
      </div>
    );
  }

  return (
    <div className="line-phone-tab">
      {/* Informations du téléphone */}
      <Tile title={t('phone.title')}>
        <div className="phone-header">
          <div className="phone-icon">📞</div>
          <div className="phone-details">
            <h3>{phone.brand} {phone.model}</h3>
            <p className="phone-mac">{phone.macAddress}</p>
          </div>
          <Badge type={phone.ip ? 'success' : 'warning'}>
            {phone.ip ? t('status.online') : t('status.offline')}
          </Badge>
        </div>
      </Tile>

      {/* Configuration réseau */}
      <Tile title={t('network.title')}>
        <InfoRow label={t('network.macAddress')} value={phone.macAddress} />
        <InfoRow label={t('network.ip')} value={phone.ip || '-'} />
        <InfoRow label={t('network.protocol')} value={phone.protocol?.toUpperCase()} />
        <InfoRow label={t('network.firmware')} value={phone.softwareVersion || '-'} />
      </Tile>

      {/* Configuration */}
      <Tile title={t('config.title')}>
        <InfoRow
          label={t('config.screenLock')}
          value={phone.phoneConfiguration?.screenLock ? t('common.yes') : t('common.no')}
        />
        <InfoRow
          label={t('config.admin')}
          value={phone.phoneConfiguration?.admin ? t('common.yes') : t('common.no')}
        />
      </Tile>

      {/* Actions */}
      <div className="phone-actions">
        <button
          className="btn btn-secondary"
          onClick={handleReboot}
          disabled={rebooting}
        >
          🔄 {rebooting ? t('actions.rebooting') : t('actions.reboot')}
        </button>
        <button
          className="btn btn-warning"
          onClick={handleResetConfig}
          disabled={resetting}
        >
          ⚙️ {resetting ? t('actions.resetting') : t('actions.resetConfig')}
        </button>
        <button className="btn btn-secondary">
          📥 {t('actions.downloadConfig')}
        </button>
      </div>
    </div>
  );
}
