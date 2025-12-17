import { useTranslation } from "react-i18next";
import "../styles.css";
export default function SapPage() {
  const { t } = useTranslation("private-cloud/index");
  return <div className="page-content private-cloud-page"><div className="empty-state"><h2>{t("types.sap")}</h2><p>Cette section sera bientôt disponible.</p></div></div>;
}
