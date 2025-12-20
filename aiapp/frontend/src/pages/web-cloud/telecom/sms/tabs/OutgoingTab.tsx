import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { smsService, SmsOutgoing } from "../../../../../services/web-cloud.sms";

interface Props { accountName: string; }

export function OutgoingTab({ accountName }: Props) {
  const { t } = useTranslation("web-cloud/sms/index");
  const [messages, setMessages] = useState<SmsOutgoing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const ids = await smsService.listOutgoing(accountName); const data = await Promise.all(ids.slice(0, 50).map(id => smsService.getOutgoing(accountName, id))); data.sort((a, b) => new Date(b.creationDatetime).getTime() - new Date(a.creationDatetime).getTime()); setMessages(data); }
      finally { setLoading(false); }
    };
    load();
  }, [accountName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="outgoing-tab">
      <div className="tab-header"><div><h3>{t("outgoing.title")}</h3></div><span className="records-count">{messages.length}</span></div>
      <div className="telecom-stats">
        <div className="stat-card sms"><div className="stat-value">{messages.length}</div><div className="stat-label">Envoyés</div></div>
        <div className="stat-card sms"><div className="stat-value">{messages.reduce((s, m) => s + m.credits, 0)}</div><div className="stat-label">Crédits</div></div>
      </div>
      {messages.length === 0 ? (
        <div className="empty-state"><p>{t("outgoing.empty")}</p></div>
      ) : (
        <div className="sms-cards">
          {messages.map(m => (
            <div key={m.id} className="sms-card outgoing">
              <div className="sms-header">
                <div className="sms-parties"><span className="from">{m.sender}</span><span className="arrow">→</span><span className="to">{m.receiver}</span></div>
                <span className="sms-date">{new Date(m.creationDatetime).toLocaleString('fr-FR')}</span>
              </div>
              <div className="sms-message">{m.message}</div>
              <div className="sms-meta"><span>{m.credits} crédit(s)</span><span>{m.numberOfSms} SMS</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default OutgoingTab;
