import { useTranslation } from "react-i18next";

interface ClusterInfo { id: string; name: string; region: string; version: string; status: string; url?: string; nodesCount: number; }
interface GeneralTabProps { projectId: string; clusterId: string; cluster: ClusterInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, clusterId, cluster, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/kubernetes/index");
  const { t: tCommon } = useTranslation("common");
  if (!cluster) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.id")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{cluster.id}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{cluster.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{cluster.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.version")}</div><div className="card-value">{cluster.version}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.nodes")}</div><div className="card-value">{cluster.nodesCount}</div></div>
      </div>
      {cluster.url && (
        <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
          <div className="card-title">{t("general.fields.apiServer")}</div>
          <div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{cluster.url}</div>
        </div>
      )}
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("general.actions.upgrade")}</button>
          <button className="btn btn-outline">{t("general.actions.restart")}</button>
          <button className="btn btn-outline btn-danger">{t("general.actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
