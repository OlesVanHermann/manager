import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { volumesService } from "./VolumesTab";
import type { NetAppVolume } from "../../netapp.types";
import "./VolumesTab.css";
interface VolumesTabProps { serviceId: string; }
export default function VolumesTab({ serviceId }: VolumesTabProps) {
  const { t } = useTranslation("bare-metal/netapp/index");
  const { t: tCommon } = useTranslation("common");
  const [volumes, setVolumes] = useState<NetAppVolume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadVolumes(); }, [serviceId]);
  const loadVolumes = async () => {
    try { setLoading(true); setError(null); const data = await volumesService.getVolumes(serviceId); setVolumes(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };
  const formatSize = (gb: number) => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
  const getUsagePercent = (used: number, total: number) => Math.round((used / total) * 100);
  const getUsageClass = (percent: number) => percent >= 90 ? "danger" : percent >= 70 ? "warning" : "";
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadVolumes}>{tCommon("actions.retry")}</button></div>;
  return (
    <div className="volumes-tab">
      <div className="tab-toolbar"><h2>{t("volumes.title")}</h2><button className="btn btn-primary">{t("volumes.create")}</button></div>
      {volumes.length === 0 ? (<div className="empty-state"><h2>{t("volumes.empty.title")}</h2></div>) : (
        <div className="volumes-list">
          {volumes.map((volume) => {
            const usedPercent = getUsagePercent(volume.usedSize, volume.size);
            return (
              <div key={volume.id} className="volume-card">
                <div className="volume-header"><div><div className="volume-name">{volume.name}</div><div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>{volume.id}</div></div><span className="volume-protocol">{volume.protocol}</span></div>
                <div className="info-grid" style={{ marginBottom: "var(--space-3)" }}><div className="info-card"><div className="card-title">{t("volumes.fields.mountPath")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{volume.mountPath}</div></div></div>
                <div><div className="card-title">{t("volumes.fields.usage")}</div><div className="usage-bar" style={{ marginTop: "var(--space-2)" }}><div className={`usage-fill ${getUsageClass(usedPercent)}`} style={{ width: `${usedPercent}%` }}></div></div><div className="usage-text">{formatSize(volume.usedSize)} / {formatSize(volume.size)} ({usedPercent}%)</div></div>
                <div className="item-actions" style={{ marginTop: "var(--space-3)" }}><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button><button className="btn btn-sm btn-outline">{t("volumes.resize")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
