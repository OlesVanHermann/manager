// ============================================================
// SAP PAGE - Index avec imports isolés
// ============================================================

import { useTranslation } from "react-i18next";
import GeneralTab from "./tabs/general/GeneralTab";

/* ============================================================
   STYLES INLINE - Page container (anciennement sap.css)
   ============================================================ */
const pageStyles = `
.sap-page {
  padding: var(--space-4);
}

.sap-header {
  margin-bottom: var(--space-4);
}

.sap-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}
`;

export default function SapPage() {
  const { t } = useTranslation("private-cloud/sap/index");

  return (
    <div className="page-content sap-page">
      <style>{pageStyles}</style>
      <header className="sap-header">
        <h1>💎 {t("title")}</h1>
      </header>
      <GeneralTab />
    </div>
  );
}
