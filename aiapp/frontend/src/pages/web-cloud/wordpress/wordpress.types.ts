// ============================================================
// TYPES PARTAGÉS : WordPress
// ============================================================

// ---------- SITE PRINCIPAL ----------

export interface WordPress {
  serviceName: string;
  displayName?: string;
  state: WordPressState;
  offer: WordPressOffer;
  datacenter: string;
  url: string;
  adminUrl?: string;
  adminUser?: string;
  phpVersion?: string;
  wpVersion?: string;
  wordpressVersion?: string;
  creationDate?: string;
  expirationDate?: string;
  quota?: { used: number; size: number };
  sslEnabled?: boolean;
  cdnEnabled?: boolean;
  autoUpdate?: boolean;
  updateAvailable?: boolean;
  ipAddress?: string;
}

export type WordPressState = 'active' | 'creating' | 'deleting' | 'error' | 'importing' | 'installing' | 'updating' | 'suspended';
export type WordPressOffer = 'Start' | 'Pro' | 'Business' | string;

export interface ServiceInfos {
  creation: string;
  expiration: string;
  status: string;
  renew?: {
    automatic: boolean;
    period: string;
  };
}

// ---------- DOMAINES ----------

export interface WordPressDomain {
  domain: string;
  type: 'primary' | 'alias' | 'multisite';
  sslStatus: SslStatus;
  dnsStatus: DnsStatus;
  redirectTo?: string;
}

export type SslStatus = 'active' | 'pending' | 'none' | 'error';
export type DnsStatus = 'ok' | 'error' | 'pending';

export interface SslConfig {
  certificateType: 'letsEncrypt' | 'custom';
  forceHttps: boolean;
  expirationDate?: string;
}

// ---------- PERFORMANCES ----------

export interface CdnStatus {
  enabled: boolean;
  provider: string;
  popCount: number;
  bandwidth: number;
  bandwidthUnit: string;
}

export interface CacheStatus {
  serverCache: boolean;
  browserCache: boolean;
  lastFlush: string | null;
}

export interface Optimizations {
  gzip: boolean;
  brotli: boolean;
  http2: boolean;
  http3: boolean;
}

// ---------- EXTENSIONS ----------

export interface WordPressTheme {
  name: string;
  displayName?: string;
  version: string;
  active: boolean;
  updateAvailable?: boolean;
  newVersion?: string;
  thumbnail?: string;
}

export interface WordPressPlugin {
  name: string;
  displayName?: string;
  version: string;
  active: boolean;
  updateAvailable?: boolean;
  newVersion?: string;
}

// ---------- SAUVEGARDES ----------

export interface WordPressBackup {
  id: string;
  date: string;
  type: 'automatic' | 'manual';
  size: number;
  sizeUnit?: string;
  status: BackupStatus;
  note?: string;
}

export type BackupStatus = 'completed' | 'in_progress' | 'failed' | 'success' | 'pending' | 'error';

export interface BackupStorage {
  used: number;
  quota: number;
  unit: string;
}

export interface RestoreOptions {
  restoreType: 'all' | 'files' | 'database';
}

// ---------- TACHES ----------

export interface WordPressTask {
  id: number | string;
  function: string;
  type?: TaskType;
  description?: string;
  status: TaskStatus;
  startDate?: string;
  doneDate?: string;
  progress?: number;
}

export type TaskType = 'backup' | 'update' | 'ssl' | 'restore' | 'install' | 'import' | 'plugin' | 'theme' | 'cache';
export type TaskStatus = 'todo' | 'init' | 'doing' | 'done' | 'error' | 'cancelled' | 'running' | 'pending';

// ---------- CREATION / IMPORT ----------

export interface CreateWebsiteParams {
  displayName?: string;
  domain: string;
  offer?: WordPressOffer;
  datacenter?: string;
  adminEmail: string;
  adminUser?: string;
  adminPassword: string;
  language?: string;
  title?: string;
}

export interface ImportWebsiteParams {
  sourceUrl?: string;
  domain: string;
  ftpUrl: string;
  ftpUser: string;
  ftpPassword: string;
  ftpPort?: number;
  dbUrl?: string;
  dbUser?: string;
  dbPassword?: string;
  dbName?: string;
  dbPort?: number;
}

// ---------- API RESPONSES ----------

export interface ApiListResponse<T> {
  data: T[];
  total: number;
}

export interface ApiTaskResponse {
  taskId: string;
  status: TaskStatus;
}
