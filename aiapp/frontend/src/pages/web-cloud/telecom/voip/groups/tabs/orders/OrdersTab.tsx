// ============================================================
// ORDERS TAB - Commandes du groupe VoIP
// Target: target_.web-cloud.voip.group.orders.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { groupsService } from '../../groups.service';
import { Badge, EmptyState } from '../../../components/RightPanel';
import type { GroupOrder } from '../../groups.types';
import './OrdersTab.css';

interface OrdersTabProps {
  billingAccount: string;
}

export function OrdersTab({ billingAccount }: OrdersTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/groups/orders');
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await groupsService.getOrders(billingAccount);
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

  const getStatusType = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'info';
    }
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
                  <Badge type={getStatusType(order.status)}>
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
