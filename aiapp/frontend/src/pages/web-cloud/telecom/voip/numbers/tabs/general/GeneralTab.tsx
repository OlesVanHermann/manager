// ============================================================
// NUMBER GENERAL TAB - Informations générales du numéro
// Target: target_.web-cloud.voip.number.general.svg
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, InfoRow, Badge } from '../../../components/RightPanel';
import type { TelephonyNumber } from '../../../voip.types';
import type { NumberServiceInfos } from '../../numbers.types';
import './GeneralTab.css';

interface GeneralTabProps {
  billingAccount: string;
  serviceName: string;
  number: TelephonyNumber;
  serviceInfos: NumberServiceInfos | null;
  onUpdate: (number: TelephonyNumber) => void;
}

export function GeneralTab({
  billingAccount,
  serviceName,
  number,
  serviceInfos,
  onUpdate,
}: GeneralTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/general');
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(number.description);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await numbersService.updateNumber(billingAccount, serviceName, { description });
      onUpdate({ ...number, description });
      setEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDescription(number.description);
    setEditing(false);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const getFeatureLabel = (featureType: string) => {
    const labels: Record<string, string> = {
      redirect: t('feature.redirect'),
      ddi: t('feature.ddi'),
      conference: t('feature.conference'),
      ivr: t('feature.ivr'),
      voicemail: t('feature.voicemail'),
      svi: t('feature.svi'),
      easyHunting: t('feature.easyHunting'),
      miniPabx: t('feature.miniPabx'),
    };
    return labels[featureType] || featureType;
  };

  return (
    <div className="number-general-tab">
      {/* Informations du numéro */}
      <Tile title={t('number.title')}>
        <InfoRow
          label={t('number.serviceName')}
          value={<span className="monospace">{serviceName}</span>}
        />

        <div className="info-row-editable">
          <label>{t('number.description')}</label>
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
              <span>{number.description || t('number.noDescription')}</span>
              <button className="btn-link" onClick={() => setEditing(true)}>
                {t('actions.edit')}
              </button>
            </div>
          )}
        </div>

        <InfoRow
          label={t('number.feature')}
          value={
            <Badge type="info">
              {getFeatureLabel(number.featureType)}
            </Badge>
          }
        />

        <InfoRow label={t('number.country')} value={number.country || 'FR'} />
        <InfoRow label={t('number.zone')} value={number.zone || '-'} />
        <InfoRow label={t('number.type')} value={number.type || 'geographic'} />
      </Tile>

      {/* Abonnement */}
      {serviceInfos && (
        <Tile title={t('subscription.title')}>
          <InfoRow
            label={t('subscription.creation')}
            value={formatDate(serviceInfos.creation)}
          />
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
        </Tile>
      )}

      {/* Actions */}
      <div className="number-general-actions">
        <button className="btn btn-secondary">{t('actions.changeFeature')}</button>
        <button className="btn btn-danger">{t('actions.terminate')}</button>
      </div>
    </div>
  );
}
