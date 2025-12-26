// ============================================================
// MANAGED-BAREMETAL PAGE - Index avec imports isolés
// ============================================================

import { useTranslation } from "react-i18next";
import GeneralTab from "./tabs/general/GeneralTab";

/* ============================================================
   STYLES INLINE - Page container (anciennement managed-baremetal.css)
   ============================================================ */
const pageStyles = `
.managed-baremetal-page {
  padding: var(--space-4);
}

.managed-baremetal-header {
  margin-bottom: var(--space-4);
}

.managed-baremetal-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}
`;

export default function ManagedBaremetalPage() {
  const { t } = useTranslation("private-cloud/managed-baremetal/index");

  return (
    <div className="page-content managed-baremetal-page">
      <style>{pageStyles}</style>
      <header className="managed-baremetal-header">
        <h1>🏗️ {t("title")}</h1>
      </header>
      <GeneralTab />
    </div>
  );
}
