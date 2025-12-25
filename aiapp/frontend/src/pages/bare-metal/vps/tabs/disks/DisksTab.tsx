// ############################################################
// #  VPS/DISKS - COMPOSANT STRICTEMENT ISOLÉ                 #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./DisksTab.css                              #
// #  SERVICE LOCAL : ./DisksTab.ts                           #
// #  I18N LOCAL : bare-metal/vps/disks                       #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { disksService } from "./DisksTab.service";
import type { VpsDisk } from "../../vps.types";
import "./DisksTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatSize = (gb: number): string => {
  return gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
};

// ============================================================
// Composant Principal
// ============================================================
export function DisksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/disks");
  const [disks, setDisks] = useState<VpsDisk[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des disques
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await disksService.listDisks(serviceName);
        const data = await Promise.all(
          ids.map((id) => disksService.getDisk(serviceName, id))
        );
        setDisks(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // État de chargement
  if (loading) {
    return (
      <div className="vps-disks-tab">
        <div className="vps-disks-loading">
          <div className="vps-disks-skeleton" style={{ width: "60%" }} />
          <div className="vps-disks-skeleton" style={{ width: "40%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="vps-disks-tab">
      {/* En-tête */}
      <div className="vps-disks-header">
        <h3>{t("title")}</h3>
      </div>

      {/* Liste vide */}
      {disks.length === 0 ? (
        <div className="vps-disks-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="vps-disks-cards">
          {disks.map((disk) => (
            <div
              key={disk.id}
              className={`vps-disks-card ${disk.type === "primary" ? "vps-disks-primary" : ""}`}
            >
              <div className="vps-disks-card-header">
                <span
                  className={`vps-disks-badge ${disk.state === "connected" ? "vps-disks-success" : "vps-disks-warning"}`}
                >
                  {disk.state}
                </span>
                <span className="vps-disks-badge vps-disks-info">{disk.type}</span>
              </div>
              <div className="vps-disks-size">{formatSize(disk.size)}</div>
              <div className="vps-disks-info">
                <div>
                  <label>{t("bandwidthLimit")}</label>
                  <span>{disk.bandwidthLimit} MB/s</span>
                </div>
                <div>
                  <label>{t("id")}</label>
                  <span>{disk.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DisksTab;
