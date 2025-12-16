import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cloudService, CloudInstance } from "../../../../services/cloud.service";

interface Props { projectId: string; }

export function InstancesTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/index");
  const { t: tCommon } = useTranslation("common");
  const [instances, setInstances] = useState<CloudInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const loadInstances = async () => {
    try { setLoading(true); const data = await cloudService.listInstances(projectId); setInstances(data); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadInstances(); }, [projectId]);

  const handleAction = async (instanceId: string, action: 'reboot' | 'start' | 'stop') => {
    try {
      setActing(instanceId);
      if (action === 'reboot') await cloudService.rebootInstance(projectId, instanceId, 'soft');
      else if (action === 'start') await cloudService.startInstance(projectId, instanceId);
      else if (action === 'stop') await cloudService.stopInstance(projectId, instanceId);
      setTimeout(loadInstances, 2000);
    } finally { setActing(null); }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { ACTIVE: 'success', BUILD: 'warning', SHUTOFF: 'inactive', ERROR: 'error', RESCUE: 'info', STOPPED: 'inactive' };
    return <span className={`badge ${map[status] || 'inactive'}`}>{status}</span>;
  };

  const getPublicIp = (instance: CloudInstance) => instance.ipAddresses?.find(ip => ip.type === 'public' && ip.version === 4)?.ip || '-';
  const getPrivateIp = (instance: CloudInstance) => instance.ipAddresses?.find(ip => ip.type === 'private' && ip.version === 4)?.ip || '-';

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="instances-tab">
      <div className="tab-header">
        <div><h3>{t("instances.title")}</h3><span className="records-count">{instances.length}</span></div>
        <button className="btn-refresh" onClick={loadInstances}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></button>
      </div>
      {instances.length === 0 ? (<div className="empty-state"><p>{t("instances.empty")}</p></div>) : (
        <div className="instance-cards">
          {instances.map(inst => (
            <div key={inst.id} className={`instance-card ${inst.status === 'ACTIVE' ? 'active' : ''}`}>
              <div className="instance-header">
                <div className={`status-dot ${inst.status === 'ACTIVE' ? 'running' : inst.status === 'SHUTOFF' ? 'stopped' : 'warning'}`} />
                <h4>{inst.name}</h4>
                {getStatusBadge(inst.status)}
              </div>
              <div className="instance-details">
                <div><label>{t("instances.region")}</label><span>{inst.region}</span></div>
                <div><label>{t("instances.publicIp")}</label><span className="font-mono">{getPublicIp(inst)}</span></div>
                <div><label>{t("instances.privateIp")}</label><span className="font-mono">{getPrivateIp(inst)}</span></div>
                <div><label>{t("instances.created")}</label><span>{new Date(inst.created).toLocaleDateString()}</span></div>
                {inst.monthlyBilling && <div><label>{t("instances.billing")}</label><span className="badge info">Monthly</span></div>}
              </div>
              <div className="instance-actions">
                {inst.status === 'ACTIVE' && (<>
                  <button className="btn-small" onClick={() => handleAction(inst.id, 'reboot')} disabled={acting === inst.id}>{acting === inst.id ? '...' : t("instances.reboot")}</button>
                  <button className="btn-small danger" onClick={() => handleAction(inst.id, 'stop')} disabled={acting === inst.id}>{t("instances.stop")}</button>
                </>)}
                {inst.status === 'SHUTOFF' && (
                  <button className="btn-small success" onClick={() => handleAction(inst.id, 'start')} disabled={acting === inst.id}>{acting === inst.id ? '...' : t("instances.start")}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default InstancesTab;
