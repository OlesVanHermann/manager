import { useTranslation } from "react-i18next";

interface DatabaseInfo { id: string; description: string; engine: string; version: string; plan: string; status: string; region: string; nodeNumber: number; flavor: string; }
interface GeneralTabProps { projectId: string; engine: string; serviceId: string; database: DatabaseInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, engine, serviceId, database, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/databases/index");
  const { t: tCommon } = useTranslation("common");
  if (!database) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.engine")}</div><div className="card-value">{database.engine}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.version")}</div><div className="card-value">{database.version}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.plan")}</div><div className="card-value">{database.plan}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{database.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.nodes")}</div><div className="card-value">{database.nodeNumber}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.flavor")}</div><div className="card-value">{database.flavor}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("general.actions.upgrade")}</button>
          <button className="btn btn-outline">{t("general.actions.resize")}</button>
          <button className="btn btn-outline btn-danger">{t("general.actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
