import { useTranslation } from "react-i18next";

interface LoadBalancerInfo { id: string; name: string; region: string; status: string; vipAddress: string; flavor: string; }
interface GeneralTabProps { projectId: string; lbId: string; lb: LoadBalancerInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, lbId, lb, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/load-balancer/index");
  const { t: tCommon } = useTranslation("common");
  if (!lb) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.id")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{lb.id}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{lb.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{lb.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.flavor")}</div><div className="card-value">{lb.flavor}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.vip")}</div><div className="card-value mono">{lb.vipAddress}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("general.actions.resize")}</button>
          <button className="btn btn-outline btn-danger">{t("general.actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
