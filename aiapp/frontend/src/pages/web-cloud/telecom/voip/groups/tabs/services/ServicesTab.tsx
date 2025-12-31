// ============================================================
// SERVICES TAB - Liste des services du groupe VoIP
// Target: target_.web-cloud.voip.group.services.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { groupsService } from '../../groups.service';
import { Tile, InfoRow, Badge, EmptyState } from '../../../components/RightPanel';
import './ServicesTab.css';

interface ServicesTabProps {
  billingAccount: string;
}

interface ServiceItem {
  serviceName: string;
  type: 'line' | 'number' | 'fax';
  description?: string;
}

export function ServicesTab({ billingAccount }: ServicesTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/groups/services');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'line' | 'number' | 'fax'>('all');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const [lines, numbers, faxList] = await Promise.all([
          groupsService.getLines(billingAccount).catch(() => []),
          groupsService.getNumbers(billingAccount).catch(() => []),
          groupsService.getFaxList(billingAccount).catch(() => []),
        ]);

        const allServices: ServiceItem[] = [
          ...lines.map((s) => ({ serviceName: s, type: 'line' as const })),
          ...numbers.map((s) => ({ serviceName: s, type: 'number' as const })),
          ...faxList.map((s) => ({ serviceName: s, type: 'fax' as const })),
        ];
        setServices(allServices);
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

  const counts = {
    all: services.length,
    line: services.filter((s) => s.type === 'line').length,
    number: services.filter((s) => s.type === 'number').length,
    fax: services.filter((s) => s.type === 'fax').length,
  };

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
