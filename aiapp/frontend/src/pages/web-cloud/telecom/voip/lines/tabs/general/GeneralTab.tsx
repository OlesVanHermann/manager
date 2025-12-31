// ============================================================
// LINE GENERAL TAB - Informations générales de la ligne
// Target: target_.web-cloud.voip.line.general.svg
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { linesService } from '../../lines.service';
import { Tile, InfoRow, Badge } from '../../../components/RightPanel';
import type { TelephonyLine } from '../../../voip.types';
import type { LineServiceInfos } from '../../lines.types';
import './GeneralTab.css';

interface GeneralTabProps {
  billingAccount: string;
  serviceName: string;
  line: TelephonyLine;
  serviceInfos: LineServiceInfos | null;
  onUpdate: (line: TelephonyLine) => void;
}

export function GeneralTab({
  billingAccount,
  serviceName,
  line,
  serviceInfos,
  onUpdate,
}: GeneralTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/general');
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(line.description);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await linesService.updateLine(billingAccount, serviceName, { description });
      onUpdate({ ...line, description });
      setEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDescription(line.description);
    setEditing(false);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <div className="line-general-tab">
      {/* Informations de la ligne */}
      <Tile title={t('line.title')}>
        <InfoRow
          label={t('line.serviceName')}
          value={<span className="monospace">{serviceName}</span>}
        />

        <div className="info-row-editable">
          <label>{t('line.description')}</label>
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
              <span>{line.description || t('line.noDescription')}</span>
              <button className="btn-link" onClick={() => setEditing(true)}>
                {t('actions.edit')}
              </button>
            </div>
          )}
        </div>

        <InfoRow
          label={t('line.offer')}
          value={line.offers?.[0] || '-'}
        />

        <InfoRow
          label={t('line.simultaneousLines')}
          value={line.simultaneousLines || 1}
        />

        <InfoRow
          label={t('line.infrastructure')}
          value={line.infrastructure || '-'}
        />
      </Tile>

      {/* Configuration SIP */}
      <Tile title={t('sip.title')}>
        <InfoRow
          label={t('sip.username')}
          value={<span className="monospace">{serviceName}</span>}
        />
        <InfoRow
          label={t('sip.domain')}
          value={<span className="monospace">sip.ovh.net</span>}
        />
        <InfoRow
          label={t('sip.outboundProxy')}
          value={<span className="monospace">sip.ovh.net:5060</span>}
        />
        <div className="sip-password-row">
          <label>{t('sip.password')}</label>
          <button className="btn btn-sm btn-secondary">
            {t('actions.changePassword')}
          </button>
        </div>
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
      <div className="line-general-actions">
        <button className="btn btn-secondary">{t('actions.changeOffer')}</button>
        <button className="btn btn-danger">{t('actions.terminate')}</button>
      </div>
    </div>
  );
}
