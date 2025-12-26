// ============================================================
// SECURITY Firewall Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { SecurityFirewallRule } from "../../security.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getActionBadgeClass(action: string): string {
  const classes: Record<string, string> = {
    permit: "security-firewall-badge-success",
    deny: "security-firewall-badge-error",
  };
  return classes[action] || "";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// ==================== API CALLS ====================

async function getFirewallRules(ipBlock: string): Promise<SecurityFirewallRule[]> {
  const ips = ipBlock.includes("/") ? [ipBlock.split("/")[0]] : [ipBlock];
  const allRules: SecurityFirewallRule[] = [];

  for (const ip of ips) {
    const sequences = await ovhGet<number[]>(
      `/ip/${encodeURIComponent(ipBlock)}/firewall/${ip}/rule`
    ).catch(() => []);

    const rules = await Promise.all(
      sequences.map((seq) =>
        ovhGet<SecurityFirewallRule>(
          `/ip/${encodeURIComponent(ipBlock)}/firewall/${ip}/rule/${seq}`
        ).catch(() => null)
      )
    );
    allRules.push(...(rules.filter(Boolean) as SecurityFirewallRule[]));
  }
  return allRules.sort((a, b) => a.sequence - b.sequence);
}

async function addRule(
  ipBlock: string,
  ipOnFirewall: string,
  rule: Partial<SecurityFirewallRule>
): Promise<void> {
  return ovhPost<void>(
    `/ip/${encodeURIComponent(ipBlock)}/firewall/${ipOnFirewall}/rule`,
    rule
  );
}

async function deleteRule(
  ipBlock: string,
  ipOnFirewall: string,
  sequence: number
): Promise<void> {
  return ovhDelete<void>(
    `/ip/${encodeURIComponent(ipBlock)}/firewall/${ipOnFirewall}/rule/${sequence}`
  );
}

// ==================== SERVICE OBJECT ====================

export const securityFirewallService = {
  getFirewallRules,
  addRule,
  deleteRule,
  getActionBadgeClass,
  formatDate,
};
