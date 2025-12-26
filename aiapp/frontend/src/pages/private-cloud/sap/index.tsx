// ============================================================
// SAP PAGE - Index avec imports isolés
// ============================================================

import { useTranslation } from "react-i18next";
import GeneralTab from "./tabs/general/GeneralTab";
import "./sap.css";

export default function SapPage() {
  const { t } = useTranslation("private-cloud/sap/index");

  return (
    <div className="page-content sap-page">
      <header className="sap-header">
        <h1>💎 {t("title")}</h1>
      </header>
      <GeneralTab />
    </div>
  );
}
