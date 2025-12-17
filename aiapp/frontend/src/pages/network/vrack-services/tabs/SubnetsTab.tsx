import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vrackServicesService from "../../../../services/network.vrack-services";

interface Subnet { id: string; displayName?: string; cidr: string; serviceRange?: { cidr: string }; vlan?: number; }
interface SubnetsTabProps { serviceId: string; }

export default function SubnetsTab({ serviceId }: SubnetsTabProps) {
  const { t } = useTranslation("network/vrack-services/index");
  const { t: tCommon } = useTranslation("common");
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSubnets(); }, [serviceId]);

  const loadSubnets = async () => {
    try { setLoading(true); setError(null); const data = await vrackServicesService.getSubnets(serviceId); setSubnets(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadSubnets}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="subnets-tab">
      <div className="tab-toolbar"><h2>{t("subnets.title")}</h2><button className="btn btn-primary">{t("subnets.create")}</button></div>
      {subnets.length === 0 ? (
        <div className="empty-state"><h2>{t("subnets.empty.title")}</h2><p>{t("subnets.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("subnets.columns.name")}</th><th>{t("subnets.columns.cidr")}</th><th>{t("subnets.columns.vlan")}</th><th>{t("subnets.columns.actions")}</th></tr></thead>
          <tbody>
            {subnets.map((subnet) => (
              <tr key={subnet.id}>
                <td>{subnet.displayName || subnet.id}</td>
                <td className="mono">{subnet.cidr}</td>
                <td>{subnet.vlan ?? "-"}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
