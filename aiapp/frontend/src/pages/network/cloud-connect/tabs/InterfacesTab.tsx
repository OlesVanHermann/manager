import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as cloudConnectService from "../../../../services/network.cloud-connect";

interface Interface { id: number; status: string; lightStatus: string; }
interface InterfacesTabProps { serviceId: string; }

export default function InterfacesTab({ serviceId }: InterfacesTabProps) {
  const { t } = useTranslation("network/cloud-connect/index");
  const { t: tCommon } = useTranslation("common");
  const [interfaces, setInterfaces] = useState<Interface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadInterfaces(); }, [serviceId]);

  const loadInterfaces = async () => {
    try { setLoading(true); setError(null); const data = await cloudConnectService.getInterfaces(serviceId); setInterfaces(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { enabled: "badge-success", disabled: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  const getLightStatus = (status: string) => {
    const colors: Record<string, string> = { up: "🟢", down: "🔴", unknown: "⚪" };
    return <span>{colors[status] || "⚪"} {status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadInterfaces}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="interfaces-tab">
      <div className="tab-toolbar"><h2>{t("interfaces.title")}</h2></div>
      {interfaces.length === 0 ? (
        <div className="empty-state"><h2>{t("interfaces.empty.title")}</h2></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("interfaces.columns.id")}</th><th>{t("interfaces.columns.status")}</th><th>{t("interfaces.columns.light")}</th><th>{t("interfaces.columns.actions")}</th></tr></thead>
          <tbody>
            {interfaces.map((iface) => (
              <tr key={iface.id}>
                <td>Interface #{iface.id}</td>
                <td>{getStatusBadge(iface.status)}</td>
                <td>{getLightStatus(iface.lightStatus)}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline">{t("interfaces.actions.statistics")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
