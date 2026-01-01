// ============================================================
// EMAILS TAB - Scripts e-mail avec graphique Prometheus
// Conforme au pattern NAV3 standard
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { emailsService } from "./EmailsTab.service";
import "./EmailsTab.css";

// ============================================================
// TYPES
// ============================================================

interface Props {
  serviceName: string;
}

interface EmailInfo {
  state: "ok" | "blocked";
  bounce: string;
  maxPerDay: number;
  sent: number;
  sentToday: number;
  errors: number;
  total: number;
}

interface ChartDataPoint {
  date: string;
  timestamp: number;
  emails: number;
}

// ============================================================
// MODAL COMPONENT
// ============================================================

function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirmer",
  confirmVariant = "primary",
  loading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: "primary" | "danger" | "warning";
  loading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="emails-modal-overlay" onClick={onClose}>
      <div className="emails-modal-container" onClick={e => e.stopPropagation()}>
        <div className="emails-modal-header">
          <h3>{title}</h3>
          <button className="emails-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="emails-modal-body">{children}</div>
        <div className="emails-modal-footer">
          <button className="emails-btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          {onConfirm && (
            <button
              className={`emails-btn emails-btn-${confirmVariant}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROMETHEUS DATA FETCHER
// ============================================================

async function fetchPrometheusData(serviceName: string): Promise<ChartDataPoint[]> {
  try {
    const tokenData = await emailsService.getEmailMetricsToken(serviceName);
    if (!tokenData?.token || !tokenData?.endpoint) return [];

    const { token, endpoint } = tokenData;
    const now = new Date();
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const query = `sum without(cluster, statusCode, cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace((mailout_sendmails_count{service_name="${serviceName}"}), "mail", "sent", "", "")) OR label_replace(vector(0), "mail", "sent", "", "")`;

    const params = new URLSearchParams({
      query,
      start: start.toISOString(),
      end: now.toISOString(),
      step: "3600"
    });

    const response = await fetch(`${endpoint}/prometheus/api/v1/query_range?${params}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (data.status !== "success" || !data.data?.result?.length) return [];

    const values = data.data.result[0]?.values || [];
    const dailyMap = new Map<string, { timestamp: number; total: number }>();

    for (const [timestamp, value] of values) {
      const date = new Date(timestamp * 1000);
      const dayKey = date.toISOString().split("T")[0];
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, { timestamp: timestamp * 1000, total: 0 });
      }
      dailyMap.get(dayKey)!.total += parseFloat(value) || 0;
    }

    const sortedDays = Array.from(dailyMap.keys()).sort();
    return sortedDays.map(dayKey => {
      const { timestamp, total } = dailyMap.get(dayKey)!;
      return {
        date: new Date(timestamp).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
        timestamp,
        emails: Math.round(total)
      };
    });

  } catch (err) {
    return [];
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function EmailsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.emails");

  const [emailInfo, setEmailInfo] = useState<EmailInfo | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showBounceModal, setShowBounceModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [showErrorsModal, setShowErrorsModal] = useState(false);
  const [bounceEmail, setBounceEmail] = useState("");
  const [errorsList, setErrorsList] = useState<string[]>([]);

  // ---------- LOAD DATA ----------
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const info = await emailsService.getEmailQuota(serviceName).catch(() => null);
      if (info) {
        setEmailInfo({
          state: info.state === "blocked" ? "blocked" : "ok",
          bounce: info.email || "",
          maxPerDay: info.maxPerDay || 200,
          sent: info.sent || 0,
          sentToday: info.sentToday || 0,
          errors: info.bounce || 0,
          total: info.sent || 0
        });
        setBounceEmail(info.email || "");
      } else {
        setEmailInfo({ state: "ok", bounce: "", maxPerDay: 200, sent: 0, sentToday: 0, errors: 0, total: 0 });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  const loadChartData = useCallback(async () => {
    setChartLoading(true);
    setChartError(null);
    try {
      const data = await fetchPrometheusData(serviceName);
      if (data.length > 0) {
        setChartData(data);
      } else {
        setChartError(t("chart.noData"));
      }
    } catch {
      setChartError(t("chart.error"));
    } finally {
      setChartLoading(false);
    }
  }, [serviceName, t]);

  useEffect(() => { loadData(); loadChartData(); }, [loadData, loadChartData]);

  // ---------- ACTIONS ----------
  const handleChangeBounce = async () => {
    setActionLoading(true);
    try {
      await emailsService.updateEmailBounce(serviceName, bounceEmail);
      await loadData();
      setShowBounceModal(false);
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    setActionLoading(true);
    try {
      const newState = emailInfo?.state === "ok" ? "blocked" : "ok";
      await emailsService.updateEmailState(serviceName, newState);
      await loadData();
      setShowBlockModal(false);
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurge = async () => {
    setActionLoading(true);
    try {
      await emailsService.purgeEmails(serviceName);
      await loadData();
      setShowPurgeModal(false);
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleShowErrors = async () => {
    try {
      const bounces = await emailsService.getEmailBounces(serviceName).catch(() => []);
      setErrorsList(Array.isArray(bounces) ? bounces : []);
      setShowErrorsModal(true);
    } catch {
      setErrorsList([]);
      setShowErrorsModal(true);
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="emails-tab">
        <div className="emails-skeleton" />
      </div>
    );
  }

  const isBlocked = emailInfo?.state === "blocked";

  return (
    <div className="emails-tab">
      {/* TWO CARDS SIDE BY SIDE */}
      <div className="emails-cards">
        {/* CARD 1: Informations generales */}
        <div className="emails-card">
          <h4 className="emails-card-title">{t("card.general.title")}</h4>

          <div className="emails-card-row">
            <span className="emails-card-label">{t("card.general.state")}</span>
            <span className={`emails-badge ${isBlocked ? "emails-badge-error" : "emails-badge-success"}`}>
              {isBlocked ? t("badge.blocked") : t("badge.active")}
            </span>
          </div>

          <div className="emails-card-row">
            <span className="emails-card-label">{t("card.general.bounceEmail")}</span>
            <button className="emails-btn-outline emails-btn-sm" onClick={() => setShowBounceModal(true)}>
              {t("card.general.changeBounce")}
            </button>
          </div>

          <div className="emails-card-actions">
            <button className="emails-btn-outline" onClick={() => setShowBlockModal(true)}>
              {isBlocked ? t("actions.unblock") : t("actions.block")}
            </button>
          </div>
        </div>

        {/* CARD 2: Statistiques */}
        <div className="emails-card">
          <h4 className="emails-card-title">{t("card.stats.title")}</h4>

          <div className="emails-card-row">
            <span className="emails-card-label">{t("card.stats.total")}</span>
            <span className="emails-card-value">{emailInfo?.total?.toLocaleString() || 0}</span>
          </div>

          <div className="emails-card-row">
            <span className="emails-card-label">{t("card.stats.today")}</span>
            <span className="emails-card-value">{emailInfo?.sentToday || 0}</span>
          </div>

          <div className="emails-card-row">
            <span className="emails-card-label">{t("card.stats.errors")}</span>
            <span className={`emails-card-value ${(emailInfo?.errors || 0) > 0 ? "emails-text-error" : ""}`}>
              {emailInfo?.errors || 0}
            </span>
          </div>

          <div className="emails-card-actions-right">
            <button className="emails-btn-outline emails-btn-sm" onClick={() => setShowPurgeModal(true)}>
              {t("actions.purge")}
            </button>
            <button className="emails-btn-outline emails-btn-sm" onClick={handleShowErrors}>
              {t("actions.showErrors")}
            </button>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="emails-chart-section">
        <h4 className="emails-chart-title">{t("chart.title")}</h4>
        <div className="emails-chart-container">
          {chartLoading ? (
            <div className="emails-chart-loading">
              <div className="emails-spinner" />
              <span>{t("chart.loading")}</span>
            </div>
          ) : chartError || chartData.length === 0 ? (
            <div className="emails-chart-empty">
              <span className="emails-chart-empty-icon">📊</span>
              <span>{chartError || t("chart.noData")}</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} domain={[0, 'auto']} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "12px" }} formatter={(value: number) => [`${value} e-mail(s)`, t("chart.sent")]} />
                <Line type="monotone" dataKey="emails" stroke="#0050D7" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#0050D7" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        {chartData.length > 0 && (
          <div className="emails-chart-legend">
            <span className="emails-legend-item">
              <span className="emails-legend-color"></span>
              {t("chart.sent")}
            </span>
          </div>
        )}
      </div>

      {/* INFO BANNER */}
      <div className="emails-info-banner">
        <span className="emails-info-icon">ℹ</span>
        <span>{t("info.scripts")}</span>
      </div>

      {/* MODALS */}
      <Modal isOpen={showBounceModal} onClose={() => setShowBounceModal(false)} title={t("modal.bounce.title")} onConfirm={handleChangeBounce} confirmText={t("modal.save")} loading={actionLoading}>
        <div className="emails-form-group">
          <label>{t("modal.bounce.label")}</label>
          <input type="email" className="emails-form-input" value={bounceEmail} onChange={e => setBounceEmail(e.target.value)} placeholder="email@exemple.com" />
        </div>
      </Modal>

      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title={isBlocked ? t("actions.unblock") : t("actions.block")} onConfirm={handleToggleBlock} confirmText={isBlocked ? t("actions.unblock") : t("actions.block")} confirmVariant={isBlocked ? "primary" : "warning"} loading={actionLoading}>
        <p>{isBlocked ? t("modal.unblock.text") : t("modal.block.text")}</p>
      </Modal>

      <Modal isOpen={showPurgeModal} onClose={() => setShowPurgeModal(false)} title={t("modal.purge.title")} onConfirm={handlePurge} confirmText={t("actions.purge")} confirmVariant="danger" loading={actionLoading}>
        <p>{t("modal.purge.text")}</p>
      </Modal>

      <Modal isOpen={showErrorsModal} onClose={() => setShowErrorsModal(false)} title={t("modal.errors.title")}>
        {errorsList.length === 0 ? (
          <p className="emails-text-muted">{t("modal.errors.empty")}</p>
        ) : (
          <ul className="emails-errors-list">
            {errorsList.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        )}
      </Modal>
    </div>
  );
}

export default EmailsTab;
