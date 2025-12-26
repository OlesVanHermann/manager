// ============================================================
// VEEAM PAGE - Index avec imports isolés
// ============================================================

import { useTranslation } from "react-i18next";
import GeneralTab from "./tabs/general/GeneralTab";

/* ============================================================
   STYLES INLINE - Page container (anciennement veeam.css)
   ============================================================ */
const pageStyles = `
.veeam-page {
  padding: var(--space-4);
}

.veeam-header {
  margin-bottom: var(--space-4);
}

.veeam-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}
`;

export default function VeeamPage() {
  const { t } = useTranslation("private-cloud/veeam/index");

  return (
    <div className="page-content veeam-page">
      <style>{pageStyles}</style>
      <header className="veeam-header">
        <h1>💾 {t("title")}</h1>
      </header>
      <GeneralTab />
    </div>
  );
}
