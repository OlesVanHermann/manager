import { useTranslation } from "react-i18next";

interface NetAppInfo { id: string; name: string; region: string; status: string; performanceLevel: string; createdAt: string; }
interface GeneralTabProps { serviceId: string; netapp: NetAppInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, netapp, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/netapp/index");
  const { t: tCommon } = useTranslation("common");
  if (!netapp) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.id")}</div><div className="card-value mono">{netapp.id}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{netapp.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{netapp.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.performance")}</div><div className="card-value">{netapp.performanceLevel}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.created")}</div><div className="card-value">{new Date(netapp.createdAt).toLocaleDateString("fr-FR")}</div></div>
      </div>
    </div>
  );
}
