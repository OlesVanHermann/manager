// ============================================================
// PUBLIC-CLOUD / OBJECT-STORAGE - Types partagés (SEUL fichier mutualisé)
// ============================================================

export interface Container {
  name: string;
  region: string;
  storedBytes: number;
  storedObjects: number;
  staticUrl?: string;
  containerType: string;
}

export interface StorageObject {
  name: string;
  size: number;
  contentType: string;
  lastModified: string;
}

export interface S3User {
  id: string;
  username: string;
  description?: string;
  createdAt: string;
}
