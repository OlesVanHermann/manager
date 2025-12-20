import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { packXdslService, PackService } from "../../../../../services/web-cloud.pack-xdsl";

interface Props { packName: string; }

export function ServicesTab({ packName }: Props) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [services, setServices] = useState<PackService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await packXdslService.getServices(packName); setServices(data); }
      finally { setLoading(false); }
    };
    load();
  }, [packName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  const getIcon = (type: string) => { const map: Record<string, string> = { domain: '🌐', email: '📧', voip: '📞', exchange: '📬' }; return map[type] || '📦'; };

  return (
    <div className="services-tab">
      <div className="tab-header"><div><h3>{t("services.title")}</h3></div><span className="records-count">{services.length}</span></div>
      {services.length === 0 ? (
        <div className="empty-state"><p>{t("services.empty")}</p></div>
      ) : (
        <div className="service-cards">
          {services.map(s => (
            <div key={s.name} className="service-card">
              <div className={`service-icon ${s.type}`}>{getIcon(s.type)}</div>
              <h4>{s.name}</h4>
              <p className="service-usage">{s.used} / {s.total} utilisé(s)</p>
              <span className="badge info">{s.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ServicesTab;
