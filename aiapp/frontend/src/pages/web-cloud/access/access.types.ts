// ============================================================
// TYPES ACCESS - Types page principale (listing uniquement)
// ============================================================
// NOTE: Les types détaillés sont dans connections/connections.types.ts
// Ce fichier ne contient que les types pour la page access/index.tsx

export interface Connection {
  id: string;
  name: string;
  techType: string;
  offerLabel: string;
  status: string;
  downSpeed: number;
  upSpeed: number;
  modem: { name: string; type: 'ovh' | 'custom' } | null;
}
