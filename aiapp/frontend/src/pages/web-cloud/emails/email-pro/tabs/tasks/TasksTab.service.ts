// ============================================================
// EMAIL-PRO/TASKS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { EmailProTask } from '../../email-pro.types';

export async function listTasks(service: string): Promise<number[]> {
  return ovhApi.get<number[]>(`/email/pro/${service}/task`);
}

export async function getTask(service: string, id: number): Promise<EmailProTask> {
  return ovhApi.get<EmailProTask>(`/email/pro/${service}/task/${id}`);
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
