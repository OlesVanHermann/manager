// ============================================================
// AGENT ADD MODAL - Ajouter un agent à la file d'attente
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { modalsService } from './modals.service';
import './modals.css';

interface Props {
  billingAccount: string;
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AgentAddModal({ billingAccount, serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/voip/modals');
  const [agentNumber, setAgentNumber] = useState('');
  const [position, setPosition] = useState(1);
  const [simultaneousLines, setSimultaneousLines] = useState(1);
  const [status, setStatus] = useState<'available' | 'paused'>('available');
  const [wrapUpTime, setWrapUpTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!agentNumber.trim()) return;

    setLoading(true);
    setError('');

    try {
      await modalsService.addQueueAgent(billingAccount, serviceName, {
        agentNumber: agentNumber.trim(),
        position,
        simultaneousLines,
        status,
        wrapUpTime,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAgentNumber('');
    setPosition(1);
    setSimultaneousLines(1);
    setStatus('available');
    setWrapUpTime(0);
    setError('');
    onClose();
  };

  return (
    <div className="voip-modal-overlay" onClick={handleClose}>
      <div className="voip-modal" onClick={e => e.stopPropagation()}>
        <div className="voip-modal-header">
          <h3>{t('agent.title')}</h3>
          <button className="voip-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="voip-modal-body">
          <div className="voip-form-group">
            <label className="voip-form-label">{t('agent.number')}</label>
            <input
              type="tel"
              className="voip-form-input"
              value={agentNumber}
              onChange={e => setAgentNumber(e.target.value)}
              placeholder={t('agent.numberPlaceholder')}
            />
            <p className="voip-form-hint">{t('agent.numberHint')}</p>
          </div>

          <div className="voip-form-row">
            <div className="voip-form-group">
              <label className="voip-form-label">{t('agent.position')}</label>
              <input
                type="number"
                className="voip-form-input"
                value={position}
                min={1}
                max={100}
                onChange={e => setPosition(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="voip-form-group">
              <label className="voip-form-label">{t('agent.lines')}</label>
              <input
                type="number"
                className="voip-form-input"
                value={simultaneousLines}
                min={1}
                max={10}
                onChange={e => setSimultaneousLines(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('agent.status')}</label>
            <select
              className="voip-form-select"
              value={status}
              onChange={e => setStatus(e.target.value as 'available' | 'paused')}
            >
              <option value="available">{t('agent.statuses.available')}</option>
              <option value="paused">{t('agent.statuses.paused')}</option>
            </select>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('agent.wrapUpTime')}</label>
            <select
              className="voip-form-select"
              value={wrapUpTime}
              onChange={e => setWrapUpTime(parseInt(e.target.value))}
            >
              <option value="0">{t('agent.noWrapUp')}</option>
              <option value="10">10 {t('common.seconds')}</option>
              <option value="30">30 {t('common.seconds')}</option>
              <option value="60">60 {t('common.seconds')}</option>
              <option value="120">120 {t('common.seconds')}</option>
            </select>
            <p className="voip-form-hint">{t('agent.wrapUpHint')}</p>
          </div>

          {error && <p className="voip-form-error">{error}</p>}
        </div>

        <div className="voip-modal-footer">
          <button className="voip-btn-cancel" onClick={handleClose}>
            {t('common.cancel')}
          </button>
          <button
            className="voip-btn-confirm"
            onClick={handleSubmit}
            disabled={loading || !agentNumber.trim()}
          >
            {loading ? t('common.adding') : t('common.add')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentAddModal;
