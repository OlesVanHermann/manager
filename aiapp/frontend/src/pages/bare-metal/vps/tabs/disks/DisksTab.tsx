// ############################################################
// #  VPS/DISKS - COMPOSANT STRICTEMENT ISOLÉ                 #
// ############################################################
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { disksService } from "./DisksTab";
import type { VpsDisk } from "../../vps.types";
import "./DisksTab.css";

interface Props { serviceName: string; }
const formatSize = (gb: number): string => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;

export function DisksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const [disks, setDisks] = useState<VpsDisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const ids = await disksService.listDisks(serviceName); setDisks(await Promise.all(ids.map((id) => disksService.getDisk(serviceName, id)))); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="vps-disks-tab"><div className="vps-disks-loading"><div className="vps-disks-skeleton" style={{ width: "60%" }} /><div className="vps-disks-skeleton" style={{ width: "40%" }} /></div></div>;

  return (
    <div className="vps-disks-tab">
      <div className="vps-disks-header"><h3>{t("disks.title")}</h3></div>
      {disks.length === 0 ? <div className="vps-disks-empty"><p>{t("disks.empty")}</p></div> : (
        <div className="vps-disks-cards">
          {disks.map((disk) => (
            <div key={disk.id} className={`vps-disks-card ${disk.type === "primary" ? "primary" : ""}`}>
              <div className="vps-disks-card-header"><span className={`vps-disks-badge ${disk.state === "connected" ? "success" : "warning"}`}>{disk.state}</span><span className="vps-disks-badge info">{disk.type}</span></div>
              <div className="vps-disks-size">{formatSize(disk.size)}</div>
              <div className="vps-disks-info"><div><label>{t("disks.bandwidthLimit")}</label><span>{disk.bandwidthLimit} MB/s</span></div><div><label>{t("disks.id")}</label><span>{disk.id}</span></div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default DisksTab;
