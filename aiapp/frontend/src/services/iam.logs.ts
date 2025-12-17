// ============================================================
// IAM LOGS SERVICE - Logs Identity & Access Management
// 3 types: Access Policy, Activity, Audit
// Utilise ovhGet/ovhPost pour l'authentification automatique
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

// ============ TYPES ============

export type LogType = "access-policy" | "activity" | "audit";

export interface LogEntry {
  timestamp: string;
  message: string;
  level?: string;
  kind?: string;
  [key: string]: unknown;
}

export interface LogSubscription {
  subscriptionId: string;
  serviceName: string;
  streamId: string;
  kind: string;
  createdAt: string;
}

// ============ CONFIG PAR TYPE DE LOG ============

const LOG_CONFIGS: Record<LogType, { log: string; kind: string; subscription: string }> = {
  "access-policy": {
    log: "/engine/api/v2/iam/log/url",
    kind: "/engine/api/v2/iam/log/kind",
    subscription: "/engine/api/v2/iam/log/subscription",
  },
  activity: {
    log: "/me/api/log/url",
    kind: "/me/api/log/kind",
    subscription: "/me/api/log/subscription",
  },
  audit: {
    log: "/me/logs/audit/log/url",
    kind: "/me/logs/audit/log/kind",
    subscription: "/me/logs/audit/log/subscription",
  },
};

// ============ FONCTIONS PUBLIQUES ============

/** Récupère les types de logs disponibles */
export async function getLogKinds(logType: LogType): Promise<string[]> {
  const config = LOG_CONFIGS[logType];
  if (!config) {
    console.error(`Unknown log type: ${logType}`);
    return ["default"];
  }
  try {
    const result = await ovhGet<string[]>(config.kind);
    return result || ["default"];
  } catch (err) {
    console.error(`Error fetching log kinds for ${logType}:`, err);
    return ["default"];
  }
}

/** Récupère l'URL temporaire pour le live tail */
export async function getLogUrl(logType: LogType, kind: string = "default"): Promise<{ url: string } | null> {
  const config = LOG_CONFIGS[logType];
  if (!config) {
    console.error(`Unknown log type: ${logType}`);
    return null;
  }
  try {
    return await ovhPost<{ url: string }>(`${config.log}?kind=${encodeURIComponent(kind)}`);
  } catch (err) {
    console.error(`Error fetching log URL for ${logType}:`, err);
    return null;
  }
}

/** Récupère les logs depuis l'URL temporaire */
export async function fetchLogsFromUrl(url: string): Promise<LogEntry[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const text = await response.text();
    if (!text.trim()) return [];

    return text.trim().split("\n").filter(Boolean).map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { timestamp: new Date().toISOString(), message: line };
      }
    });
  } catch {
    return [];
  }
}

/** Récupère les souscriptions aux flux de données */
export async function getSubscriptions(logType: LogType, kind: string = "default"): Promise<LogSubscription[]> {
  const config = LOG_CONFIGS[logType];
  if (!config) return [];
  try {
    const result = await ovhGet<LogSubscription[]>(`${config.subscription}?kind=${encodeURIComponent(kind)}`);
    return result || [];
  } catch {
    return [];
  }
}

/** Supprime une souscription */
export async function deleteSubscription(logType: LogType, subscriptionId: string): Promise<void> {
  const config = LOG_CONFIGS[logType];
  if (!config) throw new Error(`Unknown log type: ${logType}`);
  await ovhDelete(`${config.subscription}/${subscriptionId}`);
}

/** Vérifie si un type de log est disponible */
export async function checkLogAvailability(logType: LogType): Promise<boolean> {
  try {
    const kinds = await getLogKinds(logType);
    return kinds.length > 0;
  } catch {
    return false;
  }
}

/** Vérifie la disponibilité de tous les types de logs */
export async function checkAllLogsAvailability(): Promise<Record<LogType, boolean>> {
  const [accessPolicy, activity, audit] = await Promise.all([
    checkLogAvailability("access-policy"),
    checkLogAvailability("activity"),
    checkLogAvailability("audit"),
  ]);
  return { "access-policy": accessPolicy, activity, audit };
}
