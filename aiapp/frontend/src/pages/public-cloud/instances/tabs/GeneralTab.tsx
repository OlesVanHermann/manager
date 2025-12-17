import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as instancesService from "../../../../services/public-cloud.instances";

interface InstanceInfo { id: string; name: string; flavorId: string; flavorName: string; imageId: string; imageName: string; region: string; status: string; created: string; ipAddresses: { ip: string; type: string; version: number }[]; }
interface GeneralTabProps { projectId: string; instanceId: string; instance: InstanceInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, instanceId, instance, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/instances/index");
  const { t: tCommon } = useTranslation("common");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!instance) return <div className="loading-state">{tCommon("loading")}</div>;

  const handleAction = async (action: string) => {
    if (!confirm(t(`general.actions.confirm.${action}`))) return;
    try {
      setActionLoading(action);
      await instancesService.instanceAction(projectId, instanceId, action);
      setTimeout(onRefresh, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.id")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{instance.id}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{instance.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{instance.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.flavor")}</div><div className="card-value">{instance.flavorName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.image")}</div><div className="card-value">{instance.imageName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.created")}</div><div className="card-value">{new Date(instance.created).toLocaleDateString("fr-FR")}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="instance-actions" style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {instance.status === "ACTIVE" ? (
            <>
              <button className="btn btn-outline" onClick={() => handleAction("reboot")} disabled={!!actionLoading}>{actionLoading === "reboot" ? "..." : t("general.actions.reboot")}</button>
              <button className="btn btn-outline" onClick={() => handleAction("stop")} disabled={!!actionLoading}>{actionLoading === "stop" ? "..." : t("general.actions.stop")}</button>
            </>
          ) : instance.status === "SHUTOFF" ? (
            <button className="btn btn-primary" onClick={() => handleAction("start")} disabled={!!actionLoading}>{actionLoading === "start" ? "..." : t("general.actions.start")}</button>
          ) : null}
          <button className="btn btn-outline" onClick={() => handleAction("rescue")} disabled={!!actionLoading}>{t("general.actions.rescue")}</button>
          <button className="btn btn-outline" onClick={() => handleAction("reinstall")} disabled={!!actionLoading}>{t("general.actions.reinstall")}</button>
          <button className="btn btn-outline">{t("general.actions.resize")}</button>
          <button className="btn btn-outline btn-danger" onClick={() => handleAction("delete")} disabled={!!actionLoading}>{t("general.actions.delete")}</button>
        </div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.ssh.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-2)" }}>{t("general.ssh.description")}</p>
        <div className="kubeconfig-box">ssh ubuntu@{instance.ipAddresses.find(ip => ip.type === "public" && ip.version === 4)?.ip || "<IP>"}</div>
      </div>
    </div>
  );
}
