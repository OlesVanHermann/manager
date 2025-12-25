// ============================================================
// PUBLIC-CLOUD / DATABASES - Types partagés (SEUL fichier mutualisé)
// ============================================================

export interface Database {
  id: string;
  description: string;
  engine: string;
  version: string;
  plan: string;
  status: string;
  region: string;
  nodeNumber: number;
  flavor: string;
}

export interface DbUser {
  id: string;
  username: string;
  status: string;
  createdAt: string;
}

export interface Backup {
  id: string;
  description?: string;
  status: string;
  createdAt: string;
  size: number;
}
