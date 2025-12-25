// ============================================================
// ZIMBRA/TASKS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ZimbraTask } from '../../zimbra.types';

export async function listTasks(serviceId: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/task`);
}

export async function getTask(serviceId: string, taskId: string): Promise<ZimbraTask> {
  return ovhApi.get<ZimbraTask>(`/email/zimbra/${serviceId}/task/${taskId}`);
}

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
