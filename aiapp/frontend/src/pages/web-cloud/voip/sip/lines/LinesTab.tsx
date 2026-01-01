// ============================================================
// LINES TAB - Liste des lignes SIP
// ============================================================

import { useState, useEffect } from 'react';
import { ovhApi } from '../../../../../services/api';

interface LinesTabProps {
  billingAccount: string;
}

interface LineItem {
  serviceName: string;
  description: string;
  serviceType: string;
  status: string;
}

export function LinesTab({ billingAccount }: LinesTabProps) {
  const [lines, setLines] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!billingAccount) {
      setLoading(false);
      setLines([]);
      return;
    }

    const loadLines = async () => {
      try {
        setLoading(true);
        const lineNames = await ovhApi.get<string[]>(`/telephony/${billingAccount}/line`);
        const lineDetails = await Promise.all(
          lineNames.map(async (name) => {
            try {
              const line = await ovhApi.get<{ serviceName: string; description: string; serviceType: string; status: string }>(
                `/telephony/${billingAccount}/line/${name}`
              );
              return line;
            } catch {
              return { serviceName: name, description: name, serviceType: 'sip', status: 'unknown' };
            }
          })
        );
        setLines(lineDetails);
      } catch {
        setLines([]);
      } finally {
        setLoading(false);
      }
    };
    loadLines();
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

  return (
    <div className="sip-tab-list">
      <div className="sip-tab-header">
        <h3>Lignes SIP</h3>
        <span className="sip-tab-count">{lines.length}</span>
      </div>
      {lines.length === 0 ? (
        <div className="sip-tab-empty">
          <div className="sip-tab-empty-icon">📞</div>
          <div className="sip-tab-empty-text">Aucune ligne</div>
        </div>
      ) : (
        <div className="sip-tab-items">
          {lines.map(line => (
            <div key={line.serviceName} className="sip-tab-item">
              <div className="sip-tab-item-icon">📞</div>
              <div className="sip-tab-item-info">
                <div className="sip-tab-item-title">{line.description || line.serviceName}</div>
                <div className="sip-tab-item-subtitle">{line.serviceName}</div>
                <div className="sip-tab-item-meta">{line.serviceType}</div>
              </div>
              <div className={`sip-tab-item-badge ${line.status === 'enabled' ? 'success' : 'warning'}`}>
                {line.status === 'enabled' ? 'Actif' : line.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LinesTab;
