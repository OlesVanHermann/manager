import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as securityService from "../../../../services/network.security";

interface FirewallRule { sequence: number; action: string; protocol: string; source?: string; sourcePort?: string; destination?: string; destinationPort?: string; }
interface FirewallTabProps { ipBlock: string; }

export default function FirewallTab({ ipBlock }: FirewallTabProps) {
  const { t } = useTranslation("network/security/index");
  const { t: tCommon } = useTranslation("common");
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadRules(); }, [ipBlock]);

  const loadRules = async () => {
    try { setLoading(true); setError(null); const data = await securityService.getFirewallRules(ipBlock); setRules(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getActionBadge = (action: string) => {
    const classes: Record<string, string> = { permit: "badge-success", deny: "badge-error" };
    return <span className={`status-badge ${classes[action] || ""}`}>{action}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadRules}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="firewall-tab">
      <div className="tab-toolbar"><h2>{t("firewall.title")}</h2><button className="btn btn-primary">{t("firewall.addRule")}</button></div>
      {rules.length === 0 ? (
        <div className="empty-state"><h2>{t("firewall.empty.title")}</h2><p>{t("firewall.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>#</th><th>{t("firewall.columns.action")}</th><th>{t("firewall.columns.protocol")}</th><th>{t("firewall.columns.source")}</th><th>{t("firewall.columns.destination")}</th><th>{t("firewall.columns.actions")}</th></tr></thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.sequence}>
                <td>{rule.sequence}</td>
                <td>{getActionBadge(rule.action)}</td>
                <td>{rule.protocol}</td>
                <td className="mono">{rule.source || "*"}:{rule.sourcePort || "*"}</td>
                <td className="mono">{rule.destination || "*"}:{rule.destinationPort || "*"}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
