// ============================================================
// LICENSE DASHBOARD - Liste des types de licences
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ovhGet } from "../../services/api";
import type { LicenseCount } from "./license.types";

// ============================================================
// SERVICE LOCAL (ISOLÉ)
// ============================================================

async function getLicenseCounts(): Promise<LicenseCount[]> {
  const [windows, cpanel, plesk, sqlserver, virtuozzo, directadmin, cloudlinux] = await Promise.all([
    ovhGet<string[]>("/license/windows").catch(() => []),
    ovhGet<string[]>("/license/cpanel").catch(() => []),
    ovhGet<string[]>("/license/plesk").catch(() => []),
    ovhGet<string[]>("/license/sqlserver").catch(() => []),
    ovhGet<string[]>("/license/virtuozzo").catch(() => []),
    ovhGet<string[]>("/license/directadmin").catch(() => []),
    ovhGet<string[]>("/license/cloudlinux").catch(() => []),
  ]);
  return [
    { type: "windows", count: windows.length, icon: "🪟" },
    { type: "cpanel", count: cpanel.length, icon: "🎛️" },
    { type: "plesk", count: plesk.length, icon: "🔧" },
    { type: "sqlserver", count: sqlserver.length, icon: "🗄️" },
    { type: "virtuozzo", count: virtuozzo.length, icon: "📦" },
    { type: "directadmin", count: directadmin.length, icon: "⚙️" },
    { type: "cloudlinux", count: cloudlinux.length, icon: "☁️" },
  ];
}

// ============================================================
// STYLES INLINE (ISOLÉS)
// ============================================================

const styles = {
  dashboard: { padding: "var(--space-4)" },
  pageHeader: { marginBottom: "var(--space-6)" },
  title: { fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", margin: "0 0 var(--space-2) 0" },
  description: { color: "var(--color-text-secondary)", fontSize: "var(--font-size-md)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" },
  card: { display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", textDecoration: "none", transition: "all 0.2s ease" },
  icon: { fontSize: "var(--font-size-3xl)", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-tertiary)", borderRadius: "var(--radius-md)" },
  cardTitle: { fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", margin: "0 0 var(--space-1) 0" },
  count: { fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)", color: "var(--color-primary-500)" },
} as const;

// ============================================================
// COMPOSANT
// ============================================================

export default function LicenseDashboard() {
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");

  const [counts, setCounts] = useState<LicenseCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLicenseCounts().then((data) => {
      setCounts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>{t("dashboard.title")}</h1>
        <p style={styles.description}>{t("dashboard.description")}</p>
      </div>

      <div style={styles.grid}>
        {counts.map((item) => (
          <Link key={item.type} to={`/license/${item.type}`} style={styles.card}>
            <div style={styles.icon}>{item.icon}</div>
            <div>
              <h3 style={styles.cardTitle}>{t(`types.${item.type}`)}</h3>
              <span style={styles.count}>{item.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
