import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { servicesService } from "./ServicesTab.service";
import type { PackService } from "../../pack-xdsl.types";
import "./ServicesTab.css";

interface Props {
  packName: string;
}

export function ServicesTab({ packName }: Props) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [services, setServices] = useState<PackService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await servicesService.getServices(packName);
        setServices(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [packName]);

  const getIcon = (type: string) => {
    const map: Record<string, string> = {
      domain: '🌐',
      email: '📧',
      voip: '📞',
      exchange: '📬'
    };
    return map[type] || '📦';
  };

  if (loading) {
    return <div className="tab-loading"><div className="skeleton-block" /></div>;
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <div>
          <h3>{t("services.title")}</h3>
        </div>
        <span className="services-records-count">{services.length}</span>
      </div>
      {services.length === 0 ? (
        <div className="services-empty">
          <p>{t("services.empty")}</p>
        </div>
      ) : (
        <div className="services-cards">
          {services.map(s => (
            <div key={s.name} className="services-card">
              <div className={`services-icon ${s.type}`}>{getIcon(s.type)}</div>
              <h4>{s.name}</h4>
              <p className="services-usage">{s.used} / {s.total} utilisé(s)</p>
              <span className="badge info">{s.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesTab;
