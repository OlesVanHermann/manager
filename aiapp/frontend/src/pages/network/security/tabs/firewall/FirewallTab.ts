// ============================================================
// SECURITY Firewall Tab - Service isolé
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { SecurityFirewallRule } from "../../security.types";

export async function getFirewallRules(ipBlock: string): Promise<SecurityFirewallRule[]> {
  const ips = ipBlock.includes("/") ? [ipBlock.split("/")[0]] : [ipBlock];
  const allRules: SecurityFirewallRule[] = [];
  for (const ip of ips) {
    const sequences = await ovhGet<number[]>(`/ip/${encodeURIComponent(ipBlock)}/firewall/${ip}/rule`).catch(() => []);
    const rules = await Promise.all(sequences.map(seq => ovhGet<SecurityFirewallRule>(`/ip/${encodeURIComponent(ipBlock)}/firewall/${ip}/rule/${seq}`).catch(() => null)));
    allRules.push(...rules.filter(Boolean) as SecurityFirewallRule[]);
  }
  return allRules.sort((a, b) => a.sequence - b.sequence);
}

export async function addRule(ipBlock: string, ipOnFirewall: string, rule: Partial<SecurityFirewallRule>): Promise<void> {
  return ovhPost<void>(`/ip/${encodeURIComponent(ipBlock)}/firewall/${ipOnFirewall}/rule`, rule);
}

export async function deleteRule(ipBlock: string, ipOnFirewall: string, sequence: number): Promise<void> {
  return ovhDelete<void>(`/ip/${encodeURIComponent(ipBlock)}/firewall/${ipOnFirewall}/rule/${sequence}`);
}

export function getActionBadgeClass(action: string): string {
  const classes: Record<string, string> = { permit: "badge-success", deny: "badge-error" };
  return classes[action] || "";
}

export const firewallService = { getFirewallRules, addRule, deleteRule, getActionBadgeClass };
