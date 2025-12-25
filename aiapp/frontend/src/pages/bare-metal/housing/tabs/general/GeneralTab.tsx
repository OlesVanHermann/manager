import { useTranslation } from "react-i18next";
import type { HousingInfo } from "../../housing.types";
import "./GeneralTab.css";
interface GeneralTabProps { serviceId: string; housing: HousingInfo | null; onRefresh: () => void; }
export default function GeneralTab({ serviceId, housing, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/housing/index");
  const { t: tCommon } = useTranslation("common");
  if (!housing) return <div className="loading-state">{tCommon("loading")}</div>;
  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="general-info-grid">
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.name")}</div><div className="general-card-value">{housing.name}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.datacenter")}</div><div className="general-card-value">{housing.datacenter}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.rack")}</div><div className="general-card-value">{housing.rack}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.bandwidth")}</div><div className="general-card-value">{housing.networkBandwidth} Mbps</div></div>
      </div>
      <div className="general-info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.info.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>{t("general.info.description")}</p>
      </div>
    </div>
  );
}
