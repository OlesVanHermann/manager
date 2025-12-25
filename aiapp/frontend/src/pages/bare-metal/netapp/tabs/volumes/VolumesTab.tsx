// ############################################################
// #  NETAPP/VOLUMES - COMPOSANT STRICTEMENT ISOLÉ            #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./VolumesTab.css                            #
// #  SERVICE LOCAL : ./VolumesTab.ts                         #
// #  I18N LOCAL : bare-metal/netapp/volumes                  #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { volumesService } from "./VolumesTab.service";
import type { NetAppVolume } from "../../netapp.types";
import "./VolumesTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface VolumesTabProps {
  serviceId: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatSize = (gb: number): string => {
  return gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
};

const getUsagePercent = (used: number, total: number): number => {
  return Math.round((used / total) * 100);
};

const getUsageClass = (percent: number): string => {
  if (percent >= 90) return "netapp-volumes-danger";
  if (percent >= 70) return "netapp-volumes-warning";
  return "";
};

// ============================================================
// Composant Principal
// ============================================================
export default function VolumesTab({ serviceId }: VolumesTabProps) {
  const { t } = useTranslation("bare-metal/netapp/volumes");
  const { t: tCommon } = useTranslation("common");
  const [volumes, setVolumes] = useState<NetAppVolume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des volumes
  const loadVolumes = async () => {
    try {
      setLoading(true);
      setError(null);
      setVolumes(await volumesService.getVolumes(serviceId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolumes();
  }, [serviceId]);

  // État de chargement
  if (loading) {
    return <div className="netapp-volumes-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="netapp-volumes-error">
        <p>{error}</p>
        <button className="netapp-volumes-btn netapp-volumes-btn-primary" onClick={loadVolumes}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="netapp-volumes-tab">
      {/* Barre d'outils */}
      <div className="netapp-volumes-toolbar">
        <h2>{t("title")}</h2>
        <button className="netapp-volumes-btn netapp-volumes-btn-primary">{t("create")}</button>
      </div>

      {/* Liste vide */}
      {volumes.length === 0 ? (
        <div className="netapp-volumes-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="netapp-volumes-list">
          {volumes.map((volume) => {
            const usedPercent = getUsagePercent(volume.usedSize, volume.size);
            return (
              <div key={volume.id} className="netapp-volumes-card">
                <div className="netapp-volumes-header">
                  <div>
                    <div className="netapp-volumes-name">{volume.name}</div>
                    <div className="netapp-volumes-id">{volume.id}</div>
                  </div>
                  <span className="netapp-volumes-protocol">{volume.protocol}</span>
                </div>
                <div className="netapp-volumes-info-grid">
                  <div className="netapp-volumes-info-card">
                    <div className="netapp-volumes-card-title">{t("fields.mountPath")}</div>
                    <div className="netapp-volumes-card-value netapp-volumes-mono">
                      {volume.mountPath}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="netapp-volumes-card-title">{t("fields.usage")}</div>
                  <div className="netapp-volumes-usage-bar">
                    <div
                      className={`netapp-volumes-usage-fill ${getUsageClass(usedPercent)}`}
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                  <div className="netapp-volumes-usage-text">
                    {formatSize(volume.usedSize)} / {formatSize(volume.size)} ({usedPercent}%)
                  </div>
                </div>
                <div className="netapp-volumes-actions">
                  <button className="netapp-volumes-btn netapp-volumes-btn-sm netapp-volumes-btn-outline">{tCommon("actions.edit")}</button>
                  <button className="netapp-volumes-btn netapp-volumes-btn-sm netapp-volumes-btn-outline">{t("resize")}</button>
                  <button className="netapp-volumes-btn netapp-volumes-btn-sm netapp-volumes-btn-outline netapp-volumes-btn-danger">
                    {tCommon("actions.delete")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
