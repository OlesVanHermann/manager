import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as instancesService from "./InstancesTab.service";
import type { CloudInstance } from "../project.types";
import "./InstancesTab.css";

interface Props { projectId: string; }

export function InstancesTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/instances");
  const { t: tCommon } = useTranslation("common");
  const [instances, setInstances] = useState<CloudInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const loadInstances = async () => {
    try { setLoading(true); const data = await instancesService.listInstances(projectId); setInstances(data); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadInstances(); }, [projectId]);

  const handleAction = async (instanceId: string, action: 'reboot' | 'start' | 'stop') => {
    try {
      setActing(instanceId);
      if (action === 'reboot') await instancesService.rebootInstance(projectId, instanceId, 'soft');
      else if (action === 'start') await instancesService.startInstance(projectId, instanceId);
      else if (action === 'stop') await instancesService.stopInstance(projectId, instanceId);
      setTimeout(loadInstances, 2000);
    } finally { setActing(null); }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { ACTIVE: 'success', BUILD: 'warning', SHUTOFF: 'inactive', ERROR: 'error', RESCUE: 'info', STOPPED: 'inactive' };
    return <span className={`instances-badge ${map[status] || 'inactive'}`}>{status}</span>;
  };

  const getPublicIp = (instance: CloudInstance) => instance.ipAddresses?.find(ip => ip.type === 'public' && ip.version === 4)?.ip || '-';
  const getPrivateIp = (instance: CloudInstance) => instance.ipAddresses?.find(ip => ip.type === 'private' && ip.version === 4)?.ip || '-';

  if (loading) return <div className="instances-loading"><div className="instances-skeleton-block" /></div>;

  return (
    <div className="instances-tab">
      <div className="instances-header">
        <div><h3>{t("title")}</h3><span className="instances-count">{instances.length}</span></div>
        <button className="instances-btn-refresh" onClick={loadInstances}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></button>
      </div>
      {instances.length === 0 ? (<div className="instances-empty-state"><p>{t("empty")}</p></div>) : (
        <div className="instances-cards">
          {instances.map(inst => (
            <div key={inst.id} className={`instances-card ${inst.status === 'ACTIVE' ? 'active' : ''}`}>
              <div className="instances-card-header">
                <div className={`instances-status-dot ${inst.status === 'ACTIVE' ? 'running' : inst.status === 'SHUTOFF' ? 'stopped' : 'warning'}`} />
                <h4>{inst.name}</h4>
                {getStatusBadge(inst.status)}
              </div>
              <div className="instances-details">
                <div><label>{t("region")}</label><span>{inst.region}</span></div>
                <div><label>{t("publicIp")}</label><span className="instances-mono">{getPublicIp(inst)}</span></div>
                <div><label>{t("privateIp")}</label><span className="instances-mono">{getPrivateIp(inst)}</span></div>
                <div><label>{t("created")}</label><span>{new Date(inst.created).toLocaleDateString()}</span></div>
                {inst.monthlyBilling && <div><label>{t("billing")}</label><span className="instances-badge info">Monthly</span></div>}
              </div>
              <div className="instances-actions">
                {inst.status === 'ACTIVE' && (<>
                  <button className="instances-btn-small" onClick={() => handleAction(inst.id, 'reboot')} disabled={acting === inst.id}>{acting === inst.id ? '...' : t("reboot")}</button>
                  <button className="instances-btn-small instances-danger" onClick={() => handleAction(inst.id, 'stop')} disabled={acting === inst.id}>{t("stop")}</button>
                </>)}
                {inst.status === 'SHUTOFF' && (
                  <button className="instances-btn-small instances-success" onClick={() => handleAction(inst.id, 'start')} disabled={acting === inst.id}>{acting === inst.id ? '...' : t("start")}</button>
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
