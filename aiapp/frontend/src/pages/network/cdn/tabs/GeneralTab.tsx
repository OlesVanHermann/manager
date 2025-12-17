import { useTranslation } from "react-i18next";

interface CdnInfo { serviceName: string; offer: string; anycast: string; status: string; }
interface GeneralTabProps { serviceId: string; cdn: CdnInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, cdn, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("network/cdn/index");
  const { t: tCommon } = useTranslation("common");
  if (!cdn) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.serviceName")}</div><div className="card-value mono">{cdn.serviceName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.offer")}</div><div className="card-value">{cdn.offer}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.anycast")}</div><div className="card-value mono">{cdn.anycast}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.config.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>{t("general.config.description")}</p>
        <div className="item-actions"><button className="btn btn-outline">{t("general.config.purgeCache")}</button><button className="btn btn-outline">{t("general.config.flushAll")}</button></div>
      </div>
    </div>
  );
}
