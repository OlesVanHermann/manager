// ============================================================
// BILLING TYPES - Types partagés (SEUL fichier partagé autorisé)
// ============================================================

import type { OvhCredentials } from "../../../services/api";

/** Props communes pour tous les tabs billing */
export interface TabProps {
  credentials: OvhCredentials;
}

export type { OvhCredentials };
