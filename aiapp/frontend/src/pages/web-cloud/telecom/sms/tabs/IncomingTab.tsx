import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { smsService, SmsIncoming } from "../../../../../services/web-cloud.sms";

interface Props { accountName: string; }

export function IncomingTab({ accountName }: Props) {
  const { t } = useTranslation("web-cloud/sms/index");
  const [messages, setMessages] = useState<SmsIncoming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const ids = await smsService.listIncoming(accountName); const data = await Promise.all(ids.slice(0, 50).map(id => smsService.getIncoming(accountName, id))); data.sort((a, b) => new Date(b.creationDatetime).getTime() - new Date(a.creationDatetime).getTime()); setMessages(data); }
      finally { setLoading(false); }
    };
    load();
  }, [accountName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="incoming-tab">
      <div className="tab-header"><div><h3>{t("incoming.title")}</h3></div><span className="records-count">{messages.length}</span></div>
      {messages.length === 0 ? (
        <div className="empty-state"><p>{t("incoming.empty")}</p></div>
      ) : (
        <div className="sms-cards">
          {messages.map(m => (
            <div key={m.id} className="sms-card incoming">
              <div className="sms-header">
                <div className="sms-parties"><span className="from">{m.sender}</span><span className="arrow">→</span><span className="to">Moi</span></div>
                <span className="sms-date">{new Date(m.creationDatetime).toLocaleString('fr-FR')}</span>
              </div>
              <div className="sms-message">{m.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default IncomingTab;
