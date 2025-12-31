// ============================================================
// SERVICES TAB - Liste des services du groupe VoIP
// Target: target_.web-cloud.voip.group.services.svg
// DEFACTORISATION: Composants et service ISOLÉS dans ce tab
// ============================================================

import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { servicesTabService, type ServiceItem, type ServiceCounts } from './services.service';
import './services.css';

// ============================================================
// COMPOSANTS UI ISOLÉS (dupliqués selon prompt_split.txt)
// ============================================================

interface BadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
}

function Badge({ type, children }: BadgeProps) {
  return <span className={`voip-badge ${type}`}>{children}</span>;
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="voip-empty-state">
      <div className="voip-empty-state-icon">{icon}</div>
      <div className="voip-empty-state-title">{title}</div>
      {description && <div className="voip-empty-state-description">{description}</div>}
      {action}
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface ServicesTabProps {
  billingAccount: string;
}

export function ServicesTab({ billingAccount }: ServicesTabProps) {
  const { t } = useTranslation('web-cloud/voip/groups/services');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [counts, setCounts] = useState<ServiceCounts>({ all: 0, line: 0, number: 0, fax: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'line' | 'number' | 'fax'>('all');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const allServices = await servicesTabService.getAllServices(billingAccount);
        setServices(allServices);
        setCounts(servicesTabService.getServiceCounts(allServices));
      } catch {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [billingAccount]);

  const filteredServices = services.filter(
    (s) => filter === 'all' || s.type === filter
  );

  if (loading) {
    return (
      <div className="services-tab">
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="services-tab">
      {/* Filtres */}
      <div className="services-filters">
        {(['all', 'line', 'number', 'fax'] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {t(`filter.${f}`)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Liste des services */}
      <div className="voip-table-container">
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.service')}</th>
              <th>{t('table.type')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.serviceName}>
                <td className="monospace">{service.serviceName}</td>
                <td>
                  <Badge
                    type={
                      service.type === 'line'
                        ? 'info'
                        : service.type === 'number'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {t(`type.${service.type}`)}
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary">
                    {t('actions.view')}
                  </button>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="📋"
                    title={t('empty.title')}
                    description={t('empty.description')}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
