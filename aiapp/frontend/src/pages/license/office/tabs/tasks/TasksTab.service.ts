// ============================================================
// OFFICE/TASKS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { OfficeTask } from '../../office.types';

export async function listTasks(serviceName: string): Promise<number[]> {
  return ovhApi.get<number[]>(`/license/office/${serviceName}/task`);
}

export async function getTask(serviceName: string, id: number): Promise<OfficeTask> {
  return ovhApi.get<OfficeTask>(`/license/office/${serviceName}/task/${id}`);
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
