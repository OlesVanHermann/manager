import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { packXdslService, XdslAccess } from "../../../../../services/web-cloud.pack-xdsl";

interface Props { packName: string; }

export function AccessTab({ packName }: Props) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [accesses, setAccesses] = useState<XdslAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await packXdslService.getAccesses(packName); setAccesses(data); }
      finally { setLoading(false); }
    };
    load();
  }, [packName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="access-tab">
      <div className="tab-header"><div><h3>{t("access.title")}</h3></div></div>
      {accesses.length === 0 ? (
        <div className="empty-state"><p>{t("access.empty")}</p></div>
      ) : (
        accesses.map(a => (
          <div key={a.accessName} className={`connection-card ${a.connectionStatus === 'active' ? 'connected' : 'disconnected'}`}>
            <div className="connection-status">
              <div className={`status-indicator ${a.connectionStatus === 'active' ? 'connected' : 'disconnected'}`}>{a.connectionStatus === 'active' ? '🟢' : '🔴'}</div>
              <div className="connection-details">
                <h3>{a.accessName}</h3>
                <p>{a.address?.street}, {a.address?.zipCode} {a.address?.city}</p>
              </div>
            </div>
            <div className="access-ips">
              {a.ipv4 && <div className="ip-item"><label>IPv4</label><span>{a.ipv4}</span></div>}
              {a.ipv6 && <div className="ip-item"><label>IPv6</label><span>{a.ipv6}</span></div>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
export default AccessTab;
