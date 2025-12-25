import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { servicesService } from "./ServicesTab";
import "./ServicesTab.css";

interface Props { serviceName: string; }

export function ServicesTab({ serviceName }: Props) {
  const { t } = useTranslation("network/vrack/index");
  const [services, setServices] = useState<{ type: string; items: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const list = await servicesService.getAllServices(serviceName); setServices(list); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      dedicatedServer: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3" /></svg>,
      cloudProject: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>,
      loadBalancer: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    };
    return icons[type] || null;
  };

  if (loading) return <div className="services-loading"><div className="skeleton-block" /></div>;

  const totalServices = services.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="services-tab">
      <div className="services-header"><h3>{t("services.title")}</h3><span className="services-count">{totalServices}</span></div>
      {services.length === 0 ? (<div className="services-empty"><p>{t("services.empty")}</p></div>) : (
        <div className="services-groups">
          {services.map(group => (
            <div key={group.type} className="services-group">
              <div className="services-group-header"><div className="services-group-icon">{getTypeIcon(group.type)}</div><h4>{t(`services.types.${group.type}`)}</h4><span className="services-group-badge">{group.items.length}</span></div>
              <div className="services-group-items">{group.items.map(item => <div key={item} className="services-item">{item}</div>)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ServicesTab;
