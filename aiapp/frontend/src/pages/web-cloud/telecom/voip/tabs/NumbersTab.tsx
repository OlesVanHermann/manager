import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService, TelephonyNumber } from "../../../../../services/web-cloud.voip";

interface Props { billingAccount: string; }

export function NumbersTab({ billingAccount }: Props) {
  const { t } = useTranslation("web-cloud/voip/index");
  const [numbers, setNumbers] = useState<TelephonyNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await voipService.getNumbers(billingAccount); setNumbers(data); }
      finally { setLoading(false); }
    };
    load();
  }, [billingAccount]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="numbers-tab">
      <div className="tab-header"><div><h3>{t("numbers.title")}</h3></div><span className="records-count">{numbers.length}</span></div>
      {numbers.length === 0 ? (
        <div className="empty-state"><p>{t("numbers.empty")}</p></div>
      ) : (
        <div className="number-cards">
          {numbers.map(n => (
            <div key={n.serviceName} className="number-card">
              <div className="number-header">
                <h4>{n.serviceName}</h4>
                <span className={`number-type ${n.serviceType}`}>{n.serviceType}</span>
              </div>
              <div className="number-meta">
                <span>🌍 {n.country}</span>
                {n.description && <span>{n.description}</span>}
              </div>
              <div className="number-feature"><span className="feature-tag">🎯 {n.featureType}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default NumbersTab;
