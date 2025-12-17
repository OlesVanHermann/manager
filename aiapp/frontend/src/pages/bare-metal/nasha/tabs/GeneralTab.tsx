import { useTranslation } from "react-i18next";

interface NashaInfo {
  serviceName: string;
  customName?: string;
  datacenter: string;
  ip: string;
  zpoolSize: number;
  zpoolCapacity: number;
  monitored: boolean;
  status: string;
}

interface GeneralTabProps {
  serviceId: string;
  nasha: NashaInfo | null;
  onRefresh: () => void;
}

export default function GeneralTab({ serviceId, nasha, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");

  if (!nasha) return <div className="loading-state">{tCommon("loading")}</div>;

  const formatSize = (gb: number) => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
  const usagePercent = Math.round((nasha.zpoolCapacity / nasha.zpoolSize) * 100);
  const getUsageClass = (percent: number) => percent >= 90 ? "danger" : percent >= 70 ? "warning" : "";

  return (
    <div className="general-tab">
      <div className="tab-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="card-title">{t("general.fields.serviceName")}</div>
          <div className="card-value mono">{nasha.serviceName}</div>
        </div>
        <div className="info-card">
          <div className="card-title">{t("general.fields.customName")}</div>
          <div className="card-value">{nasha.customName || "-"}</div>
        </div>
        <div className="info-card">
          <div className="card-title">{t("general.fields.datacenter")}</div>
          <div className="card-value">{nasha.datacenter}</div>
        </div>
        <div className="info-card">
          <div className="card-title">{t("general.fields.ip")}</div>
          <div className="card-value mono">{nasha.ip}</div>
        </div>
        <div className="info-card">
          <div className="card-title">{t("general.fields.monitored")}</div>
          <div className="card-value">{nasha.monitored ? "✅ Oui" : "❌ Non"}</div>
        </div>
      </div>

      <div className="info-card">
        <div className="card-title">{t("general.fields.storage")}</div>
        <div style={{ marginTop: "var(--space-2)" }}>
          <div className="usage-bar">
            <div className={`usage-fill ${getUsageClass(usagePercent)}`} style={{ width: `${usagePercent}%` }}></div>
          </div>
          <div className="usage-text">{formatSize(nasha.zpoolCapacity)} / {formatSize(nasha.zpoolSize)} ({usagePercent}%)</div>
        </div>
      </div>

      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.mount.title")}</h3>
        <p style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)", color: "var(--color-text-secondary)" }}>{t("general.mount.description")}</p>
        <div className="mount-command">mount -t nfs {nasha.ip}:/export/&lt;partition&gt; /mnt/nasha</div>
      </div>
    </div>
  );
}
