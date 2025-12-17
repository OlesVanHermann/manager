import { useTranslation } from "react-i18next";
export default function IpsTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/nutanix/index");
  return <div className="ips-tab"><div className="tab-toolbar"><h2>{t("ips.title")}</h2></div><div className="empty-state"><p>{t("ips.description")}</p></div></div>;
}
