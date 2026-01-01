// ============================================================
// SERVICES TAB - Liste des services du groupe
// ============================================================

import { useState, useEffect } from 'react';
import { ovhApi } from '../../../../../services/api';

interface ServicesTabProps {
  billingAccount: string;
}

interface ServiceItem {
  serviceName: string;
  description: string;
  serviceType: string;
  status: string;
}

export function ServicesTab({ billingAccount }: ServicesTabProps) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!billingAccount) {
      setLoading(false);
      setServices([]);
      return;
    }

    const loadServices = async () => {
      try {
        setLoading(true);
        const serviceNames = await ovhApi.get<string[]>(`/telephony/${billingAccount}/service`);
        const serviceDetails = await Promise.all(
          serviceNames.map(async (name) => {
            try {
              const svc = await ovhApi.get<{ serviceName: string; description: string; serviceType: string; status: string }>(
                `/telephony/${billingAccount}/service/${name}`
              );
              return svc;
            } catch {
              return { serviceName: name, description: name, serviceType: 'unknown', status: 'unknown' };
            }
          })
        );
        setServices(serviceDetails);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
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

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'alias': return '🔗';
      case 'line': return '📞';
      case 'fax': return '📠';
      case 'voicemail': return '📧';
      case 'conference': return '👥';
      case 'ddi': return '📲';
      default: return '⚙️';
    }
  };

  return (
    <div className="sip-tab-list">
      <div className="sip-tab-header">
        <h3>Services</h3>
        <span className="sip-tab-count">{services.length}</span>
      </div>
      {services.length === 0 ? (
        <div className="sip-tab-empty">
          <div className="sip-tab-empty-icon">⚙️</div>
          <div className="sip-tab-empty-text">Aucun service</div>
        </div>
      ) : (
        <div className="sip-tab-items">
          {services.map(svc => (
            <div key={svc.serviceName} className="sip-tab-item">
              <div className="sip-tab-item-icon">{getServiceIcon(svc.serviceType)}</div>
              <div className="sip-tab-item-info">
                <div className="sip-tab-item-title">{svc.description || svc.serviceName}</div>
                <div className="sip-tab-item-subtitle">{svc.serviceName}</div>
                <div className="sip-tab-item-meta">{svc.serviceType}</div>
              </div>
              <div className={`sip-tab-item-badge ${svc.status === 'enabled' ? 'success' : 'warning'}`}>
                {svc.status === 'enabled' ? 'Actif' : svc.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesTab;
