import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { accessService } from "./AccessTab.service";
import type { XdslAccess } from "../../pack-xdsl.types";
import "./AccessTab.css";

interface Props {
  packName: string;
}

export function AccessTab({ packName }: Props) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [accesses, setAccesses] = useState<XdslAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await accessService.getAccesses(packName);
        setAccesses(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [packName]);

  if (loading) {
    return <div className="tab-loading"><div className="skeleton-block" /></div>;
  }

  return (
    <div className="access-container">
      <div className="access-header">
        <div>
          <h3>{t("access.title")}</h3>
        </div>
      </div>
      {accesses.length === 0 ? (
        <div className="access-empty">
          <p>{t("access.empty")}</p>
        </div>
      ) : (
        accesses.map(a => (
          <div key={a.accessName} className={`access-connection-card ${a.connectionStatus === 'active' ? 'connected' : 'disconnected'}`}>
            <div className="access-connection-status">
              <div className={`access-status-indicator ${a.connectionStatus === 'active' ? 'connected' : 'disconnected'}`}>
                {a.connectionStatus === 'active' ? '🟢' : '🔴'}
              </div>
              <div className="access-connection-details">
                <h3>{a.accessName}</h3>
                <p>{a.address?.street}, {a.address?.zipCode} {a.address?.city}</p>
              </div>
            </div>
            <div className="access-ips">
              {a.ipv4 && (
                <div className="access-ip-item">
                  <label>IPv4</label>
                  <span>{a.ipv4}</span>
                </div>
              )}
              {a.ipv6 && (
                <div className="access-ip-item">
                  <label>IPv6</label>
                  <span>{a.ipv6}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AccessTab;
