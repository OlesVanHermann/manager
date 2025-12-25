// ============================================================
// PUBLIC-CLOUD / AI - Types partagés (SEUL fichier mutualisé)
// ============================================================

export interface Notebook {
  id: string;
  name?: string;
  framework: string;
  status: string;
  url?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  name?: string;
  image: string;
  status: string;
  createdAt: string;
  finishedAt?: string;
}

export interface App {
  id: string;
  name?: string;
  image: string;
  status: string;
  url?: string;
  replicas: number;
  createdAt: string;
}
