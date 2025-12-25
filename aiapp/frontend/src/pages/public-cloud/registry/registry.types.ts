// ============================================================
// PUBLIC-CLOUD / REGISTRY - Types partagés (SEUL fichier mutualisé)
// ============================================================

export interface Registry {
  id: string;
  name: string;
  region: string;
  status: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface Image {
  id: string;
  name: string;
  tagsCount: number;
  size: number;
  updatedAt: string;
}

export interface RegistryUser {
  id: string;
  user: string;
  email?: string;
}
