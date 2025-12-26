import { useTranslation } from "react-i18next";
import "./GeneralTab.css";

interface VolumeInfo { id: string; name: string; description?: string; region: string; size: number; type: string; status: string; bootable: boolean; attachedTo?: string[]; createdAt: string; }
interface GeneralTabProps { projectId: string; volumeId: string; volume: VolumeInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, volumeId, volume, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/block-storage/index");
  const { t: tCommon } = useTranslation("common");
  if (!volume) return <div className="loading-state">{tCommon("loading")}</div>;

  const isAttached = volume.attachedTo && volume.attachedTo.length > 0;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.id")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{volume.id}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{volume.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{volume.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.size")}</div><div className="card-value">{volume.size} GB</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.type")}</div><div className="card-value">{volume.type}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.bootable")}</div><div className="card-value">{volume.bootable ? "✅ Oui" : "❌ Non"}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.created")}</div><div className="card-value">{new Date(volume.createdAt).toLocaleDateString("fr-FR")}</div></div>
      </div>

      {isAttached && (
        <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
          <h3>{t("general.attachment.title")}</h3>
          <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>{t("general.attachment.attachedTo")}: <span className="mono">{volume.attachedTo?.join(", ")}</span></p>
        </div>
      )}

      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          {isAttached ? (
            <button className="btn btn-outline">{t("general.actions.detach")}</button>
          ) : (
            <button className="btn btn-outline">{t("general.actions.attach")}</button>
          )}
          <button className="btn btn-outline">{t("general.actions.resize")}</button>
          <button className="btn btn-outline btn-danger" disabled={isAttached}>{t("general.actions.delete")}</button>
        </div>
      </div>

      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.mount.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>{t("general.mount.description")}</p>
        <div className="kubeconfig-box">
# Formater le volume (une seule fois){"\n"}
sudo mkfs.ext4 /dev/sdb{"\n"}{"\n"}
# Monter le volume{"\n"}
sudo mkdir -p /mnt/volume{"\n"}
sudo mount /dev/sdb /mnt/volume
        </div>
      </div>
    </div>
  );
}
