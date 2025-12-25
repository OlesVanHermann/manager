import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { datastoresService, formatSize, getUsagePercent, getUsageClass } from "./DatastoresTab.ts";
import type { Datastore } from "../../vmware.types";
import "./DatastoresTab.css";
export default function DatastoresTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [datastores, setDatastores] = useState<Datastore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setDatastores(await datastoresService.getDatastores(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!datastores.length) return <div className="datastores-empty"><h2>{t("datastores.empty.title")}</h2></div>;
  return (
    <div className="datastores-tab">
      <div className="datastores-toolbar"><h2>{t("datastores.title")}</h2><button className="btn btn-primary">{t("datastores.add")}</button></div>
      <div className="datastores-list">{datastores.map((ds) => { const pct = getUsagePercent(ds.size, ds.freeSpace); return (
        <div key={ds.filerId} className="datastores-card"><div className="datastores-header"><span className="datastores-name">{ds.name}</span><span className={`status-badge ${ds.state === "delivered" ? "badge-success" : "badge-warning"}`}>{ds.state}</span></div>
          <div className="datastores-details"><div className="datastores-detail-item"><span className="datastores-detail-label">{t("datastores.fields.vms")}</span><span>{ds.vmTotal}</span></div>
            <div className="datastores-detail-item"><span className="datastores-detail-label">{t("datastores.fields.usage")}</span><div className="datastores-usage-bar"><div className={`datastores-usage-fill ${getUsageClass(pct)}`} style={{width:`${pct}%`}}/></div><span className="datastores-usage-text">{formatSize(ds.size-ds.freeSpace)} / {formatSize(ds.size)} ({pct}%)</span></div>
          </div>
        </div>); })}</div>
    </div>
  );
}
