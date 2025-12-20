import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService, TelephonyLine } from "../../../../../services/web-cloud.voip";

interface Props { billingAccount: string; }

export function LinesTab({ billingAccount }: Props) {
  const { t } = useTranslation("web-cloud/voip/index");
  const [lines, setLines] = useState<TelephonyLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await voipService.getLines(billingAccount); setLines(data); }
      finally { setLoading(false); }
    };
    load();
  }, [billingAccount]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="lines-tab">
      <div className="tab-header"><div><h3>{t("lines.title")}</h3></div><span className="records-count">{lines.length}</span></div>
      <div className="telecom-stats">
        <div className="stat-card voip"><div className="stat-value">{lines.length}</div><div className="stat-label">Lignes</div></div>
        <div className="stat-card voip"><div className="stat-value">{lines.filter(l => l.serviceType === 'trunk').length}</div><div className="stat-label">Trunks</div></div>
      </div>
      {lines.length === 0 ? (
        <div className="empty-state"><p>{t("lines.empty")}</p></div>
      ) : (
        <div className="line-cards">
          {lines.map(l => (
            <div key={l.serviceName} className={`line-card ${l.serviceType === 'trunk' ? 'trunk' : ''}`}>
              <div className={`line-icon ${l.serviceType === 'trunk' ? 'trunk' : ''}`}>{l.serviceType === 'trunk' ? '📡' : '📞'}</div>
              <div className="line-info">
                <h4>{l.serviceName}</h4>
                <p>{l.description || t("lines.noDescription")}</p>
                <div className="line-meta">
                  <span className="badge info">{l.serviceType}</span>
                  <span className="badge">{l.simultaneousLines} appels</span>
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
