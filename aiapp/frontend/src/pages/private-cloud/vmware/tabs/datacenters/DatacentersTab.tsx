import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { datacentersService } from "./DatacentersTab.ts";
import type { Datacenter } from "../../vmware.types";
import "./DatacentersTab.css";
export default function DatacentersTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setDatacenters(await datacentersService.getDatacenters(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!datacenters.length) return <div className="datacenters-empty"><h2>{t("datacenters.empty.title")}</h2></div>;
  return (
    <div className="datacenters-tab">
      <div className="datacenters-toolbar"><h2>{t("datacenters.title")}</h2><button className="btn btn-primary">{t("datacenters.add")}</button></div>
      <table className="datacenters-table"><thead><tr><th>{t("datacenters.columns.name")}</th><th>{t("datacenters.columns.description")}</th><th>{t("datacenters.columns.range")}</th><th>{t("datacenters.columns.actions")}</th></tr></thead>
        <tbody>{datacenters.map((dc) => <tr key={dc.datacenterId}><td><strong>{dc.name}</strong><br/><span className="datacenters-id">ID: {dc.datacenterId}</span></td><td>{dc.description || "-"}</td><td>{dc.commercialRangeName}</td><td><button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button></td></tr>)}</tbody>
      </table>
    </div>
  );
}
