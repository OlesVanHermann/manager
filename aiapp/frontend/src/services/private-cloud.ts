// ============================================================
// PRIVATE CLOUD SERVICE - Dashboard counts
// ============================================================

import { ovhGet } from "./api";

export interface ServiceCount { type: string; count: number; icon: string; }

export async function getServiceCounts(): Promise<ServiceCount[]> {
  const [vmware, nutanix, managedBaremetal, veeam] = await Promise.all([
    ovhGet<string[]>("/dedicatedCloud").catch(() => []),
    ovhGet<string[]>("/nutanix").catch(() => []),
    ovhGet<string[]>("/dedicatedCloud").catch(() => []), // Managed Baremetal uses same API
    ovhGet<string[]>("/veeam/veeamEnterprise").catch(() => []),
  ]);
  return [
    { type: "vmware", count: vmware.length, icon: "🖥️" },
    { type: "nutanix", count: nutanix.length, icon: "🔷" },
    { type: "managedBaremetal", count: 0, icon: "🏗️" }, // Placeholder
    { type: "sap", count: 0, icon: "💎" }, // SAP specific API
    { type: "veeam", count: veeam.length, icon: "💾" },
  ];
}
