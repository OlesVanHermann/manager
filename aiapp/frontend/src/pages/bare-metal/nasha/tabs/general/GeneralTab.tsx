// ############################################################
// #  NASHA/GENERAL - COMPOSANT STRICTEMENT ISOLÉ             #
// #  CSS LOCAL : ./GeneralTab.css                            #
// ############################################################

import { useTranslation } from "react-i18next";
import type { NashaInfo } from "../../nasha.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceId: string;
  nasha: NashaInfo | null;
  onRefresh: () => void;
}

const formatSize = (gb: number): string => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
const getUsageClass = (percent: number): string => percent >= 90 ? "danger" : percent >= 70 ? "warning" : "";

export default function GeneralTab({ serviceId, nasha, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");

  if (!nasha) {
    return <div className="nasha-general-loading">{tCommon("loading")}</div>;
  }

  const usagePercent = Math.round((nasha.zpoolCapacity / nasha.zpoolSize) * 100);

  return (
    <div className="nasha-general-tab">
      <div className="nasha-general-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="nasha-general-info-grid">
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("general.fields.serviceName")}</div>
          <div className="nasha-general-card-value mono">{nasha.serviceName}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("general.fields.customName")}</div>
          <div className="nasha-general-card-value">{nasha.customName || "-"}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("general.fields.datacenter")}</div>
          <div className="nasha-general-card-value">{nasha.datacenter}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("general.fields.ip")}</div>
          <div className="nasha-general-card-value mono">{nasha.ip}</div>
        </div>
        <div className="nasha-general-info-card">
          <div className="nasha-general-card-title">{t("general.fields.monitored")}</div>
          <div className="nasha-general-card-value">{nasha.monitored ? "✅ Oui" : "❌ Non"}</div>
        </div>
      </div>

      <div className="nasha-general-info-card">
        <div className="nasha-general-card-title">{t("general.fields.storage")}</div>
        <div style={{ marginTop: "var(--space-2)" }}>
          <div className="nasha-general-usage-bar">
            <div className={`nasha-general-usage-fill ${getUsageClass(usagePercent)}`} style={{ width: `${usagePercent}%` }} />
          </div>
          <div className="nasha-general-usage-text">
            {formatSize(nasha.zpoolCapacity)} / {formatSize(nasha.zpoolSize)} ({usagePercent}%)
          </div>
        </div>
      </div>

      <div className="nasha-general-section">
        <h3>{t("general.mount.title")}</h3>
        <p>{t("general.mount.description")}</p>
        <div className="nasha-general-mount-command">
          mount -t nfs {nasha.ip}:/export/&lt;partition&gt; /mnt/nasha
        </div>
      </div>
    </div>
  );
}
