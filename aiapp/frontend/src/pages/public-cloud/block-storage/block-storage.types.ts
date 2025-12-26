// ============================================================
// BLOCK-STORAGE TYPES - Définitions partagées au niveau NAV2
// ============================================================

export interface Volume {
  id: string;
  name: string;
  description?: string;
  region: string;
  size: number;
  type: string;
  status: string;
  bootable: boolean;
  attachedTo?: string[];
  createdAt: string;
}

export interface VolumeSnapshot {
  id: string;
  name: string;
  description?: string;
  size: number;
  status: string;
  createdAt: string;
}
