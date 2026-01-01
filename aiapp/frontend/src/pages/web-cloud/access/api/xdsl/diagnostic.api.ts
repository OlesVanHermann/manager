// ============================================================
// API XDSL DIAGNOSTIC - Diagnostic de ligne
// Aligné avec old_manager: OvhApiXdslDiagnostic
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface XdslDiagnostic {
  id: number;
  status: 'init' | 'active' | 'connectionProblem' | 'solved' | 'waitingHuman';
  result?: {
    problem?: string;
    advice?: string[];
    dataFromModem?: boolean;
  };
  creationDate: string;
  endDate?: string;
  comment?: string;
}

// ---------- API ----------

export const xdslDiagnosticApi = {
  /** Récupère le diagnostic en cours. */
  async get(accessName: string): Promise<XdslDiagnostic | null> {
    try {
      return await ovhApi.get<XdslDiagnostic>(`/xdsl/${accessName}/diagnostic`);
    } catch {
      return null;
    }
  },

  /** Lance un nouveau diagnostic. */
  async launch(accessName: string): Promise<XdslDiagnostic> {
    return ovhApi.post<XdslDiagnostic>(`/xdsl/${accessName}/diagnostic`, {});
  },

  /** Annule le diagnostic en cours. */
  async cancel(accessName: string): Promise<void> {
    await ovhApi.delete(`/xdsl/${accessName}/diagnostic`);
  },
};
