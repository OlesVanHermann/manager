// ============================================================
// API SERVICE - Wrapper de compatibilité
// Réexporte api.ts avec l'objet ovhApi pour les services produits
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from './api';

// Réexport de tout api.ts
export * from './api';

// Objet ovhApi pour compatibilité avec les services produits
export const ovhApi = {
  get: ovhGet,
  post: ovhPost,
  put: ovhPut,
  delete: ovhDelete,
};
