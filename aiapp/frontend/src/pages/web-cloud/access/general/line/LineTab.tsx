// ============================================================
// LINE TAB - Container avec NAV4 (Statut, Diagnostic, Stats, Alertes)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { lineService } from "./LineTab.service";
import type { LineStatus as LineStatusType, LineDiagnostic as LineDiagnosticType, LineStats as LineStatsType, LineAlert } from "../connections.types";
import { LineStatus } from "./LineStatus";
import { LineDiagnostic } from "./LineDiagnostic";
import { LineStats } from "./LineStats";
import { LineAlerts } from "./LineAlerts";
import "./LineTab.css";

interface LineTabProps {
  connectionId: string;
}

type SubTabId = "status" | "diagnostic" | "stats" | "alerts";

export function LineTab({ connectionId }: LineTabProps) {
  const { t } = useTranslation("web-cloud/access/connections/line");

  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("status");
  const [lineStatus, setLineStatus] = useState<LineStatusType | null>(null);
  const [diagnostic, setDiagnostic] = useState<LineDiagnosticType | null>(null);
  const [stats, setStats] = useState<LineStatsType | null>(null);
  const [alerts, setAlerts] = useState<LineAlert[]>([]);
  const [smsCredits, setSmsCredits] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [diagLoading, setDiagLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger le statut ligne au montage
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const status = await lineService.getLineStatus(connectionId);
        setLineStatus(status);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  // Charger les données des sous-tabs à la demande
  useEffect(() => {
    if (activeSubTab === "diagnostic" && !diagnostic) {
      setDiagLoading(true);
      lineService.getDiagnostic(connectionId)
        .then(setDiagnostic)
        .catch(() => {})
        .finally(() => setDiagLoading(false));
    }
    if (activeSubTab === "stats" && !stats) {
      setStatsLoading(true);
      lineService.getLineStats(connectionId)
        .then(setStats)
        .catch(() => {})
        .finally(() => setStatsLoading(false));
    }
    if (activeSubTab === "alerts" && alerts.length === 0) {
      setAlertsLoading(true);
      Promise.all([
        lineService.getLineAlerts(connectionId),
        lineService.getSmsCredits?.() || Promise.resolve(undefined),
      ])
        .then(([alertsData, credits]) => {
          setAlerts(alertsData);
          setSmsCredits(credits);
        })
        .catch(() => {})
        .finally(() => setAlertsLoading(false));
    }
  }, [activeSubTab, connectionId, diagnostic, stats, alerts.length]);

  const subTabs: { id: SubTabId; labelKey: string }[] = [
    { id: "status", labelKey: "tabs.status" },
    { id: "diagnostic", labelKey: "tabs.diagnostic" },
    { id: "stats", labelKey: "tabs.stats" },
    { id: "alerts", labelKey: "tabs.alerts" },
  ];

  // Handlers pour LineStatus
  const handleResync = useCallback(async () => {
    try {
      await lineService.resyncLine(connectionId);
      const status = await lineService.getLineStatus(connectionId);
      setLineStatus(status);
    } catch (err) {
    }
  }, [connectionId]);

  const handleReset = useCallback(async () => {
    try {
      await lineService.resetLine?.(connectionId);
      const status = await lineService.getLineStatus(connectionId);
      setLineStatus(status);
    } catch (err) {
    }
  }, [connectionId]);

  // Handlers pour LineDiagnostic
  const handleRunDiagnostic = useCallback(async () => {
    try {
      setDiagLoading(true);
      const result = await lineService.runDiagnostic(connectionId);
      setDiagnostic(result);
    } catch (err) {
    } finally {
      setDiagLoading(false);
    }
  }, [connectionId]);

  const handleViewHistory = useCallback(() => {
    // TODO: Ouvrir modal historique ou naviguer
  }, []);

  // Handlers pour LineStats
  const handlePeriodChange = useCallback(async (period: string) => {
    try {
      setStatsLoading(true);
      const newStats = await lineService.getLineStats(connectionId, period);
      setStats(newStats);
    } catch (err) {
    } finally {
      setStatsLoading(false);
    }
  }, [connectionId]);

  const handleExport = useCallback(() => {
    // TODO: Télécharger CSV
  }, []);

  // Handlers pour LineAlerts
  const handleAddAlert = useCallback(() => {
    // TODO: Ouvrir modal ajout
  }, []);

  const handleEditAlert = useCallback((alert: LineAlert) => {
    // TODO: Ouvrir modal édition
  }, []);

  const handleDeleteAlert = useCallback(async (alertId: string) => {
    try {
      await lineService.deleteLineAlert?.(connectionId, alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
    }
  }, [connectionId]);

  const handleReloadSms = useCallback(() => {
    // TODO: Naviguer vers page achat SMS
    window.open("/billing/sms", "_blank");
  }, []);

  if (loading) {
    return (
      <div className="line-tab">
        <div className="line-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !lineStatus) {
    return (
      <div className="line-tab">
        <div className="line-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="line-tab">
      {/* NAV4 */}
      <div className="line-nav4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`line-nav4-btn ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="line-content">
        {activeSubTab === "status" && (
          <LineStatus
            connectionId={connectionId}
            lineStatus={lineStatus}
            onResync={handleResync}
            onReset={handleReset}
          />
        )}

        {activeSubTab === "diagnostic" && (
          <LineDiagnostic
            connectionId={connectionId}
            diagnostic={diagnostic}
            loading={diagLoading}
            onRunDiagnostic={handleRunDiagnostic}
            onViewHistory={handleViewHistory}
          />
        )}

        {activeSubTab === "stats" && (
          <LineStats
            connectionId={connectionId}
            stats={stats}
            loading={statsLoading}
            onPeriodChange={handlePeriodChange}
            onExport={handleExport}
          />
        )}

        {activeSubTab === "alerts" && (
          <LineAlerts
            connectionId={connectionId}
            alerts={alerts}
            smsCredits={smsCredits}
            loading={alertsLoading}
            onAddAlert={handleAddAlert}
            onEditAlert={handleEditAlert}
            onDeleteAlert={handleDeleteAlert}
            onReloadSms={handleReloadSms}
          />
        )}
      </div>
    </div>
  );
}
