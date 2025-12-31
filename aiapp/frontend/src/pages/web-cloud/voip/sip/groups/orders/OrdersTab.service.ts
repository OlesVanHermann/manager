// ============================================================
// ORDERS TAB SERVICE - Appels API isolés pour Orders
// Target: target_.web-cloud.voip.group.orders.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

// Types locaux pour ce tab
export interface GroupOrder {
  orderId: number;
  date: string;
  description: string;
  status: 'pending' | 'delivered' | 'cancelled' | 'expired';
  expirationDate?: string;
  pdfUrl?: string;
}

// Service isolé pour OrdersTab
export const ordersTabService = {
  // Récupérer la liste des commandes
  async getOrders(billingAccount: string): Promise<GroupOrder[]> {
    const orderIds = await ovhApi.get<number[]>(`/telephony/${billingAccount}/order`).catch(() => []);
    const orders = await Promise.all(
      orderIds.slice(0, 20).map(async (id) => {
        try {
          return await ovhApi.get<GroupOrder>(`/telephony/${billingAccount}/order/${id}`);
        } catch {
          return null;
        }
      })
    );
    return orders.filter((o): o is GroupOrder => o !== null);
  },

  // Récupérer les détails d'une commande
  async getOrderDetails(billingAccount: string, orderId: number): Promise<GroupOrder | null> {
    try {
      return await ovhApi.get<GroupOrder>(`/telephony/${billingAccount}/order/${orderId}`);
    } catch {
      return null;
    }
  },

  // Helper: Déterminer le type de badge selon le statut
  getStatusBadgeType(status: string): 'success' | 'warning' | 'error' | 'info' {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'expired':
        return 'error';
      default:
        return 'info';
    }
  },
};
