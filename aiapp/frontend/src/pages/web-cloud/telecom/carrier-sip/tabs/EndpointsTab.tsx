import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { carrierSipService, Endpoint } from "../../../../../services/web-cloud.carrier-sip";

interface Props { billingAccount: string; serviceName: string; }

export function EndpointsTab({ billingAccount, serviceName }: Props) {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await carrierSipService.getEndpoints(billingAccount, serviceName); setEndpoints(data); }
      finally { setLoading(false); }
    };
    load();
  }, [billingAccount, serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="endpoints-tab">
      <div className="tab-header"><div><h3>{t("endpoints.title")}</h3><p className="tab-description">{t("endpoints.description")}</p></div></div>
      {endpoints.length === 0 ? (
        <div className="empty-state"><p>{t("endpoints.empty")}</p></div>
      ) : (
        <div className="endpoint-cards">
          {endpoints.map(e => (
            <div key={e.id} className={`endpoint-card ${e.status === 'active' ? 'active' : ''}`}>
              <div className="endpoint-header">
                <h4>{e.ip}</h4>
                <span className={`badge ${e.status === 'active' ? 'success' : 'inactive'}`}>{e.status}</span>
              </div>
              <div className="endpoint-info">
                <label>{t("endpoints.priority")}</label><span>{e.priority}</span>
                <label>{t("endpoints.weight")}</label><span>{e.weight}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default EndpointsTab;
