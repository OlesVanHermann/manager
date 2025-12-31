// ============================================================
// TYPES OVERTHEBOX - Partagés entre tous les tabs (SEUL partage autorisé)
// ============================================================

export type OtbStatus = 'active' | 'degraded' | 'offline' | 'maintenance';

export interface OverTheBox {
  serviceName: string;
  customerDescription?: string;
  status: OtbStatus;
  releaseChannel: string;
  systemVersion?: string;
  tunnelMode: string;
  uptime?: number; // seconds
  publicIp?: string;
  deviceId?: string;
  offer?: string;
  activationDate?: string;
  renewalDate?: string;
}

// Alias for service response
export type OverTheBoxService = OverTheBox;

export interface OtbBandwidth {
  download: number; // Mbps
  upload: number;   // Mbps
}

export interface OtbConnection {
  id: string;
  name: string;
  type: 'FTTH' | 'ADSL' | 'VDSL' | '4G' | '5G';
  provider: string;
  status: 'active' | 'degraded' | 'offline';
  bandwidth: OtbBandwidth;
  priority: number;
}

export interface OtbFirmware {
  version: string;
  upToDate: boolean;
  latestVersion?: string;
}

// ============================================================
// CONFIGURATION TYPES
// ============================================================

export interface OtbNetworkConfig {
  dhcpStart: string;
  dhcpEnd: string;
  routerIp: string;
  netmask: string;
  primaryDns: string;
  secondaryDns: string;
}

export type AggregationMode = 'load-balancing' | 'failover' | 'bandwidth' | 'manual';
export type FailoverBehavior = 'automatic' | 'manual' | 'degraded';

export interface OtbAggregationConfig {
  mode: AggregationMode;
  failover: FailoverBehavior;
  encrypted: boolean;
  mtu: number;
}

export interface OtbQosConfig {
  enabled: boolean;
  download: number; // Mbps
  upload: number;   // Mbps
}

export interface OtbBackupInfo {
  lastBackup?: string;
  available: boolean;
}

export interface OtbConfig {
  network: OtbNetworkConfig;
  aggregation: OtbAggregationConfig;
  qos: OtbQosConfig;
  backup: OtbBackupInfo;
}

// ============================================================
// LOGS TYPES
// ============================================================

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface OtbLogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export type LogPeriod = '1h' | '24h' | '7d' | '30d' | 'custom';

// ============================================================
// REMOTES & TASKS TYPES
// ============================================================

export interface Remote {
  remoteId: string;
  publicIp?: string;
  status: string;
  lastSeen?: string;
  exposedPort: number;
}

export interface Task {
  id: string;
  name: string;
  status: 'todo' | 'doing' | 'done' | 'error';
  todoDate: string;
  doneDate?: string;
  progress?: number;
}
