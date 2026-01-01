// ============================================================
// AUDIT SERVICE - Service API isolé pour l'onglet Audit
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { LogEntry, LogSubscription } from "../../logs.types";

// ============================================================
// CONFIG
// ============================================================

const LOG_CONFIG = {
  log: "/me/logs/audit/log/url",
  kind: "/me/logs/audit/log/kind",
  subscription: "/me/logs/audit/log/subscription",
};

// ============================================================
// API FUNCTIONS
// ============================================================

/** Récupère les types de logs disponibles. */
export async function getLogKinds(): Promise<string[]> {
  try {
    const result = await ovhGet<string[]>(LOG_CONFIG.kind);
    return result || ["default"];
  } catch (err) {
    return ["default"];
  }
}

/** Récupère l'URL temporaire pour le live tail. */
export async function getLogUrl(kind: string = "default"): Promise<{ url: string } | null> {
  try {
    return await ovhPost<{ url: string }>(`${LOG_CONFIG.log}?kind=${encodeURIComponent(kind)}`);
  } catch (err) {
    return null;
  }
}

/** Récupère les logs depuis l'URL temporaire. */
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

/** Récupère les souscriptions aux flux de données. */
export async function getSubscriptions(kind: string = "default"): Promise<LogSubscription[]> {
  try {
    const result = await ovhGet<LogSubscription[]>(`${LOG_CONFIG.subscription}?kind=${encodeURIComponent(kind)}`);
    return result || [];
  } catch {
    return [];
  }
}

/** Supprime une souscription. */
export async function deleteSubscription(subscriptionId: string): Promise<void> {
  await ovhDelete(`${LOG_CONFIG.subscription}/${subscriptionId}`);
}
