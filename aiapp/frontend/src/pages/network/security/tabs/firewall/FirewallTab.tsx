// ============================================================
// SECURITY Firewall Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .security-firewall-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { SecurityFirewallRule } from "../../security.types";
import { securityFirewallService } from "./FirewallTab.service";
import "./FirewallTab.css";

interface FirewallTabProps {
  ipBlock: string;
}

export default function FirewallTab({ ipBlock }: FirewallTabProps) {
  const { t } = useTranslation("network/security/firewall");
  const { t: tCommon } = useTranslation("common");
  const [rules, setRules] = useState<SecurityFirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRules();
  }, [ipBlock]);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await securityFirewallService.getFirewallRules(ipBlock);
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="security-firewall-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="security-firewall-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadRules}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="security-firewall-tab">
      <div className="security-firewall-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("addRule")}</button>
      </div>

      {rules.length === 0 ? (
        <div className="security-firewall-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="security-firewall-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("columns.action")}</th>
              <th>{t("columns.protocol")}</th>
              <th>{t("columns.source")}</th>
              <th>{t("columns.destination")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.sequence}>
                <td className="security-firewall-sequence">{rule.sequence}</td>
                <td>
                  <span
                    className={`security-firewall-status-badge ${securityFirewallService.getActionBadgeClass(rule.action)}`}
                  >
                    {rule.action}
                  </span>
                </td>
                <td>{rule.protocol}</td>
                <td className="security-firewall-address">
                  {rule.source || "*"}:{rule.sourcePort || "*"}
                </td>
                <td className="security-firewall-address">
                  {rule.destination || "*"}:{rule.destinationPort || "*"}
                </td>
                <td>
                  <div className="security-firewall-actions">
                    <button className="btn btn-sm btn-outline btn-danger">
                      {tCommon("actions.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
