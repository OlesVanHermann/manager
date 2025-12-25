// ============================================================
// DBAAS-LOGS TYPES - Types partagés pour le module Logs Data Platform
// ============================================================

/** Informations générales d'un service LDP */
export interface LogsService {
  serviceName: string;
  displayName?: string;
  cluster: string;
  region: string;
  state: string;
  plan: string;
  createdAt: string;
}

/** Stream Graylog */
export interface Stream {
  streamId: string;
  title: string;
  description?: string;
  retentionId: string;
  indexingEnabled: boolean;
  webSocketEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Dashboard Graylog */
export interface Dashboard {
  dashboardId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isEditable: boolean;
}

/** Index Elasticsearch */
export interface Index {
  indexId: string;
  name: string;
  description?: string;
  nbShard: number;
  isEditable: boolean;
  createdAt: string;
  currentSize: number;
  maxSize: number;
}

/** Input de collecte */
export interface Input {
  inputId: string;
  title: string;
  description?: string;
  engineId: string;
  streamId: string;
  exposedPort: string;
  publicAddress: string;
  sslEnabled: boolean;
  status: "RUNNING" | "PENDING" | "DISABLED";
  createdAt: string;
}

/** Alias Elasticsearch */
export interface Alias {
  aliasId: string;
  name: string;
  description?: string;
  indexIds: string[];
  streamIds: string[];
  createdAt: string;
  updatedAt: string;
}
