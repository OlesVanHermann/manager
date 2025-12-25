// ============================================================
// EMAIL-DOMAIN/TASKS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { EmailTask } from '../../email-domain.types';

export async function listTasks(domain: string): Promise<number[]> {
  return ovhApi.get<number[]>(`/email/domain/${domain}/task`);
}

export async function getTask(domain: string, id: number): Promise<EmailTask> {
  return ovhApi.get<EmailTask>(`/email/domain/${domain}/task/${id}`);
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
