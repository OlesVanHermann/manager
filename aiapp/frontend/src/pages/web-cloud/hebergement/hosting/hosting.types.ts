// ============================================================
// HOSTING TYPES - Types partagés pour tous les tabs
// ============================================================

export interface Hosting {
  serviceName: string;
  displayName?: string;
  offer: string;
  state: string;
  cluster?: string;
  datacenter?: string;
  primaryLogin?: string;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
  boostOffer?: string;
  hasCdn?: boolean;
  hostingIp?: string;
  hostingIpv6?: string;
  phpVersion?: string;
  sslState?: string;
}

export interface AttachedDomain {
  domain: string;
  path: string;
  ssl: boolean;
  cdn?: string;
  firewall?: string;
  git?: boolean;
  ownLog?: string;
  ipv6?: boolean;
  status?: string;
}

export interface Database {
  name: string;
  user: string;
  server: string;
  port: number;
  type: string;
  version: string;
  state: string;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
}

export interface FtpUser {
  login: string;
  home: string;
  isPrimaryAccount: boolean;
  state: string;
  sshState?: string;
}

export interface CronJob {
  id: number;
  command: string;
  frequency: string;
  language: string;
  status: string;
  description?: string;
  email?: string;
}

export interface EnvVar {
  key: string;
  value: string;
  type?: string;
}

export interface Runtime {
  id: number;
  name?: string;
  type?: string;
  publicDir?: string;
  appEnv?: string;
  isDefault?: boolean;
}

export interface Module {
  id: number;
  moduleId?: number;
  path?: string;
  version?: string;
  adminName?: string;
  adminFolder?: string;
  targetUrl?: string;
}

export interface SslCertificate {
  domain?: string;
  provider?: string;
  type?: string;
  status?: string;
  creationDate?: string;
  expirationDate?: string;
  subjects?: string[];
}

export interface HostingTask {
  id: number;
  function: string;
  status: string;
  startDate: string;
  doneDate?: string;
}

export interface UserLogs {
  login: string;
  description?: string;
  state?: string;
  creationDate?: string;
}

export interface OwnLog {
  id: number;
  fqdn: string;
  status: string;
}

export interface LocalSeoLocation {
  id: string;
  name?: string;
  address?: string;
  country?: string;
  status?: string;
}

export interface Snapshot {
  id: string;
  creationDate: string;
  type?: string;
}

export interface EmailQuota {
  bounce?: string;
  state?: string;
  maxPerDay?: number;
  sentToday?: number;
}
