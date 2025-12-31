// ============================================================
// SUB-TAB - Audit (Logs d'audit et activité)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface AuditTabProps {
  domain?: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  target: string;
  targetType: "account" | "settings" | "security" | "resource";
  details: string;
  ipAddress: string;
  result: "success" | "failure";
}

/** Sous-onglet Audit - Historique des actions et modifications. */
export default function AuditTab({ domain }: AuditTabProps) {
  const { t } = useTranslation("web-cloud/emails/advanced");

  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterResult, setFilterResult] = useState<"all" | "success" | "failure">("all");
  const [dateRange, setDateRange] = useState<"24h" | "7d" | "30d" | "all">("7d");

  // Mock data - remplacer par appel API
  const logs: AuditLog[] = useMemo(() => [
    {
      id: "1",
      timestamp: "2024-01-15T14:30:00Z",
      action: "account_create",
      actor: "admin@example.com",
      target: "new.user@example.com",
      targetType: "account",
      details: "Création d'un nouveau compte email",
      ipAddress: "192.168.1.100",
      result: "success",
    },
    {
      id: "2",
      timestamp: "2024-01-15T12:15:00Z",
      action: "password_change",
      actor: "user@example.com",
      target: "user@example.com",
      targetType: "account",
      details: "Changement de mot de passe",
      ipAddress: "82.64.12.34",
      result: "success",
    },
    {
      id: "3",
      timestamp: "2024-01-15T10:00:00Z",
      action: "login_failed",
      actor: "unknown",
      target: "admin@example.com",
      targetType: "security",
      details: "Tentative de connexion échouée (mot de passe incorrect)",
      ipAddress: "45.33.22.11",
      result: "failure",
    },
    {
      id: "4",
      timestamp: "2024-01-14T16:45:00Z",
      action: "settings_update",
      actor: "admin@example.com",
      target: "Antispam settings",
      targetType: "settings",
      details: "Modification du niveau antispam: medium → high",
      ipAddress: "192.168.1.100",
      result: "success",
    },
    {
      id: "5",
      timestamp: "2024-01-14T09:30:00Z",
      action: "account_delete",
      actor: "admin@example.com",
      target: "old.user@example.com",
      targetType: "account",
      details: "Suppression du compte email",
      ipAddress: "192.168.1.100",
      result: "success",
    },
    {
      id: "6",
      timestamp: "2024-01-13T11:00:00Z",
      action: "resource_create",
      actor: "admin@example.com",
      target: "salle-b@example.com",
      targetType: "resource",
      details: "Création d'une nouvelle salle de réunion",
      ipAddress: "192.168.1.100",
      result: "success",
    },
  ], []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filterAction !== "all" && log.action !== filterAction) {
        return false;
      }
      if (filterResult !== "all" && log.result !== filterResult) {
        return false;
      }
      // Date filtering would be done here with actual dates
      return true;
    });
  }, [logs, filterAction, filterResult]);

  const handleExport = () => {
    console.log("Export audit logs");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      account_create: "Création compte",
      account_delete: "Suppression compte",
      password_change: "Changement mot de passe",
      login_failed: "Connexion échouée",
      login_success: "Connexion réussie",
      settings_update: "Modification paramètres",
      resource_create: "Création ressource",
      resource_delete: "Suppression ressource",
    };
    return labels[action] || action;
  };

  const getTargetTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      account: "👤",
      settings: "⚙",
      security: "🔒",
      resource: "🏢",
    };
    return icons[type] || "📄";
  };

  return (
    <div className="audit-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <div className="filter-chips">
            <button
              className={`filter-chip ${dateRange === "24h" ? "active" : ""}`}
              onClick={() => setDateRange("24h")}
            >
              24h
            </button>
            <button
              className={`filter-chip ${dateRange === "7d" ? "active" : ""}`}
              onClick={() => setDateRange("7d")}
            >
              7 jours
            </button>
            <button
              className={`filter-chip ${dateRange === "30d" ? "active" : ""}`}
              onClick={() => setDateRange("30d")}
            >
              30 jours
            </button>
            <button
              className={`filter-chip ${dateRange === "all" ? "active" : ""}`}
              onClick={() => setDateRange("all")}
            >
              Tout
            </button>
          </div>
        </div>
        <div className="emails-toolbar-right">
          <select
            className="filter-select"
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value as "all" | "success" | "failure")}
          >
            <option value="all">{t("audit.filters.allResults")}</option>
            <option value="success">{t("audit.filters.success")}</option>
            <option value="failure">{t("audit.filters.failure")}</option>
          </select>
          <button className="btn btn-outline" onClick={handleExport}>
            ↓ {t("audit.actions.export")}
          </button>
        </div>
      </div>

      {/* Logs table */}
      {filteredLogs.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📋</div>
          <h3 className="emails-empty-title">{t("audit.empty.title")}</h3>
          <p className="emails-empty-text">{t("audit.empty.description")}</p>
        </div>
      ) : (
        <table className="emails-table audit-table">
          <thead>
            <tr>
              <th>{t("audit.table.date")}</th>
              <th>{t("audit.table.action")}</th>
              <th>{t("audit.table.actor")}</th>
              <th>{t("audit.table.target")}</th>
              <th>{t("audit.table.ip")}</th>
              <th>{t("audit.table.result")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className={`audit-row ${log.result}`}>
                <td>
                  <span className="audit-date">{formatDate(log.timestamp)}</span>
                </td>
                <td>
                  <div className="audit-action">
                    <span className="action-label">{getActionLabel(log.action)}</span>
                    <span className="action-details">{log.details}</span>
                  </div>
                </td>
                <td>
                  <span className="audit-actor">{log.actor}</span>
                </td>
                <td>
                  <div className="audit-target">
                    <span className="target-icon">{getTargetTypeIcon(log.targetType)}</span>
                    <span className="target-name">{log.target}</span>
                  </div>
                </td>
                <td>
                  <code className="audit-ip">{log.ipAddress}</code>
                </td>
                <td>
                  <span className={`status-badge ${log.result === "success" ? "ok" : "suspended"}`}>
                    {log.result === "success" ? "✓" : "✗"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
