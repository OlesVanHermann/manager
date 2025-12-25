// ============================================================
// VIRTUOZZO LICENSE PAGE - Page principale isolée
// ============================================================

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { VirtuozzoLicense } from "./virtuozzo.types";
import { getVirtuozzoLicense } from "./tabs/GeneralTab";
import GeneralTab from "./tabs/GeneralTab";
import TasksTab from "./tabs/TasksTab";

// ============================================================
// STYLES INLINE (ISOLÉS)
// ============================================================

const styles = {
  page: { padding: "var(--space-4)" },
  header: { marginBottom: "var(--space-4)" },
  title: { fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", margin: "0 0 var(--space-2) 0" },
  meta: { display: "flex", gap: "var(--space-4)", color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", alignItems: "center", flexWrap: "wrap" as const },
  tabs: { display: "flex", gap: "var(--space-2)", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-4)" },
  tab: { padding: "var(--space-2) var(--space-4)", border: "none", background: "none", cursor: "pointer", fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", borderBottom: "2px solid transparent" },
  tabActive: { color: "var(--color-primary-500)", borderBottomColor: "var(--color-primary-500)" },
} as const;

// ============================================================
// COMPOSANT
// ============================================================

export default function VirtuozzoLicensePage() {
  const { licenseId } = useParams<{ licenseId: string }>();
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");

  const [license, setLicense] = useState<VirtuozzoLicense | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);

  const loadLicense = async () => {
    if (!licenseId) return;
    try {
      setLoading(true);
      const data = await getVirtuozzoLicense(licenseId);
      setLicense(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLicense();
  }, [licenseId]);

  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Virtuozzo - {licenseId}</h1>
        <div style={styles.meta}>
          <span>IP: {license?.ip}</span>
          <span>Version: {license?.version}</span>
          <span>Containers: {license?.containerNumber}</span>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === "general" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("general")}
        >
          {t("tabs.general")}
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "tasks" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("tasks")}
        >
          {t("tabs.tasks")}
        </button>
      </div>

      {activeTab === "general" && (
        <GeneralTab licenseId={licenseId!} license={license} onRefresh={loadLicense} />
      )}
      {activeTab === "tasks" && <TasksTab licenseId={licenseId!} />}
    </div>
  );
}
