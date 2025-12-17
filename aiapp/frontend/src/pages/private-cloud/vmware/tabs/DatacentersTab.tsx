import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface Datacenter { datacenterId: number; name: string; description?: string; commercialName: string; commercialRangeName: string; }
interface DatacentersTabProps { serviceId: string; }

export default function DatacentersTab({ serviceId }: DatacentersTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadDatacenters(); }, [serviceId]);

  const loadDatacenters = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getDatacenters(serviceId); setDatacenters(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadDatacenters}>{tCommon("actions.retry")}</button></div>;
  if (datacenters.length === 0) return <div className="empty-state"><h2>{t("datacenters.empty.title")}</h2><p>{t("datacenters.empty.description")}</p></div>;

  return (
    <div className="datacenters-tab">
      <div className="tab-toolbar"><h2>{t("datacenters.title")}</h2><button className="btn btn-primary">{t("datacenters.add")}</button></div>
      <table className="data-table">
        <thead><tr><th>{t("datacenters.columns.name")}</th><th>{t("datacenters.columns.description")}</th><th>{t("datacenters.columns.range")}</th><th>{t("datacenters.columns.actions")}</th></tr></thead>
        <tbody>
          {datacenters.map((dc) => (
            <tr key={dc.datacenterId}>
              <td><strong>{dc.name}</strong><br/><span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>ID: {dc.datacenterId}</span></td>
              <td>{dc.description || "-"}</td>
              <td>{dc.commercialRangeName}</td>
              <td className="item-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
