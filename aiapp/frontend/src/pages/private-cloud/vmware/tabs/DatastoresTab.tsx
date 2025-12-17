import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface Datastore { filerId: number; name: string; size: number; freeSpace: number; state: string; vmTotal: number; }
interface DatastoresTabProps { serviceId: string; }

export default function DatastoresTab({ serviceId }: DatastoresTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [datastores, setDatastores] = useState<Datastore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadDatastores(); }, [serviceId]);

  const loadDatastores = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getDatastores(serviceId); setDatastores(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatSize = (gb: number) => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
  const getUsagePercent = (total: number, free: number) => Math.round(((total - free) / total) * 100);
  const getUsageClass = (percent: number) => percent >= 90 ? "danger" : percent >= 70 ? "warning" : "";

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadDatastores}>{tCommon("actions.retry")}</button></div>;
  if (datastores.length === 0) return <div className="empty-state"><h2>{t("datastores.empty.title")}</h2><p>{t("datastores.empty.description")}</p></div>;

  return (
    <div className="datastores-tab">
      <div className="tab-toolbar"><h2>{t("datastores.title")}</h2><button className="btn btn-primary">{t("datastores.add")}</button></div>
      <div className="resource-list">
        {datastores.map((ds) => {
          const usedPercent = getUsagePercent(ds.size, ds.freeSpace);
          return (
            <div key={ds.filerId} className="resource-card">
              <div className="resource-header"><span className="resource-name">{ds.name}</span><span className={`status-badge ${ds.state === "delivered" ? "badge-success" : "badge-warning"}`}>{ds.state}</span></div>
              <div className="resource-details">
                <div className="detail-item"><span className="detail-label">{t("datastores.fields.vms")}</span><span className="detail-value">{ds.vmTotal}</span></div>
                <div className="detail-item" style={{ gridColumn: "span 2" }}>
                  <span className="detail-label">{t("datastores.fields.usage")}</span>
                  <div className="usage-bar"><div className={`usage-fill ${getUsageClass(usedPercent)}`} style={{ width: `${usedPercent}%` }}></div></div>
                  <span className="usage-text">{formatSize(ds.size - ds.freeSpace)} / {formatSize(ds.size)} ({usedPercent}%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
