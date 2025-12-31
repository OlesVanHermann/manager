// ============================================================
// LINE PHONE TAB - Gestion du téléphone associé
// Target: target_.web-cloud.voip.line.phone.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { phoneTabService } from './PhoneTab.service';
import type { TelephonyPhone } from '../../../voip.types';
import './PhoneTab.css';

// ============================================================
// COMPOSANTS UI DUPLIQUÉS (ISOLATION)
// ============================================================

function Tile({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`voip-tile ${className}`}>
      <div className="voip-tile-header">{title}</div>
      <div className="voip-tile-content">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="voip-info-row">
      <span className="voip-info-label">{label}</span>
      <span className="voip-info-value">{value}</span>
    </div>
  );
}

function Badge({ type = 'default', children }: { type?: 'success' | 'warning' | 'error' | 'info' | 'default'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${type}`}>{children}</span>;
}

function EmptyState({ icon, title, description, action }: { icon: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="voip-empty-state">
      <span className="voip-empty-icon">{icon}</span>
      <h3 className="voip-empty-title">{title}</h3>
      <p className="voip-empty-description">{description}</p>
      {action && <div className="voip-empty-action">{action}</div>}
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface PhoneTabProps {
  billingAccount: string;
  serviceName: string;
  phone: TelephonyPhone | null;
  onUpdate: (phone: TelephonyPhone | null) => void;
}

export function PhoneTab({ billingAccount, serviceName, phone, onUpdate }: PhoneTabProps) {
  const { t } = useTranslation('web-cloud/voip/lines/phone');
  const [rebooting, setRebooting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReboot = async () => {
    if (!confirm(t('confirm.reboot'))) return;

    try {
      setRebooting(true);
      await phoneTabService.rebootPhone(billingAccount, serviceName);
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
      await phoneTabService.resetPhoneConfig(billingAccount, serviceName);
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
