// ============================================================
// MANAGED-BAREMETAL PAGE - Index avec imports isolés
// ============================================================

import { useTranslation } from "react-i18next";
import GeneralTab from "./tabs/general/GeneralTab";
import "./managed-baremetal.css";

export default function ManagedBaremetalPage() {
  const { t } = useTranslation("private-cloud/managed-baremetal/index");

  return (
    <div className="page-content managed-baremetal-page">
      <header className="managed-baremetal-header">
        <h1>🏗️ {t("title")}</h1>
      </header>
      <GeneralTab />
    </div>
  );
}
