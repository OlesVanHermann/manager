// ============================================================
// TYPES PARTAGÉS : Managed WordPress (SEUL fichier partagé autorisé)
// ============================================================

export interface ManagedWordPress {
  serviceName: string;
  displayName?: string;
  state: "active" | "creating" | "deleting" | "error" | "importing" | "installing" | "updating" | "suspended";
  offer: string;
  datacenter: string;
  url: string;
  adminUrl?: string;
  adminUser?: string;
  phpVersion?: string;
  wpVersion?: string;
  wordpressVersion?: string;
  creationDate?: string;
  quota?: { used: number; size: number };
  sslEnabled?: boolean;
  cdnEnabled?: boolean;
  autoUpdate?: boolean;
  updateAvailable?: boolean;
}

export interface ManagedWordPressTask {
  id: number | string;
  function: string;
  status: "todo" | "init" | "doing" | "done" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
  progress?: number;
}

export interface ManagedWordPressBackup {
  id: string;
  date: string;
  type: "automatic" | "manual";
  size: number;
  status: "completed" | "in_progress" | "failed";
}

export interface ManagedWordPressTheme {
  name: string;
  version: string;
  active: boolean;
  updateAvailable?: boolean;
}

export interface ManagedWordPressPlugin {
  name: string;
  version: string;
  active: boolean;
  updateAvailable?: boolean;
}

export interface CreateWebsiteParams {
  domain: string;
  adminEmail: string;
  adminPassword: string;
  language?: string;
  title?: string;
}

export interface ImportWebsiteParams {
  domain: string;
  ftpUrl: string;
  ftpUser: string;
  ftpPassword: string;
  dbUrl?: string;
  dbUser?: string;
  dbPassword?: string;
}
