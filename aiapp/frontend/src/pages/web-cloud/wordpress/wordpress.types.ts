// ============================================================
// TYPES WORDPRESS - Alignés sur OLD_MANAGER
// Source: /home/ubuntu/manager/packages/manager/apps/web-hosting/src/data/types/product/managedWordpress/
// ============================================================

// ============================================================
// REFERENCE TYPES
// ============================================================

export type PHPVersion = string; // ex: "8.2", "8.1", "8.0"

export interface AvailableLanguage {
  code: string;  // ex: "fr_FR", "en_US"
  name: string;  // ex: "Français", "English (US)"
}

// ============================================================
// RESOURCE TYPES (conteneur de plan)
// ============================================================

export interface ManagedWordpressResource {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: ResourceCurrentState;
  currentTasks: ResourceTask[];
  iam?: {
    displayName?: string;
    urn: string;
  };
}

export interface ResourceCurrentState {
  plan: string;
  quotas: {
    websites: { planQuota: number; totalUsage: number };
    disk: { planQuotaBytes: number; totalUsageBytes: number };
    visits?: { planQuota: number; totalUsage: number };
  };
  dashboards: {
    wordpress?: string;
  };
  createdAt: string;
}

export interface ResourceTask {
  id: string;
  type: string;
  status: string;
  link: string;
}

export type ResourceStatus = 'READY' | 'CREATING' | 'DELETING' | 'ERROR' | 'UPDATING';

// ============================================================
// WEBSITE TYPES (site WordPress individuel)
// ============================================================

export interface ManagedWordpressWebsite {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: WebsiteCurrentState;
  currentTasks?: WebsiteTask[];
}

export interface ManagedWordpressWebsiteDetails extends ManagedWordpressWebsite {
  targetSpec?: {
    creation?: CreationSpec;
    import?: ImportSpec;
  };
}

export interface WebsiteCurrentState {
  cms: 'WORDPRESS';
  defaultFQDN: string;
  phpVersion: string;
  diskUsageBytes: number;
  createdAt: string;
  import?: {
    checkResult: {
      cmsSpecific: {
        wordpress: {
          plugins: PluginInfo[];
          themes: ThemeInfo[];
          version?: string;
        };
      };
    };
  };
}

export interface WebsiteTask {
  id: string;
  type: string;
  status: string;
}

export interface PluginInfo {
  name: string;
  version: string;
  enabled: boolean;
}

export interface ThemeInfo {
  name: string;
  version: string;
  active: boolean;
}

// ============================================================
// CREATION / IMPORT PAYLOADS
// ============================================================

export interface CreationSpec {
  adminLogin: string;
  adminPassword: string;
  cms: 'WORDPRESS';
  cmsSpecific?: {
    wordpress?: {
      language?: string;
      url?: string;
    };
  };
  phpVersion?: string;
}

export interface ImportSpec {
  adminLogin: string;
  adminPassword: string;
  adminURL?: string;
  cms: 'WORDPRESS';
}

// Payload pour POST /managedCMS/resource/{serviceName}/website (création)
export interface PostCreatePayload {
  targetSpec: {
    creation: CreationSpec;
  };
}

// Payload pour POST /managedCMS/resource/{serviceName}/website (import)
export interface PostImportPayload {
  targetSpec: {
    import: ImportSpec;
  };
}

// Payload pour PUT /managedCMS/resource/{serviceName}/task/{taskId} (import step 2)
export interface PostImportTaskPayload {
  inputs: {
    'import.cmsSpecific.wordpress.selection': ImportSelection;
  };
}

export interface ImportSelection {
  plugins: { name: string; version: string; enabled: boolean }[];
  themes: { name: string; version: string; active: boolean }[];
  wholeDatabase: boolean;
  media: boolean;
  posts: boolean;
  pages: boolean;
  comments: boolean;
  tags: boolean;
  users: boolean;
}

// ============================================================
// TASK TYPES
// ============================================================

export interface WordPressTask {
  id: string;
  type: TaskType;
  status: TaskStatus;
  function?: string;
  message?: string;
  progress?: number;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  doneDate?: string;
}

export type TaskType =
  | 'CREATION'
  | 'IMPORT'
  | 'DELETION'
  | 'UPDATE'
  | 'BACKUP'
  | 'RESTORE'
  | 'SSL'
  | 'CACHE_FLUSH'
  | string;

export type TaskStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'DONE'
  | 'ERROR'
  | 'CANCELLED'
  | 'WAITING_USER_INPUT'
  | string;

// ============================================================
// LEGACY TYPES (pour compatibilité avec le code existant)
// ============================================================

/**
 * @deprecated Utiliser ManagedWordpressWebsiteDetails à la place
 * Ce type est conservé pour la compatibilité avec le code existant
 */
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
  hasUpdate?: boolean;
  newVersion?: string;
  thumbnail?: string;
  status?: 'active' | 'inactive' | 'update_available';
}

export interface WordPressPlugin {
  name: string;
  displayName?: string;
  version: string;
  active: boolean;
  updateAvailable?: boolean;
  hasUpdate?: boolean;
  newVersion?: string;
  status?: 'active' | 'inactive' | 'update_available';
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
  restoreType?: 'all' | 'files' | 'database';
  files?: boolean;
  database?: boolean;
  configuration?: boolean;
}

// ---------- FORM DATA ----------

export interface CreateWebsiteFormData {
  adminLogin: string;
  adminPassword: string;
  language: string;
  url: string;
  phpVersion?: string;
}

export interface ImportWebsiteFormData {
  adminLogin: string;
  adminPassword: string;
  adminURL?: string;
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

// ============================================================
// HELPER: Convertir Website vers WordPress legacy
// ============================================================

export function websiteToLegacy(
  website: ManagedWordpressWebsiteDetails,
  resource?: ManagedWordpressResource
): WordPress {
  const state = website.currentState;
  const importData = state.import?.checkResult?.cmsSpecific?.wordpress;

  return {
    serviceName: website.id,
    displayName: state.defaultFQDN,
    state: mapResourceStatus(website.resourceStatus),
    offer: resource?.currentState?.plan?.replace('managed-cms-alpha-', '') || 'WordPress',
    datacenter: 'gra', // Non disponible dans l'API, valeur par défaut
    url: `https://${state.defaultFQDN}`,
    adminUrl: `https://${state.defaultFQDN}/wp-admin`,
    phpVersion: state.phpVersion,
    wordpressVersion: importData?.version,
    creationDate: state.createdAt,
    quota: {
      used: state.diskUsageBytes,
      size: resource?.currentState?.quotas?.disk?.planQuotaBytes || 0,
    },
    sslEnabled: true, // Par défaut sur managed WordPress
    cdnEnabled: false,
    autoUpdate: true,
    updateAvailable: false,
  };
}

function mapResourceStatus(status: ResourceStatus): WordPressState {
  const map: Record<ResourceStatus, WordPressState> = {
    READY: 'active',
    CREATING: 'creating',
    DELETING: 'deleting',
    ERROR: 'error',
    UPDATING: 'updating',
  };
  return map[status] || 'active';
}
