// ============================================================
// VEEAM PAGE - Index avec imports isolés
// ============================================================

import { useTranslation } from "react-i18next";
import GeneralTab from "./tabs/general/GeneralTab";
import "./veeam.css";

export default function VeeamPage() {
  const { t } = useTranslation("private-cloud/veeam/index");

  return (
    <div className="page-content veeam-page">
      <header className="veeam-header">
        <h1>💾 {t("title")}</h1>
      </header>
      <GeneralTab />
    </div>
  );
}
