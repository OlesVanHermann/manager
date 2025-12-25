// ============================================================
// EXCHANGE/TASKS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ExchangeTask } from '../../exchange.types';

// ============================================================
// API CALLS - Copie locale (défactorisation)
// ============================================================

export async function listTasks(org: string, service: string): Promise<number[]> {
  return ovhApi.get<number[]>(`/email/exchange/${org}/service/${service}/task`);
}

export async function getTask(org: string, service: string, id: number): Promise<ExchangeTask> {
  return ovhApi.get<ExchangeTask>(`/email/exchange/${org}/service/${service}/task/${id}`);
}

// ============================================================
// HELPERS - Copie locale
// ============================================================

export function getStatusBadge(status: string): { cls: string; icon: string } {
  const map: Record<string, { cls: string; icon: string }> = {
    todo: { cls: 'warning', icon: '⏳' },
    doing: { cls: 'info', icon: '🔄' },
    done: { cls: 'success', icon: '✓' },
    error: { cls: 'error', icon: '✗' },
    cancelled: { cls: 'inactive', icon: '⊘' }
  };
  return map[status] || { cls: 'inactive', icon: '?' };
}
