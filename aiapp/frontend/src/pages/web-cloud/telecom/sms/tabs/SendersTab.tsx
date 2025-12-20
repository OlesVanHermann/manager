import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { smsService, SmsSender } from "../../../../../services/web-cloud.sms";

interface Props { accountName: string; }

export function SendersTab({ accountName }: Props) {
  const { t } = useTranslation("web-cloud/sms/index");
  const [senders, setSenders] = useState<SmsSender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const names = await smsService.listSenders(accountName); const data = await Promise.all(names.map(n => smsService.getSender(accountName, n))); setSenders(data); }
      finally { setLoading(false); }
    };
    load();
  }, [accountName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="senders-tab">
      <div className="tab-header"><div><h3>{t("senders.title")}</h3></div><span className="records-count">{senders.length}</span></div>
      {senders.length === 0 ? (
        <div className="empty-state"><p>{t("senders.empty")}</p></div>
      ) : (
        <div className="sender-cards">
          {senders.map(s => (
            <div key={s.sender} className={`sender-card ${s.status === 'enable' ? 'active' : s.status === 'waitingValidation' ? 'pending' : ''}`}>
              <div className="sender-header">
                <h4>{s.sender}</h4>
                <span className={`sender-type ${s.type}`}>{s.type}</span>
              </div>
              <p className="sender-comment">{s.comment || '-'}</p>
              <span className={`badge ${s.status === 'enable' ? 'success' : s.status === 'waitingValidation' ? 'warning' : 'inactive'}`}>{s.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default SendersTab;
