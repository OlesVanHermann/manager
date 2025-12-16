import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService, TelephonyLine } from "../../../../services/web-cloud.voip";

interface Props { billingAccount: string; }

export function LinesTab({ billingAccount }: Props) {
  const { t } = useTranslation("web-cloud/voip/index");
  const [lines, setLines] = useState<TelephonyLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await voipService.listLines(billingAccount);
        const data = await Promise.all(names.map(n => voipService.getLine(billingAccount, n)));
        setLines(data);
      } finally { setLoading(false); }
    };
    load();
  }, [billingAccount]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="lines-tab">
      <div className="tab-header"><h3>{t("lines.title")}</h3><span className="records-count">{lines.length}</span></div>
      {lines.length === 0 ? (<div className="empty-state"><p>{t("lines.empty")}</p></div>) : (
        <div className="line-cards">
          {lines.map(line => (
            <div key={line.serviceName} className="line-card">
              <div className="line-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg></div>
              <div className="line-info">
                <h4>{line.serviceName}</h4>
                <p>{line.description || t("lines.noDescription")}</p>
                <div className="line-meta">
                  <span className={`badge ${line.serviceType === 'trunk' ? 'info' : 'success'}`}>{line.serviceType}</span>
                  <span>{line.simultaneousLines} {t("lines.simultaneous")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default LinesTab;
