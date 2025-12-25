// ############################################################
// #  NETAPP/GENERAL - COMPOSANT STRICTEMENT ISOLÉ            #
// ############################################################
import { useTranslation } from "react-i18next";
import type { NetAppInfo } from "../../netapp.types";
import "./GeneralTab.css";

interface GeneralTabProps { serviceId: string; netapp: NetAppInfo | null; onRefresh: () => void; }
const formatDate = (date: string): string => new Date(date).toLocaleDateString("fr-FR");

export default function GeneralTab({ serviceId, netapp, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/netapp/index");
  const { t: tCommon } = useTranslation("common");
  if (!netapp) return <div className="netapp-general-loading">{tCommon("loading")}</div>;

  return (
    <div className="netapp-general-tab">
      <div className="netapp-general-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>
      <div className="netapp-general-info-grid">
        <div className="netapp-general-info-card"><div className="netapp-general-card-title">{t("general.fields.id")}</div><div className="netapp-general-card-value mono">{netapp.id}</div></div>
        <div className="netapp-general-info-card"><div className="netapp-general-card-title">{t("general.fields.name")}</div><div className="netapp-general-card-value">{netapp.name}</div></div>
        <div className="netapp-general-info-card"><div className="netapp-general-card-title">{t("general.fields.region")}</div><div className="netapp-general-card-value">{netapp.region}</div></div>
        <div className="netapp-general-info-card"><div className="netapp-general-card-title">{t("general.fields.performance")}</div><div className="netapp-general-card-value">{netapp.performanceLevel}</div></div>
        <div className="netapp-general-info-card"><div className="netapp-general-card-title">{t("general.fields.created")}</div><div className="netapp-general-card-value">{formatDate(netapp.createdAt)}</div></div>
      </div>
    </div>
  );
}
