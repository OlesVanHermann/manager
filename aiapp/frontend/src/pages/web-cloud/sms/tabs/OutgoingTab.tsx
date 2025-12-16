import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { smsService, SmsOutgoing } from "../../../../services/web-cloud.sms";

interface Props { serviceName: string; }

export function OutgoingTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/sms/index");
  const [messages, setMessages] = useState<SmsOutgoing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await smsService.listSmsOutgoing(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => smsService.getSmsOutgoing(serviceName, id)));
        data.sort((a, b) => new Date(b.creationDatetime).getTime() - new Date(a.creationDatetime).getTime());
        setMessages(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="outgoing-tab">
      <div className="tab-header"><h3>{t("outgoing.title")}</h3><span className="records-count">{messages.length}</span></div>
      {messages.length === 0 ? (<div className="empty-state"><p>{t("outgoing.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("outgoing.date")}</th><th>{t("outgoing.sender")}</th><th>{t("outgoing.receiver")}</th><th>{t("outgoing.message")}</th><th>{t("outgoing.credits")}</th></tr></thead>
          <tbody>
            {messages.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.creationDatetime).toLocaleString()}</td>
                <td className="font-mono">{m.sender}</td>
                <td className="font-mono">{m.receiver}</td>
                <td className="message-cell">{m.message.slice(0, 50)}{m.message.length > 50 ? '...' : ''}</td>
                <td>{m.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default OutgoingTab;
