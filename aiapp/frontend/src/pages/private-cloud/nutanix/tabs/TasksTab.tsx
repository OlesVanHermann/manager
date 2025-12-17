import { useTranslation } from "react-i18next";
export default function TasksTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/nutanix/index");
  return <div className="tasks-tab"><div className="tab-toolbar"><h2>{t("tasks.title")}</h2></div><div className="empty-state"><p>{t("tasks.empty")}</p></div></div>;
}
