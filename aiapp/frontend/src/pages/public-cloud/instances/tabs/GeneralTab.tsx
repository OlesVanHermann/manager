import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as generalService from "./GeneralTab.service";
import "./GeneralTab.css";

interface InstanceInfo { id: string; name: string; flavorId: string; flavorName: string; imageId: string; imageName: string; region: string; status: string; created: string; ipAddresses: { ip: string; type: string; version: number }[]; }
interface GeneralTabProps { projectId: string; instanceId: string; instance: InstanceInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, instanceId, instance, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/instances/general");
  const { t: tCommon } = useTranslation("common");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!instance) return <div className="general-loading-state">{tCommon("loading")}</div>;

  const handleAction = async (action: string) => {
    if (!confirm(t(`actions.confirm.${action}`))) return;
    try {
      setActionLoading(action);
      await generalService.instanceAction(projectId, instanceId, action);
      setTimeout(onRefresh, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="general-tab">
      <div className="general-toolbar"><h2>{t("title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="general-info-grid">
        <div className="general-info-card"><div className="general-card-title">{t("fields.id")}</div><div className="general-card-value general-mono" style={{ fontSize: "var(--font-size-sm)" }}>{instance.id}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("fields.name")}</div><div className="general-card-value">{instance.name}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("fields.region")}</div><div className="general-card-value">{instance.region}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("fields.flavor")}</div><div className="general-card-value">{instance.flavorName}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("fields.image")}</div><div className="general-card-value">{instance.imageName}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("fields.created")}</div><div className="general-card-value">{new Date(instance.created).toLocaleDateString("fr-FR")}</div></div>
      </div>
      <div className="general-info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("actions.title")}</h3>
        <div className="general-actions" style={{ marginTop: "var(--space-3)" }}>
          {instance.status === "ACTIVE" ? (
            <>
              <button className="btn btn-outline" onClick={() => handleAction("reboot")} disabled={!!actionLoading}>{actionLoading === "reboot" ? "..." : t("actions.reboot")}</button>
              <button className="btn btn-outline" onClick={() => handleAction("stop")} disabled={!!actionLoading}>{actionLoading === "stop" ? "..." : t("actions.stop")}</button>
            </>
          ) : instance.status === "SHUTOFF" ? (
            <button className="btn btn-primary" onClick={() => handleAction("start")} disabled={!!actionLoading}>{actionLoading === "start" ? "..." : t("actions.start")}</button>
          ) : null}
          <button className="btn btn-outline" onClick={() => handleAction("rescue")} disabled={!!actionLoading}>{t("actions.rescue")}</button>
          <button className="btn btn-outline" onClick={() => handleAction("reinstall")} disabled={!!actionLoading}>{t("actions.reinstall")}</button>
          <button className="btn btn-outline">{t("actions.resize")}</button>
          <button className="btn btn-outline btn-danger" onClick={() => handleAction("delete")} disabled={!!actionLoading}>{t("actions.delete")}</button>
        </div>
      </div>
      <div className="general-info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("ssh.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-2)" }}>{t("ssh.description")}</p>
        <div className="general-code-box">ssh ubuntu@{instance.ipAddresses.find(ip => ip.type === "public" && ip.version === 4)?.ip || "<IP>"}</div>
      </div>
    </div>
  );
}
