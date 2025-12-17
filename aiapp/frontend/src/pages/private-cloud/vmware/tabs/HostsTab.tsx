import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface Host { hostId: number; name: string; state: string; profile: string; cpu: string; ram: number; connectionState: string; }
interface HostsTabProps { serviceId: string; }

export default function HostsTab({ serviceId }: HostsTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadHosts(); }, [serviceId]);

  const loadHosts = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getHosts(serviceId); setHosts(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatRam = (gb: number) => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
  const getStateBadge = (state: string) => {
    const classes: Record<string, string> = { delivered: "badge-success", toDeliver: "badge-warning", error: "badge-error" };
    return <span className={`status-badge ${classes[state] || ""}`}>{state}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadHosts}>{tCommon("actions.retry")}</button></div>;
  if (hosts.length === 0) return <div className="empty-state"><h2>{t("hosts.empty.title")}</h2><p>{t("hosts.empty.description")}</p></div>;

  return (
    <div className="hosts-tab">
      <div className="tab-toolbar"><h2>{t("hosts.title")}</h2><button className="btn btn-primary">{t("hosts.add")}</button></div>
      <table className="data-table">
        <thead><tr><th>{t("hosts.columns.name")}</th><th>{t("hosts.columns.profile")}</th><th>{t("hosts.columns.cpu")}</th><th>{t("hosts.columns.ram")}</th><th>{t("hosts.columns.state")}</th><th>{t("hosts.columns.actions")}</th></tr></thead>
        <tbody>
          {hosts.map((host) => (
            <tr key={host.hostId}>
              <td><strong>{host.name}</strong></td>
              <td>{host.profile}</td>
              <td>{host.cpu}</td>
              <td>{formatRam(host.ram)}</td>
              <td>{getStateBadge(host.state)}</td>
              <td className="item-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button><button className="btn btn-sm btn-outline btn-danger">{t("hosts.remove")}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
