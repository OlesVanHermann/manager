import { useTranslation } from "react-i18next";

interface PackInfo { packName: string; description?: string; offerDescription: string; capabilities: { isLegacyOffer: boolean; canMoveAddress: boolean; }; }
interface GeneralTabProps { serviceId: string; pack: PackInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, pack, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const { t: tCommon } = useTranslation("common");
  if (!pack) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.packName")}</div><div className="card-value mono">{pack.packName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.description")}</div><div className="card-value">{pack.description || "-"}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.offer")}</div><div className="card-value">{pack.offerDescription}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.moveAddress")}</div><div className="card-value">{pack.capabilities.canMoveAddress ? "✅ Oui" : "❌ Non"}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("general.actions.rename")}</button>
          {pack.capabilities.canMoveAddress && <button className="btn btn-outline">{t("general.actions.moveAddress")}</button>}
          <button className="btn btn-outline btn-danger">{t("general.actions.resiliate")}</button>
        </div>
      </div>
    </div>
  );
}
