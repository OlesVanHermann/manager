// ============================================================
// GENERAL TAB - Informations générales du groupe VoIP
// Target: target_.web-cloud.voip.group.general.svg
// DEFACTORISATION: Composants et service ISOLÉS dans ce tab
// ============================================================

import { useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { generalTabService, type GeneralServiceInfos } from './GeneralTab.service';
import type { TelephonyBillingAccount } from '../../../voip.types';
import './GeneralTab.css';

// ============================================================
// COMPOSANTS UI ISOLÉS (dupliqués selon prompt_split.txt)
// ============================================================

interface TileProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function Tile({ title, children, className }: TileProps) {
  return (
    <div className={`voip-tile ${className || ''}`}>
      <div className="voip-tile-title">{title}</div>
      {children}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className="voip-info-row">
      <label>{label}</label>
      <span className={className}>{value}</span>
    </div>
  );
}

interface BadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
}

function Badge({ type, children }: BadgeProps) {
  return <span className={`voip-badge ${type}`}>{children}</span>;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface GeneralTabProps {
  billingAccount: string;
  group: TelephonyBillingAccount;
  serviceInfos: GeneralServiceInfos | null;
  onUpdate: (group: TelephonyBillingAccount) => void;
}

export function GeneralTab({ billingAccount, group, serviceInfos, onUpdate }: GeneralTabProps) {
  const { t } = useTranslation('web-cloud/voip/groups/general');
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(group.description);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await generalTabService.updateGroup(billingAccount, { description });
      onUpdate({ ...group, description });
      setEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDescription(group.description);
    setEditing(false);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <div className="general-tab">
      {/* Tile: Informations du groupe */}
      <Tile title={t('group.title')}>
        <InfoRow
          label={t('group.billingAccount')}
          value={<span className="monospace">{billingAccount}</span>}
        />

        <div className="info-row-editable">
          <label>{t('group.description')}</label>
          {editing ? (
            <div className="edit-input-group">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="edit-input"
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '...' : t('actions.save')}
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                {t('actions.cancel')}
              </button>
            </div>
          ) : (
            <div className="value-with-action">
              <span>{group.description || t('group.noDescription')}</span>
              <button className="btn-link" onClick={() => setEditing(true)}>
                {t('actions.edit')}
              </button>
            </div>
          )}
        </div>

        <InfoRow
          label={t('group.status')}
          value={
            <Badge type={group.status === 'enabled' ? 'success' : 'error'}>
              {group.status === 'enabled' ? t('status.enabled') : t('status.disabled')}
            </Badge>
          }
        />

        <InfoRow
          label={t('group.trusted')}
          value={group.trusted ? t('common.yes') : t('common.no')}
        />

        <InfoRow label={t('group.version')} value={`v${group.version}`} />
      </Tile>

      {/* Tile: Facturation */}
      <Tile title={t('billing.title')}>
        <InfoRow
          label={t('billing.securityDeposit')}
          value={`${(group.securityDeposit || 0).toFixed(2)} €`}
        />

        <InfoRow
          label={t('billing.creditThreshold')}
          value={`${(group.creditThreshold || 0).toFixed(2)} €`}
        />

        <InfoRow
          label={t('billing.currentOutplan')}
          value={
            <span className={group.currentOutplan > 0 ? 'text-error' : ''}>
              {(group.currentOutplan || 0).toFixed(2)} €
            </span>
          }
        />

        <InfoRow
          label={t('billing.allowedOutplan')}
          value={`${(group.allowedOutplan || 0).toFixed(2)} €`}
        />
      </Tile>

      {/* Tile: Abonnement */}
      {serviceInfos && (
        <Tile title={t('subscription.title')}>
          <InfoRow label={t('subscription.creation')} value={formatDate(serviceInfos.creation)} />

          <InfoRow
            label={t('subscription.expiration')}
            value={formatDate(serviceInfos.expiration)}
          />

          <InfoRow
            label={t('subscription.engagedUpTo')}
            value={formatDate(serviceInfos.engagedUpTo)}
          />

          <InfoRow
            label={t('subscription.renewal')}
            value={
              serviceInfos.renew.automatic
                ? t('subscription.automatic')
                : t('subscription.manual')
            }
          />

          <InfoRow
            label={t('subscription.deleteAtExpiration')}
            value={
              serviceInfos.renew.deleteAtExpiration ? t('common.yes') : t('common.no')
            }
          />
        </Tile>
      )}

      {/* Actions */}
      <div className="general-tab-actions">
        <button className="btn btn-secondary">
          {t('actions.changeOffer')}
        </button>
        <button className="btn btn-danger">
          {t('actions.terminate')}
        </button>
      </div>
    </div>
  );
}
