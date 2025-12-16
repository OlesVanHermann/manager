import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { networkService, IpLoadBalancingFarm, IpLoadBalancingServer } from "../../../../services/network.service";

interface Props { serviceName: string; }

export function FarmsTab({ serviceName }: Props) {
  const { t } = useTranslation("network/load-balancer/index");
  const [farms, setFarms] = useState<(IpLoadBalancingFarm & { servers?: IpLoadBalancingServer[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFarm, setExpandedFarm] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await networkService.listFarms(serviceName);
        const data = await Promise.all(ids.map(id => networkService.getFarm(serviceName, id)));
        setFarms(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const loadServers = async (farmId: number) => {
    if (expandedFarm === farmId) { setExpandedFarm(null); return; }
    setExpandedFarm(farmId);
    try {
      const ids = await networkService.listServers(serviceName, farmId);
      const servers = await Promise.all(ids.map(id => networkService.getServer(serviceName, farmId, id)));
      setFarms(prev => prev.map(f => f.farmId === farmId ? { ...f, servers } : f));
    } catch { /* ignore */ }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="farms-tab">
      <div className="tab-header"><h3>{t("farms.title")}</h3><span className="records-count">{farms.length}</span></div>
      {farms.length === 0 ? (<div className="empty-state"><p>{t("farms.empty")}</p></div>) : (
        <div className="farms-list">
          {farms.map(farm => (
            <div key={farm.farmId} className={`farm-card ${expandedFarm === farm.farmId ? 'expanded' : ''}`}>
              <div className="farm-header" onClick={() => loadServers(farm.farmId)}>
                <div className="farm-info">
                  <h4>{farm.displayName || `Farm #${farm.farmId}`}</h4>
                  <div className="farm-meta">
                    <span className="badge info">{farm.zone}</span>
                    <span className="badge secondary">{farm.balance}</span>
                    {farm.port && <span>:{farm.port}</span>}
                  </div>
                </div>
                <svg className="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </div>
              {expandedFarm === farm.farmId && farm.servers && (
                <div className="farm-servers">
                  {farm.servers.length === 0 ? (<p className="no-servers">{t("farms.noServers")}</p>) : (
                    <table className="servers-table">
                      <thead><tr><th>{t("farms.address")}</th><th>{t("farms.port")}</th><th>{t("farms.weight")}</th><th>{t("farms.status")}</th><th>{t("farms.ssl")}</th></tr></thead>
                      <tbody>
                        {farm.servers.map(s => (
                          <tr key={s.serverId}>
                            <td className="font-mono">{s.address}</td>
                            <td>{s.port || '-'}</td>
                            <td>{s.weight || '-'}</td>
                            <td><span className={`badge ${s.status === 'active' ? 'success' : 'inactive'}`}>{s.status}</span></td>
                            <td>{s.ssl ? '✓' : '✗'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default FarmsTab;
