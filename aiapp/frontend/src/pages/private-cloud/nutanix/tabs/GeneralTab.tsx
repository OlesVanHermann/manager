import { useTranslation } from "react-i18next";
interface NutanixCluster { serviceName: string; targetSpec?: { name: string; controlPanelURL: string; }; status: string; }
interface GeneralTabProps { serviceId: string; cluster: NutanixCluster | null; onRefresh: () => void; }
export default function GeneralTab({ serviceId, cluster, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("private-cloud/nutanix/index");
  const { t: tCommon } = useTranslation("common");
  if (!cluster) return <div className="loading-state">{tCommon("loading")}</div>;
  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.serviceName")}</div><div className="card-value mono">{cluster.serviceName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{cluster.targetSpec?.name || "-"}</div></div>
      </div>
      {cluster.targetSpec?.controlPanelURL && <div className="info-card" style={{ marginTop: "var(--space-4)" }}><h3>{t("general.access.title")}</h3><a href={cluster.targetSpec.controlPanelURL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: "var(--space-2)" }}>{t("general.access.prism")}</a></div>}
    </div>
  );
}
