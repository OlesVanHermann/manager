// ============================================================
// HOSTING TAB: EMAILS - Scripts e-mail (Target SVG Match)
// Avec API Prometheus pour le graphique
// ============================================================
import "./emails.css";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { hostingService } from "../../../../../../services/web-cloud.hosting";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          {onConfirm && (
            <button 
              className={`btn btn-${confirmVariant}`} 
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
async function fetchPrometheusData(
  serviceName: string
): Promise<ChartDataPoint[]> {
  try {
    // 1. Get metrics token
    const tokenData = await hostingService.getEmailMetricsToken(serviceName);
    if (!tokenData || !tokenData.token || !tokenData.endpoint) {
      console.warn("No metrics token available");
      return [];
    }

    const { token, endpoint } = tokenData;

    // 2. Build Prometheus query
    const now = new Date();
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    
    const query = `sum without(cluster, statusCode, cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace((mailout_sendmails_count{service_name="${serviceName}"}), "mail", "sent", "", "")) OR label_replace(vector(0), "mail", "sent", "", "")`;

    const params = new URLSearchParams({
      query,
      start: start.toISOString(),
      end: now.toISOString(),
      step: "3600" // 1 hour in seconds
    });

    // 3. Fetch from Prometheus
    const response = await fetch(`${endpoint}/prometheus/api/v1/query_range?${params}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error("Prometheus API error:", response.status);
      return [];
    }

    const data = await response.json();

    // 4. Parse Prometheus response
    if (data.status !== "success" || !data.data?.result?.length) {
      return [];
    }

    const values = data.data.result[0]?.values || [];
    
    // 5. Aggregate by day (sum hourly values)
    const dailyMap = new Map<string, { timestamp: number; total: number }>();
    
    for (const [timestamp, value] of values) {
      const date = new Date(timestamp * 1000);
      const dayKey = date.toISOString().split("T")[0];
      
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, { timestamp: timestamp * 1000, total: 0 });
      }
      dailyMap.get(dayKey)!.total += parseFloat(value) || 0;
    }

    // 6. Convert to chart format
    const chartData: ChartDataPoint[] = [];
    const sortedDays = Array.from(dailyMap.keys()).sort();
    
    for (const dayKey of sortedDays) {
      const { timestamp, total } = dailyMap.get(dayKey)!;
      const date = new Date(timestamp);
      chartData.push({
        date: date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
        timestamp,
        emails: Math.round(total)
      });
    }

    return chartData;

  } catch (err) {
    console.error("Error fetching Prometheus data:", err);
    return [];
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function EmailsTab({ serviceName }: Props) {
  const [emailInfo, setEmailInfo] = useState<EmailInfo | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal states
  const [showBounceModal, setShowBounceModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [showErrorsModal, setShowErrorsModal] = useState(false);
  const [bounceEmail, setBounceEmail] = useState("");
  const [errorsList, setErrorsList] = useState<string[]>([]);

  // ============================================================
  // DATA LOADING
  // ============================================================
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load email info
      const info = await hostingService.getEmailQuota(serviceName).catch(() => null);
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
        setEmailInfo({
          state: "ok",
          bounce: "",
          maxPerDay: 200,
          sent: 0,
          sentToday: 0,
          errors: 0,
          total: 0
        });
      }

    } catch (err) {
      console.error("Error loading email data:", err);
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
        setChartError("Aucune donnée disponible");
      }
    } catch (err) {
      setChartError("Erreur lors du chargement des métriques");
    } finally {
      setChartLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { 
    loadData(); 
    loadChartData();
  }, [loadData, loadChartData]);

  // ============================================================
  // ACTIONS
  // ============================================================
  const handleChangeBounce = async () => {
    setActionLoading(true);
    try {
      await hostingService.updateEmailBounce(serviceName, bounceEmail);
      await loadData();
      setShowBounceModal(false);
    } catch (err) {
      alert("Erreur: " + String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    setActionLoading(true);
    try {
      const newState = emailInfo?.state === "ok" ? "blocked" : "ok";
      await hostingService.updateEmailState(serviceName, newState);
      await loadData();
      setShowBlockModal(false);
    } catch (err) {
      alert("Erreur: " + String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurge = async () => {
    setActionLoading(true);
    try {
      await hostingService.purgeEmails(serviceName);
      await loadData();
      setShowPurgeModal(false);
    } catch (err) {
      alert("Erreur: " + String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleShowErrors = async () => {
    try {
      const bounces = await hostingService.getEmailBounces(serviceName).catch(() => []);
      setErrorsList(Array.isArray(bounces) ? bounces : []);
      setShowErrorsModal(true);
    } catch (err) {
      setErrorsList([]);
      setShowErrorsModal(true);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="emails-tab">
        <div className="loading-skeleton">
          <div className="skeleton-cards">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
          <div className="skeleton-chart" />
        </div>
      </div>
    );
  }

  const isBlocked = emailInfo?.state === "blocked";

  return (
    <div className="emails-tab">
      {/* TWO CARDS SIDE BY SIDE */}
      <div className="emails-cards">
        {/* CARD 1: Informations générales */}
        <div className="emails-card">
          <h4 className="card-title">Informations générales</h4>
          
          <div className="card-row">
            <span className="card-label">État du service :</span>
            <span className={`badge ${isBlocked ? "error" : "success"}`}>
              {isBlocked ? "bloqué" : "actif"}
            </span>
          </div>

          <div className="card-row">
            <span className="card-label">Rapport d'erreurs à :</span>
            <button className="btn btn-outline btn-sm" onClick={() => setShowBounceModal(true)}>
              Changer le destinataire
            </button>
          </div>

          <div className="card-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setShowBlockModal(true)}
            >
              {isBlocked ? "Débloquer l'envoi" : "Bloquer l'envoi"}
            </button>
          </div>
        </div>

        {/* CARD 2: Statistiques */}
        <div className="emails-card">
          <h4 className="card-title">Statistiques</h4>
          
          <div className="card-row">
            <span className="card-label">Total des e-mails envoyés :</span>
            <span className="card-value">{emailInfo?.total?.toLocaleString() || 0}</span>
          </div>

          <div className="card-row">
            <span className="card-label">E-mails envoyés aujourd'hui :</span>
            <span className="card-value">{emailInfo?.sentToday || 0}</span>
          </div>

          <div className="card-row">
            <span className="card-label">Total des e-mails en erreur :</span>
            <span className={`card-value ${(emailInfo?.errors || 0) > 0 ? "text-error" : ""}`}>
              {emailInfo?.errors || 0}
            </span>
          </div>

          <div className="card-actions-right">
            <button className="btn btn-outline btn-sm" onClick={() => setShowPurgeModal(true)}>
              Purger les e-mails
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleShowErrors}>
              E-mails en erreur
            </button>
          </div>
        </div>
      </div>

      {/* CHART: Historique des e-mails envoyés */}
      <div className="emails-chart-section">
        <h4 className="chart-title">Historique des e-mails envoyés</h4>
        <div className="chart-container">
          {chartLoading ? (
            <div className="chart-loading">
              <div className="spinner" />
              <span>Chargement des métriques...</span>
            </div>
          ) : chartError || chartData.length === 0 ? (
            <div className="chart-empty">
              <span className="chart-empty-icon">📊</span>
              <span>{chartError || "Aucune donnée disponible pour les 30 derniers jours"}</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                  domain={[0, 'auto']}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "#FFFFFF", 
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                  formatter={(value: number) => [`${value} e-mail(s)`, "Envoyés"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="emails" 
                  stroke="#0050D7" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#0050D7" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        {chartData.length > 0 && (
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color"></span>
              E-mails envoyés
            </span>
          </div>
        )}
      </div>

      {/* INFO BANNER */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <span>Cette page ne concerne que les e-mails envoyés depuis des scripts CGI/PERL/PHP.</span>
      </div>

      {/* MODAL: Changer destinataire */}
      <Modal
        isOpen={showBounceModal}
        onClose={() => setShowBounceModal(false)}
        title="Changer le destinataire des rapports"
        onConfirm={handleChangeBounce}
        confirmText="Enregistrer"
        loading={actionLoading}
      >
        <div className="form-group">
          <label>Adresse e-mail de rapport d'erreurs :</label>
          <input
            type="email"
            className="form-input"
            value={bounceEmail}
            onChange={e => setBounceEmail(e.target.value)}
            placeholder="email@exemple.com"
          />
        </div>
      </Modal>

      {/* MODAL: Bloquer/Débloquer */}
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={isBlocked ? "Débloquer l'envoi" : "Bloquer l'envoi"}
        onConfirm={handleToggleBlock}
        confirmText={isBlocked ? "Débloquer" : "Bloquer"}
        confirmVariant={isBlocked ? "primary" : "warning"}
        loading={actionLoading}
      >
        <p>
          {isBlocked 
            ? "Voulez-vous débloquer l'envoi d'e-mails depuis vos scripts ?"
            : "Voulez-vous bloquer l'envoi d'e-mails depuis vos scripts ? Les e-mails en file d'attente seront conservés."
          }
        </p>
      </Modal>

      {/* MODAL: Purger */}
      <Modal
        isOpen={showPurgeModal}
        onClose={() => setShowPurgeModal(false)}
        title="Purger les e-mails"
        onConfirm={handlePurge}
        confirmText="Purger"
        confirmVariant="danger"
        loading={actionLoading}
      >
        <p>Voulez-vous vraiment supprimer tous les e-mails en file d'attente ? Cette action est irréversible.</p>
      </Modal>

      {/* MODAL: Erreurs */}
      <Modal
        isOpen={showErrorsModal}
        onClose={() => setShowErrorsModal(false)}
        title="E-mails en erreur"
      >
        {errorsList.length === 0 ? (
          <p className="text-muted">Aucun e-mail en erreur.</p>
        ) : (
          <ul className="errors-list">
            {errorsList.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}

export default EmailsTab;
