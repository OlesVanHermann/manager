// ============================================================
// NETWORK SECURITY SERVICE - API IP / DDoS OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface IpInfo { ip: string; routedTo?: { serviceName: string }; type: string; mitigation: string; state: string; }
export interface Attack { id: string; ipAttack: string; type: string; startDate: string; endDate?: string; }
export interface FirewallRule { sequence: number; action: string; protocol: string; source?: string; sourcePort?: string; destination?: string; destinationPort?: string; }

export async function getIps(): Promise<string[]> { return ovhGet<string[]>("/ip"); }
export async function getIp(ipBlock: string): Promise<IpInfo> { return ovhGet<IpInfo>(`/ip/${encodeURIComponent(ipBlock)}`); }

export async function getAttacks(ipBlock: string): Promise<Attack[]> {
  const ids = await ovhGet<number[]>(`/ip/${encodeURIComponent(ipBlock)}/mitigation`).catch(() => []);
  const attacks: Attack[] = [];
  for (const id of ids) {
    const mitig = await ovhGet<{ ipOnMitigation: string; state: string }>(`/ip/${encodeURIComponent(ipBlock)}/mitigation/${id}`).catch(() => null);
    if (mitig) attacks.push({ id: String(id), ipAttack: mitig.ipOnMitigation, type: "DDoS", startDate: new Date().toISOString(), endDate: mitig.state === "ok" ? new Date().toISOString() : undefined });
  }
  return attacks;
}

export async function getFirewallRules(ipBlock: string): Promise<FirewallRule[]> {
  const ips = ipBlock.includes("/") ? [ipBlock.split("/")[0]] : [ipBlock];
  const allRules: FirewallRule[] = [];
  for (const ip of ips) {
    const sequences = await ovhGet<number[]>(`/ip/${encodeURIComponent(ipBlock)}/firewall/${ip}/rule`).catch(() => []);
    const rules = await Promise.all(sequences.map(seq => ovhGet<FirewallRule>(`/ip/${encodeURIComponent(ipBlock)}/firewall/${ip}/rule/${seq}`).catch(() => null)));
    allRules.push(...rules.filter(Boolean) as FirewallRule[]);
  }
  return allRules.sort((a, b) => a.sequence - b.sequence);
}
