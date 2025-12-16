import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { telecomService, SmsSender } from "../../../../services/telecom.service";

interface Props { serviceName: string; }

export function SendersTab({ serviceName }: Props) {
  const { t } = useTranslation("telecom/sms/index");
  const [senders, setSenders] = useState<SmsSender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await telecomService.listSmsSenders(serviceName);
        const data = await Promise.all(names.map(n => telecomService.getSmsSender(serviceName, n)));
        setSenders(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="senders-tab">
      <div className="tab-header"><h3>{t("senders.title")}</h3><span className="records-count">{senders.length}</span></div>
      {senders.length === 0 ? (<div className="empty-state"><p>{t("senders.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("senders.sender")}</th><th>{t("senders.type")}</th><th>{t("senders.status")}</th><th>{t("senders.comment")}</th></tr></thead>
          <tbody>
            {senders.map(s => (
              <tr key={s.sender}>
                <td className="font-mono">{s.sender}</td>
                <td><span className="badge info">{s.type}</span></td>
                <td><span className={`badge ${s.status === 'enable' ? 'success' : s.status === 'waitingValidation' ? 'warning' : 'inactive'}`}>{s.status}</span></td>
                <td>{s.comment || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default SendersTab;
