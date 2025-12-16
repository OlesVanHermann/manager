import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { telecomService, SmsIncoming } from "../../../../services/telecom.service";

interface Props { serviceName: string; }

export function IncomingTab({ serviceName }: Props) {
  const { t } = useTranslation("telecom/sms/index");
  const [messages, setMessages] = useState<SmsIncoming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await telecomService.listSmsIncoming(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => telecomService.getSmsIncoming(serviceName, id)));
        data.sort((a, b) => new Date(b.creationDatetime).getTime() - new Date(a.creationDatetime).getTime());
        setMessages(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="incoming-tab">
      <div className="tab-header"><h3>{t("incoming.title")}</h3><span className="records-count">{messages.length}</span></div>
      {messages.length === 0 ? (<div className="empty-state"><p>{t("incoming.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("incoming.date")}</th><th>{t("incoming.sender")}</th><th>{t("incoming.message")}</th><th>{t("incoming.credits")}</th></tr></thead>
          <tbody>
            {messages.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.creationDatetime).toLocaleString()}</td>
                <td className="font-mono">{m.sender}</td>
                <td className="message-cell">{m.message.slice(0, 80)}{m.message.length > 80 ? '...' : ''}</td>
                <td>{m.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default IncomingTab;
