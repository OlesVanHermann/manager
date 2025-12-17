import { useTranslation } from "react-i18next";
import "../styles.css";
export default function Managed-baremetalPage() {
  const { t } = useTranslation("private-cloud/index");
  return <div className="page-content private-cloud-page"><div className="empty-state"><h2>{t("types.managed-baremetal")}</h2><p>Cette section sera bientôt disponible.</p></div></div>;
}
