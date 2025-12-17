import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as packXdslService from "../../../../services/web-cloud.pack-xdsl";

interface PackService { name: string; type: string; domain?: string; used: number; total: number; }
interface ServicesTabProps { serviceId: string; }

export default function ServicesTab({ serviceId }: ServicesTabProps) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const { t: tCommon } = useTranslation("common");
  const [services, setServices] = useState<PackService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadServices(); }, [serviceId]);

  const loadServices = async () => {
    try { setLoading(true); setError(null); const data = await packXdslService.getServices(serviceId); setServices(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = { domain: "🌍", email: "📧", hosting: "🏠", voip: "📞", exchangeAccount: "📬" };
    return icons[type] || "📦";
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadServices}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="services-tab">
      <div className="tab-toolbar"><h2>{t("services.title")}</h2></div>
      {services.length === 0 ? (
        <div className="empty-state"><h2>{t("services.empty.title")}</h2></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("services.columns.type")}</th><th>{t("services.columns.name")}</th><th>{t("services.columns.usage")}</th><th>{t("services.columns.actions")}</th></tr></thead>
          <tbody>
            {services.map((service, idx) => (
              <tr key={idx}>
                <td><span style={{ marginRight: "var(--space-2)" }}>{getTypeIcon(service.type)}</span>{t(`services.types.${service.type}`)}</td>
                <td>{service.domain || service.name}</td>
                <td>{service.used} / {service.total}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
