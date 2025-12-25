// ============================================================
// TYPES PARTAGÉS : Private Database (SEUL fichier partagé autorisé)
// ============================================================

export interface PrivateDatabase {
  serviceName: string;
  displayName?: string;
  state: "started" | "stopped" | "starting" | "stopping" | "error";
  type: "mysql" | "mariadb" | "postgresql" | "redis";
  version: string;
  hostname: string;
  hostnameFtp?: string;
  port: number;
  portFtp?: number;
  ram: { value: number; unit: string };
  cpu?: number;
  quotaUsed?: { value: number; unit: string };
  quotaSize?: { value: number; unit: string };
  datacenter?: string;
  offer?: string;
  infrastructure?: string;
  creationDate?: string;
}

export interface PrivateDatabaseServiceInfos {
  creation: string;
  expiration: string;
  renew?: {
    automatic: boolean;
    period?: string;
  };
}

export interface PdbDatabase {
  databaseName: string;
  quotaUsed: { value: number; unit: string };
  quotaSize: { value: number; unit: string };
  usersCount?: number;
  backupTime?: string;
}

export interface PdbUser {
  userName: string;
  creationDate: string;
  databases?: { databaseName: string; grantType: string }[];
  grants?: { databaseName: string; grant: "admin" | "rw" | "ro" | "none" }[];
}

export interface PdbWhitelist {
  ip: string;
  name?: string;
  service: boolean;
  sftp: boolean;
  status?: string;
  creationDate: string;
}

export interface PdbTask {
  id: number;
  function: string;
  status: "todo" | "init" | "doing" | "done" | "error" | "cancelled";
  startDate: string;
  doneDate?: string;
}

export interface PdbConfigParam {
  key: string;
  value: string;
  defaultValue: string;
  description: string;
  type: "number" | "boolean" | "string" | "enum";
  min?: number;
  max?: number;
  options?: string[];
  unit?: string;
}

export interface PdbLogEntry {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info";
  message: string;
  details?: string;
}

export interface PdbMetricData {
  timestamp: number;
  value: number;
}

export interface PdbMetrics {
  memory: PdbMetricData[];
  cpu: PdbMetricData[];
  connections: PdbMetricData[];
  queries: PdbMetricData[];
}
