// ============================================================
// LOGS TAB SERVICE - API calls for LogsTab
// (from old_manager hosting-statistics.service.js)
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { Hosting, OwnLog, UserLogs } from "../../hosting.types";

const BASE = "/hosting/web";

export const logsService = {
  // --- Hosting ---
  getHosting: (sn: string) =>
    ovhGet<Hosting>(`${BASE}/${sn}`),

  // --- Own Logs with fqdn filter (from old_manager getLogs) ---
  // Returns list of ownLog IDs for a domain
  listOwnLogs: (sn: string, fqdn?: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/ownLogs`, {
      params: fqdn ? { fqdn } : undefined,
    } as any).catch(() => []),

  getOwnLog: (sn: string, id: number) =>
    ovhGet<OwnLog>(`${BASE}/${sn}/ownLogs/${id}`),

  // Get logs for a specific domain (from old_manager getLogs)
  getLogsForDomain: async (sn: string, attachedDomain?: string) => {
    const fqdn = attachedDomain || sn;
    const ids = await logsService.listOwnLogs(sn, fqdn);
    if (ids.length === 0) return null;
    return ovhGet<OwnLog>(`${BASE}/${sn}/ownLogs/${ids[0]}`);
  },

  // --- User Logs under ownLogs (from old_manager - nested path) ---
  listUserLogsForOwnLog: (sn: string, ownLogId: number) =>
    ovhGet<string[]>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs`),

  getUserLogsEntry: (sn: string, ownLogId: number, login: string) =>
    ovhGet<UserLogs>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}`),

  createUserLogsForOwnLog: (sn: string, ownLogId: number, data: {
    description: string;
    login: string;
    password: string;
  }) =>
    ovhPost<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs`, data),

  deleteUserLogsForOwnLog: (sn: string, ownLogId: number, login: string) =>
    ovhDelete<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}`),

  changeUserLogsPasswordForOwnLog: (sn: string, ownLogId: number, login: string, password: string) =>
    ovhPost<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}/changePassword`, { password }),

  // Update user logs entry (from old_manager - MANQUANT)
  updateUserLogsForOwnLog: (sn: string, ownLogId: number, login: string, data: { description?: string }) =>
    ovhPut<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}`, data),

  // --- Legacy userLogs path (for backward compatibility) ---
  listUserLogs: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/userLogs`).catch(() => []),

  getUserLogs: (sn: string, login: string) =>
    ovhGet<UserLogs>(`${BASE}/${sn}/userLogs/${login}`),

  createUserLogs: (sn: string, data: { login: string; password: string; description?: string }) =>
    ovhPost<void>(`${BASE}/${sn}/userLogs`, data),

  deleteUserLogs: (sn: string, login: string) =>
    ovhDelete<void>(`${BASE}/${sn}/userLogs/${login}`),

  changeUserLogsPassword: (sn: string, login: string, password: string) =>
    ovhPost<void>(`${BASE}/${sn}/userLogs/${login}/changePassword`, { password }),

  // --- Logs Token (for direct access) ---
  getUserLogsToken: (sn: string, params?: { remoteCheck?: boolean; ttl?: number }) =>
    ovhGet<string>(`${BASE}/${sn}/userLogsToken`, {
      params: params || undefined,
    } as any),

  // --- Metrics token (for statistics graphs) ---
  getMetricsToken: (sn: string) =>
    ovhGet<{ token: string; warpUrl: string }>(`${BASE}/${sn}/metricsToken`).catch(() => null),

  // ============ STATISTICS CONSTANTS (from old_manager hosting-statistics.service.js) ============

  getStatisticsConstants: () => ({
    types: [
      { label: "IN_FTP_COMMANDS", isDefault: false },
      { label: "IN_HTTP_HITS", isDefault: true },
      { label: "IN_HTTP_MEAN_RESPONSE_TIME", isDefault: false },
      { label: "OUT_TCP_CONN", isDefault: false },
      { label: "SYS_CPU_USAGE", isDefault: false },
      { label: "SYS_WORKER_SPAWN_OVERLOAD", isDefault: false },
    ],
    dbTypes: [{ label: "STATEMENT" }, { label: "STATEMENT_MEAN_TIME" }],
    periods: [
      { label: "DAILY", value: "1d", step: "15m", rawStep: 15, timeRange: -24 * 60 * 60 * 1000 },
      { label: "WEEKLY", value: "7d", step: "15m", rawStep: 15, timeRange: -7 * 24 * 60 * 60 * 1000, isDefault: true },
      { label: "MONTHLY", value: "30d", step: "15m", rawStep: 15, timeRange: -30 * 24 * 60 * 60 * 1000 },
      { label: "YEARLY", value: "365d", step: "60m", rawStep: 60, timeRange: -365 * 24 * 60 * 60 * 1000 },
    ],
    aggregateModes: ["ALL", "HTTP_CODE"],
    defaultAggregateMode: "HTTP_CODE",
    colors: {
      "2xx": { bg: "rgba(234,247,255, .4)", border: "#00748E" },
      "3xx": { bg: "rgba(0,106,130, .4)", border: "#006A82" },
      "4xx": { bg: "rgba(244,186,77, .4)", border: "#F4BA4D" },
      "5xx": { bg: "rgba(218,59,58, .4)", border: "#DA3B3A" },
      IOK: { bg: "rgba(234,247,255, .4)", border: "#00748E" },
      upl: { bg: "rgba(0,106,130, .4)", border: "#006A82" },
      dwl: { bg: "rgba(244,186,77, .4)", border: "#F4BA4D" },
      IKO: { bg: "rgba(218,59,58, .4)", border: "#DA3B3A" },
      base: { bg: "rgba(234,247,255, .4)", border: "#A2D9FF" },
      dynamic: { bg: "rgba(248,233,239, .4)", border: "#B92463" },
      static: { bg: "rgba(233,248,244, .4)", border: "#24B994" },
    },
  }),

  // Generate Prometheus query (from old_manager)
  getPrometheusQuery: (type: string, serviceName: string, step: string, rawStep: number): string => {
    const queries: Record<string, string> = {
      IN_FTP_COMMANDS: `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (sum_over_time(aggregator_stats_in_ftpComm_value{service_name="${serviceName}"}[${step}]))`,
      IN_HTTP_HITS: `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace(sum_over_time(aggregator_stats_in_httpHits_value{service_name="${serviceName}"}[${step}]),"status_code","\${1}xx","statusCode","([0-9])..")) / ${rawStep}`,
      IN_HTTP_MEAN_RESPONSE_TIME: `avg_over_time(aggregator_stats_in_httpMeanResponseTime_value{service_name="${serviceName}"}[${step}])`,
      OUT_TCP_CONN: `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (sum_over_time(aggregator_stats_out_tcpConn_value{service_name="${serviceName}"}[${step}]))`,
      SYS_CPU_USAGE: `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace(sum_over_time((aggregator_stats_cgroupCpuUsage_value{service_name="${serviceName}"}[${step}])), "usage", "cpu", "", ""))`,
      SYS_WORKER_SPAWN_OVERLOAD: `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace(sum_over_time((aggregator_stats_spawnOvercharge_value{service_name="${serviceName}"}[${step}])), "overload", "php", "", ""))`,
    };
    return queries[type] || "";
  },
};

export default logsService;
