import { useTranslation } from "react-i18next";
export default function NodesTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/nutanix/index");
  return <div className="nodes-tab"><div className="tab-toolbar"><h2>{t("nodes.title")}</h2></div><div className="empty-state"><p>{t("nodes.description")}</p></div></div>;
}
