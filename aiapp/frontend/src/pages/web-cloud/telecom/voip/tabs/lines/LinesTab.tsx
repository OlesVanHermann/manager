// ============================================================
// LINES TAB - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { linesService } from './LinesTab';
import type { TelephonyLine } from '../../voip.types';
import './LinesTab.css';

interface Props {
  billingAccount: string;
}

export function LinesTab({ billingAccount }: Props) {
  const { t } = useTranslation('web-cloud/voip/index');
  const [lines, setLines] = useState<TelephonyLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await linesService.getLines(billingAccount);
        setLines(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [billingAccount]);

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  const trunkCount = lines.filter(l => l.serviceType === 'trunk').length;

  return (
    <div className="lines-tab">
      <div className="lines-header">
        <div>
          <h3>{t('lines.title')}</h3>
        </div>
        <span className="lines-count">{lines.length}</span>
      </div>

      <div className="lines-stats">
        <div className="lines-stat-card">
          <div className="lines-stat-value">{lines.length}</div>
          <div className="lines-stat-label">Lignes</div>
        </div>
        <div className="lines-stat-card">
          <div className="lines-stat-value">{trunkCount}</div>
          <div className="lines-stat-label">Trunks</div>
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="lines-empty">
          <p>{t('lines.empty')}</p>
        </div>
      ) : (
        <div className="lines-cards">
          {lines.map(line => (
            <div
              key={line.serviceName}
              className={`lines-card ${line.serviceType === 'trunk' ? 'lines-trunk' : ''}`}
            >
              <div className={`lines-icon ${line.serviceType === 'trunk' ? 'lines-trunk' : ''}`}>
                {line.serviceType === 'trunk' ? '📡' : '📞'}
              </div>
              <div className="lines-info">
                <h4>{line.serviceName}</h4>
                <p>{line.description || t('lines.noDescription')}</p>
                <div className="lines-meta">
                  <span className="badge info">{line.serviceType}</span>
                  <span className="badge">{line.simultaneousLines} appels</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LinesTab;
