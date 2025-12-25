import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostsService, formatRam, getHostStateBadgeClass } from "./HostsTab.ts";
import type { Host } from "../../vmware.types";
import "./HostsTab.css";
export default function HostsTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setHosts(await hostsService.getHosts(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!hosts.length) return <div className="hosts-empty"><h2>{t("hosts.empty.title")}</h2></div>;
  return (
    <div className="hosts-tab">
      <div className="hosts-toolbar"><h2>{t("hosts.title")}</h2><button className="btn btn-primary">{t("hosts.add")}</button></div>
      <table className="hosts-table"><thead><tr><th>{t("hosts.columns.name")}</th><th>{t("hosts.columns.profile")}</th><th>{t("hosts.columns.cpu")}</th><th>{t("hosts.columns.ram")}</th><th>{t("hosts.columns.state")}</th><th>{t("hosts.columns.actions")}</th></tr></thead>
        <tbody>{hosts.map((h) => <tr key={h.hostId}><td><strong>{h.name}</strong></td><td>{h.profile}</td><td>{h.cpu}</td><td>{formatRam(h.ram)}</td><td><span className={`status-badge ${getHostStateBadgeClass(h.state)}`}>{h.state}</span></td><td><button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button></td></tr>)}</tbody>
      </table>
    </div>
  );
}
