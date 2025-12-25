import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { SecurityFirewallRule } from "../../security.types";
import { firewallService } from "./FirewallTab";
import "./FirewallTab.css";

interface FirewallTabProps { ipBlock: string; }

export default function FirewallTab({ ipBlock }: FirewallTabProps) {
  const { t } = useTranslation("network/security/index");
  const { t: tCommon } = useTranslation("common");
  const [rules, setRules] = useState<SecurityFirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadRules(); }, [ipBlock]);

  const loadRules = async () => {
    try { setLoading(true); setError(null); const data = await firewallService.getFirewallRules(ipBlock); setRules(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="firewall-loading">{tCommon("loading")}</div>;
  if (error) return <div className="firewall-error"><p>{error}</p><button className="btn btn-primary" onClick={loadRules}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="firewall-tab">
      <div className="firewall-toolbar"><h2>{t("firewall.title")}</h2><button className="btn btn-primary">{t("firewall.addRule")}</button></div>
      {rules.length === 0 ? (
        <div className="firewall-empty"><h2>{t("firewall.empty.title")}</h2><p>{t("firewall.empty.description")}</p></div>
      ) : (
        <table className="firewall-table">
          <thead><tr><th>#</th><th>{t("firewall.columns.action")}</th><th>{t("firewall.columns.protocol")}</th><th>{t("firewall.columns.source")}</th><th>{t("firewall.columns.destination")}</th><th>{t("firewall.columns.actions")}</th></tr></thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.sequence}>
                <td className="firewall-sequence">{rule.sequence}</td>
                <td><span className={`firewall-status-badge ${firewallService.getActionBadgeClass(rule.action)}`}>{rule.action}</span></td>
                <td>{rule.protocol}</td>
                <td className="firewall-address">{rule.source || "*"}:{rule.sourcePort || "*"}</td>
                <td className="firewall-address">{rule.destination || "*"}:{rule.destinationPort || "*"}</td>
                <td><div className="firewall-actions"><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
