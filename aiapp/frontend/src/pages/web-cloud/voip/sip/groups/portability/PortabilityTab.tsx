// ============================================================
// PORTABILITY TAB - Portabilités du groupe VoIP
// Target: target_.web-cloud.voip.group.portability.svg
// DEFACTORISATION: Composants et service ISOLÉS dans ce tab
// ============================================================

import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { portabilityTabService, type GroupPortability } from './PortabilityTab.service';
import './PortabilityTab.css';

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

interface PortabilityTabProps {
  billingAccount: string;
}

export function PortabilityTab({ billingAccount }: PortabilityTabProps) {
  const { t } = useTranslation('web-cloud/voip/groups/portability');
  const [portabilities, setPortabilities] = useState<GroupPortability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortabilities = async () => {
      try {
        setLoading(true);
        const data = await portabilityTabService.getPortabilities(billingAccount);
        setPortabilities(data);
      } catch {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    loadPortabilities();
  }, [billingAccount]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="portability-tab">
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="portability-tab">
      {/* Actions */}
      <div className="portability-actions">
        <button className="btn btn-primary">
          + {t('actions.newPortability')}
        </button>
      </div>

      {/* Table */}
      <div className="voip-table-container">
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.id')}</th>
              <th>{t('table.numbers')}</th>
              <th>{t('table.creationDate')}</th>
              <th>{t('table.desiredDate')}</th>
              <th>{t('table.status')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {portabilities.map((p) => (
              <tr key={p.id}>
                <td className="monospace">#{p.id}</td>
                <td>{p.numbersList?.join(', ') || '-'}</td>
                <td>{formatDate(p.creationDate)}</td>
                <td>{p.desiredExecutionDate ? formatDate(p.desiredExecutionDate) : '-'}</td>
                <td>
                  <Badge type={portabilityTabService.getStatusBadgeType(p.status)}>
                    {t(`status.${p.status}`)}
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary">
                    {t('actions.details')}
                  </button>
                </td>
              </tr>
            ))}
            {portabilities.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="📲"
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
