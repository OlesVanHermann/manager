import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { datastoresService, formatSize, getUsagePercent, getUsageClass } from "./DatastoresTab.service";
import type { Datastore } from "../../vmware.types";
import "./DatastoresTab.css";

export default function DatastoresTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/datastores");
  const { t: tCommon } = useTranslation("common");

  const [datastores, setDatastores] = useState<Datastore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, [serviceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDatastores(await datastoresService.getDatastores(serviceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!datastores.length) return <div className="datastores-empty"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>;

  return (
    <div className="datastores-tab">
      <div className="datastores-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("add")}</button>
      </div>
      <div className="datastores-grid">
        {datastores.map((ds) => (
          <div key={ds.datastoreId} className="datastores-card">
            <div className="datastores-card-header">
              <strong>{ds.name}</strong>
              <span className="datastores-id">ID: {ds.datastoreId}</span>
            </div>
            <div className="datastores-card-body">
              <div className="datastores-usage">
                <div className="datastores-usage-bar">
                  <div className={`datastores-usage-fill ${getUsageClass(ds)}`} style={{ width: `${getUsagePercent(ds)}%` }}></div>
                </div>
                <span>{getUsagePercent(ds)}%</span>
              </div>
              <div className="datastores-stats">
                <span>{t("fields.usage")}: {formatSize(ds.used)} / {formatSize(ds.capacity)}</span>
                <span>{t("fields.vms")}: {ds.vmCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
