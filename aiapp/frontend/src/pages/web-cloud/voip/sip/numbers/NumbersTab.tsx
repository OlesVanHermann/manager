// ============================================================
// NUMBERS TAB - Liste des numéros
// ============================================================

import { useState, useEffect } from 'react';
import { ovhApi } from '../../../../../services/api';

interface NumbersTabProps {
  billingAccount: string;
}

interface NumberItem {
  serviceName: string;
  description: string;
  featureType: string;
  status: string;
}

export function NumbersTab({ billingAccount }: NumbersTabProps) {
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!billingAccount) {
      setLoading(false);
      setNumbers([]);
      return;
    }

    const loadNumbers = async () => {
      try {
        setLoading(true);
        const numberNames = await ovhApi.get<string[]>(`/telephony/${billingAccount}/number`);
        const numberDetails = await Promise.all(
          numberNames.map(async (name) => {
            try {
              const num = await ovhApi.get<{ serviceName: string; description: string; featureType: string; getPublicOffer: { status: string } }>(
                `/telephony/${billingAccount}/number/${name}`
              );
              return {
                serviceName: num.serviceName,
                description: num.description || num.serviceName,
                featureType: num.featureType || 'standard',
                status: 'enabled',
              };
            } catch {
              return { serviceName: name, description: name, featureType: 'standard', status: 'unknown' };
            }
          })
        );
        setNumbers(numberDetails);
      } catch {
        setNumbers([]);
      } finally {
        setLoading(false);
      }
    };
    loadNumbers();
  }, [billingAccount]);

  if (loading) {
    return (
      <div className="sip-tab-loading">
        <div className="voip-skeleton" style={{ height: 60, marginBottom: 8 }} />
        <div className="voip-skeleton" style={{ height: 60, marginBottom: 8 }} />
        <div className="voip-skeleton" style={{ height: 60, marginBottom: 8 }} />
      </div>
    );
  }

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'conference': return '👥';
      case 'contactCenterSolution': return '🎧';
      case 'ddi': return '📲';
      case 'easyHunting': return '🔀';
      case 'fax': return '📠';
      case 'voicemail': return '📧';
      default: return '🔢';
    }
  };

  return (
    <div className="sip-tab-list">
      <div className="sip-tab-header">
        <h3>Numéros</h3>
        <span className="sip-tab-count">{numbers.length}</span>
      </div>
      {numbers.length === 0 ? (
        <div className="sip-tab-empty">
          <div className="sip-tab-empty-icon">🔢</div>
          <div className="sip-tab-empty-text">Aucun numéro</div>
        </div>
      ) : (
        <div className="sip-tab-items">
          {numbers.map(num => (
            <div key={num.serviceName} className="sip-tab-item">
              <div className="sip-tab-item-icon">{getFeatureIcon(num.featureType)}</div>
              <div className="sip-tab-item-info">
                <div className="sip-tab-item-title">{num.description}</div>
                <div className="sip-tab-item-subtitle">{num.serviceName}</div>
                <div className="sip-tab-item-meta">{num.featureType}</div>
              </div>
              <div className={`sip-tab-item-badge ${num.status === 'enabled' ? 'success' : 'warning'}`}>
                {num.status === 'enabled' ? 'Actif' : num.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NumbersTab;
