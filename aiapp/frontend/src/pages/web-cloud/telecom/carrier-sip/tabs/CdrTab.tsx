import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { carrierSipService, CdrRecord } from "../../../../../services/web-cloud.carrier-sip";

interface Props { billingAccount: string; serviceName: string; }

export function CdrTab({ billingAccount, serviceName }: Props) {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const [records, setRecords] = useState<CdrRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await carrierSipService.getCdr(billingAccount, serviceName); data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); setRecords(data); }
      finally { setLoading(false); }
    };
    load();
  }, [billingAccount, serviceName]);

  const formatDuration = (seconds: number) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s.toString().padStart(2, '0')}`; };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="cdr-tab">
      <div className="tab-header"><div><h3>{t("cdr.title")}</h3><p className="tab-description">{t("cdr.description")}</p></div><span className="records-count">{records.length}</span></div>
      <div className="telecom-stats">
        <div className="stat-card sip"><div className="stat-value">{records.length}</div><div className="stat-label">Appels</div></div>
        <div className="stat-card sip"><div className="stat-value">{records.filter(r => r.status === 'answered').length}</div><div className="stat-label">Répondus</div></div>
      </div>
      {records.length === 0 ? (
        <div className="empty-state"><p>{t("cdr.empty")}</p></div>
      ) : (
        <table className="data-table cdr-table">
          <thead><tr><th>{t("cdr.caller")}</th><th>{t("cdr.callee")}</th><th>{t("cdr.duration")}</th><th>{t("cdr.date")}</th><th>{t("cdr.status")}</th></tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td className="font-mono">{r.caller}</td>
                <td className="font-mono">{r.callee}</td>
                <td className="cdr-duration">{formatDuration(r.duration)}</td>
                <td>{new Date(r.startDate).toLocaleString('fr-FR')}</td>
                <td><span className={`cdr-status ${r.status}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default CdrTab;
