import { useTranslation } from "react-i18next";

interface HousingInfo { name: string; datacenter: string; rack: string; networkBandwidth: number; }
interface GeneralTabProps { serviceId: string; housing: HousingInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, housing, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/housing/index");
  const { t: tCommon } = useTranslation("common");
  if (!housing) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{housing.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.datacenter")}</div><div className="card-value">{housing.datacenter}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.rack")}</div><div className="card-value">{housing.rack}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.bandwidth")}</div><div className="card-value">{housing.networkBandwidth} Mbps</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.info.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>{t("general.info.description")}</p>
      </div>
    </div>
  );
}
