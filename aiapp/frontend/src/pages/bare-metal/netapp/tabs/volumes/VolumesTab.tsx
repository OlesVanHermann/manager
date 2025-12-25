// ############################################################
// #  NETAPP/VOLUMES - COMPOSANT STRICTEMENT ISOLÉ            #
// ############################################################
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { volumesService } from "./VolumesTab";
import type { NetAppVolume } from "../../netapp.types";
import "./VolumesTab.css";

interface VolumesTabProps { serviceId: string; }
const formatSize = (gb: number): string => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
const getUsagePercent = (used: number, total: number): number => Math.round((used / total) * 100);
const getUsageClass = (percent: number): string => percent >= 90 ? "danger" : percent >= 70 ? "warning" : "";

export default function VolumesTab({ serviceId }: VolumesTabProps) {
  const { t } = useTranslation("bare-metal/netapp/index");
  const { t: tCommon } = useTranslation("common");
  const [volumes, setVolumes] = useState<NetAppVolume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadVolumes(); }, [serviceId]);
  const loadVolumes = async () => {
    try { setLoading(true); setError(null); setVolumes(await volumesService.getVolumes(serviceId)); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="netapp-volumes-loading">{tCommon("loading")}</div>;
  if (error) return <div className="netapp-volumes-error"><p>{error}</p><button className="btn btn-primary" onClick={loadVolumes}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="netapp-volumes-tab">
      <div className="netapp-volumes-toolbar"><h2>{t("volumes.title")}</h2><button className="btn btn-primary">{t("volumes.create")}</button></div>
      {volumes.length === 0 ? <div className="netapp-volumes-empty"><h2>{t("volumes.empty.title")}</h2></div> : (
        <div className="netapp-volumes-list">
          {volumes.map((volume) => {
            const usedPercent = getUsagePercent(volume.usedSize, volume.size);
            return (
              <div key={volume.id} className="netapp-volumes-card">
                <div className="netapp-volumes-header"><div><div className="netapp-volumes-name">{volume.name}</div><div className="netapp-volumes-id">{volume.id}</div></div><span className="netapp-volumes-protocol">{volume.protocol}</span></div>
                <div className="netapp-volumes-info-grid"><div className="netapp-volumes-info-card"><div className="netapp-volumes-card-title">{t("volumes.fields.mountPath")}</div><div className="netapp-volumes-card-value mono">{volume.mountPath}</div></div></div>
                <div><div className="netapp-volumes-card-title">{t("volumes.fields.usage")}</div><div className="netapp-volumes-usage-bar"><div className={`netapp-volumes-usage-fill ${getUsageClass(usedPercent)}`} style={{ width: `${usedPercent}%` }} /></div><div className="netapp-volumes-usage-text">{formatSize(volume.usedSize)} / {formatSize(volume.size)} ({usedPercent}%)</div></div>
                <div className="netapp-volumes-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button><button className="btn btn-sm btn-outline">{t("volumes.resize")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
