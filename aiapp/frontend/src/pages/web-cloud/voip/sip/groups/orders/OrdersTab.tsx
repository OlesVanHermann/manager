// ============================================================
// ORDERS TAB - Commandes du groupe VoIP
// Target: target_.web-cloud.voip.group.orders.svg
// DEFACTORISATION: Composants et service ISOLÉS dans ce tab
// ============================================================

import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ordersTabService, type GroupOrder } from './OrdersTab.service';
import './OrdersTab.css';

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

interface OrdersTabProps {
  billingAccount: string;
}

export function OrdersTab({ billingAccount }: OrdersTabProps) {
  const { t } = useTranslation('web-cloud/voip/groups/orders');
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await ordersTabService.getOrders(billingAccount);
        setOrders(data);
      } catch {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [billingAccount]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="orders-tab">
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="orders-tab">
      <div className="voip-table-container">
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.orderId')}</th>
              <th>{t('table.date')}</th>
              <th>{t('table.description')}</th>
              <th>{t('table.status')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td className="monospace">#{order.orderId}</td>
                <td>{formatDate(order.date)}</td>
                <td>{order.description || '-'}</td>
                <td>
                  <Badge type={ordersTabService.getStatusBadgeType(order.status)}>
                    {t(`status.${order.status}`)}
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary">
                    {t('actions.details')}
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="📦"
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
