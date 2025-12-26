// ============================================================
// GENERAL TAB - Composant isolé pour SAP
// ============================================================

import { useTranslation } from "react-i18next";
import "./GeneralTab.css";

export default function GeneralTab() {
  const { t } = useTranslation("private-cloud/sap/general");

  return (
    <div className="general-tab">
      <div className="general-coming-soon">
        <h2>{t("title")}</h2>
        <p>{t("comingSoon")}</p>
      </div>
    </div>
  );
}
