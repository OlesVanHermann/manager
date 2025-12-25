// ============================================================
// NUMBERS TAB - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from './NumbersTab';
import type { TelephonyNumber } from '../../voip.types';
import './NumbersTab.css';

interface Props {
  billingAccount: string;
}

export function NumbersTab({ billingAccount }: Props) {
  const { t } = useTranslation('web-cloud/voip/index');
  const [numbers, setNumbers] = useState<TelephonyNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await numbersService.getNumbers(billingAccount);
        setNumbers(data);
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
      </div>
    );
  }

  return (
    <div className="numbers-tab">
      <div className="numbers-header">
        <div>
          <h3>{t('numbers.title')}</h3>
        </div>
        <span className="numbers-count">{numbers.length}</span>
      </div>

      {numbers.length === 0 ? (
        <div className="numbers-empty">
          <p>{t('numbers.empty')}</p>
        </div>
      ) : (
        <div className="numbers-cards">
          {numbers.map(num => (
            <div key={num.serviceName} className="numbers-card">
              <div className="numbers-card-header">
                <h4>{num.serviceName}</h4>
                <span className={`numbers-type numbers-${num.serviceType}`}>
                  {num.serviceType}
                </span>
              </div>
              <div className="numbers-meta">
                <span>🌍 {num.country}</span>
                {num.description && <span>{num.description}</span>}
              </div>
              <div className="numbers-feature">
                <span className="numbers-feature-tag">🎯 {num.featureType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NumbersTab;
