import { useTranslation } from "react-i18next";

interface ContainerInfo { name: string; region: string; storedBytes: number; storedObjects: number; staticUrl?: string; containerType: string; }
interface GeneralTabProps { projectId: string; region: string; containerId: string; container: ContainerInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, region, containerId, container, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/object-storage/index");
  const { t: tCommon } = useTranslation("common");
  if (!container) return <div className="loading-state">{tCommon("loading")}</div>;

  const formatSize = (bytes: number) => {
    if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    return `${bytes} B`;
  };

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{container.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{container.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.type")}</div><div className="card-value">{container.containerType}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.objects")}</div><div className="card-value">{container.storedObjects}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.size")}</div><div className="card-value">{formatSize(container.storedBytes)}</div></div>
      </div>

      {container.staticUrl && (
        <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
          <div className="card-title">{t("general.fields.publicUrl")}</div>
          <div className="card-value mono" style={{ fontSize: "var(--font-size-sm)", wordBreak: "break-all" }}>{container.staticUrl}</div>
        </div>
      )}

      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.s3.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>{t("general.s3.description")}</p>
        <div className="info-grid" style={{ marginBottom: 0 }}>
          <div><div className="card-title">{t("general.s3.endpoint")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>s3.{region}.cloud.ovh.net</div></div>
          <div><div className="card-title">{t("general.s3.bucket")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{container.name}</div></div>
        </div>
      </div>

      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{container.containerType === "public" ? t("general.actions.makePrivate") : t("general.actions.makePublic")}</button>
          <button className="btn btn-outline btn-danger">{t("general.actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
