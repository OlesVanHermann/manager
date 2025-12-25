// ############################################################
// #  NASHA/GENERAL - COMPOSANT STRICTEMENT ISOLÉ             #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./GeneralTab.css                            #
// #  SERVICE LOCAL : ./GeneralTab.ts                         #
// #  I18N LOCAL : bare-metal/nasha/general                   #
// ############################################################

import { useTranslation } from "react-i18next";
import type { NashaInfo } from "../../nasha.types";
import "./GeneralTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface GeneralTabProps {
  serviceId: string;
  nasha: NashaInfo | null;
  onRefresh: () => void;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatSize = (gb: number): string => {
  return gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
};

const getUsageClass = (percent: number): string => {
  if (percent >= 90) return "nasha-general-danger";
  if (percent >= 70) return "nasha-general-warning";
  return "";
};

// ============================================================
// Composant Principal
// ============================================================
export default function GeneralTab({ serviceId, nasha, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/nasha/general");
  const { t: tCommon } = useTranslation("common");

  // État de chargement
  if (!nasha) {
    return <div className="nasha-general-loading">{tCommon("loading")}</div>;
  }

  const usagePercent = Math.round((nasha.zpoolCapacity / nasha.zpoolSize) * 100);

  return (
    <div className="nasha-general-tab">
      {/* Barre d'outils */}
      <div className="nasha-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="nasha-general-btn nasha-general-btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {/* Grille d'informations */}
      <div className="nasha-general-info-grid">
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("fields.serviceName")}</div>
          <div className="nasha-general-card-value nasha-general-mono">{nasha.serviceName}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("fields.customName")}</div>
          <div className="nasha-general-card-value">{nasha.customName || "-"}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("fields.datacenter")}</div>
          <div className="nasha-general-card-value">{nasha.datacenter}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("fields.ip")}</div>
          <div className="nasha-general-card-value nasha-general-mono">{nasha.ip}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("fields.monitored")}</div>
          <div className="nasha-general-card-value">
            {nasha.monitored ? "✅ Oui" : "❌ Non"}
          </div>
        </div>
      </div>

      {/* Carte stockage */}
      <div className="nasha-general-info-card">
        <div className="nasha-general-card-title">{t("fields.storage")}</div>
        <div style={{ marginTop: "var(--space-2)" }}>
          <div className="nasha-general-usage-bar">
            <div
              className={`nasha-general-usage-fill ${getUsageClass(usagePercent)}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="nasha-general-usage-text">
            {formatSize(nasha.zpoolCapacity)} / {formatSize(nasha.zpoolSize)} ({usagePercent}%)
          </div>
        </div>
      </div>

      {/* Section mount */}
      <div className="nasha-general-section">
        <h3>{t("mount.title")}</h3>
        <p>{t("mount.description")}</p>
        <div className="nasha-general-mount-command">
          mount -t nfs {nasha.ip}:/export/&lt;partition&gt; /mnt/nasha
        </div>
      </div>
    </div>
  );
}
