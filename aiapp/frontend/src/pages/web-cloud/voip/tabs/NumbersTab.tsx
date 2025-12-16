import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService, TelephonyNumber } from "../../../../services/web-cloud.voip";

interface Props { billingAccount: string; }

export function NumbersTab({ billingAccount }: Props) {
  const { t } = useTranslation("web-cloud/voip/index");
  const [numbers, setNumbers] = useState<TelephonyNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await voipService.listNumbers(billingAccount);
        const data = await Promise.all(names.map(n => voipService.getNumber(billingAccount, n)));
        setNumbers(data);
      } finally { setLoading(false); }
    };
    load();
  }, [billingAccount]);

  const getFeatureBadge = (feature: string) => {
    const colors: Record<string, string> = { conference: 'info', fax: 'warning', voicemail: 'success', redirect: 'secondary', empty: 'inactive' };
    return <span className={`badge ${colors[feature] || 'inactive'}`}>{feature}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="numbers-tab">
      <div className="tab-header"><h3>{t("numbers.title")}</h3><span className="records-count">{numbers.length}</span></div>
      {numbers.length === 0 ? (<div className="empty-state"><p>{t("numbers.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("numbers.number")}</th><th>{t("numbers.type")}</th><th>{t("numbers.feature")}</th><th>{t("numbers.country")}</th><th>{t("numbers.description")}</th></tr></thead>
          <tbody>
            {numbers.map(num => (
              <tr key={num.serviceName}>
                <td className="font-mono">{num.serviceName}</td>
                <td><span className={`badge ${num.serviceType === 'alias' ? 'info' : 'success'}`}>{num.serviceType}</span></td>
                <td>{getFeatureBadge(num.featureType)}</td>
                <td>{num.country}</td>
                <td>{num.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default NumbersTab;
