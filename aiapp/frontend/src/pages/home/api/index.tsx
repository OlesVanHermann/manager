// ============================================================
// DEV PAGE - Playground API
// 2 Tabs: API, Paramètres avancés
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhCredentials, OvhUser } from "../../../types/auth.types";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";
const API_BASE = "/api/ovh";

interface DevProps {
  initialTab?: string;
}

const tabIdMap: Record<string, string> = {
  "api-console": "api",
  "api-advanced": "advanced",
};

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

function getUser(): OvhUser | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export default function Dev({ initialTab = "api" }: DevProps) {
  const { t } = useTranslation('home/api/index');
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "api", label: t('tabs.api') },
    { id: "advanced", label: t('tabs.advanced') },
  ];

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(t => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  return (
    <div className="dev-page">
      <div className="api-header">
        <div className="api-header-content">
          <h1>{t('title')}</h1>
          <p className="api-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://api.ovh.com/console" target="_blank" rel="noopener noreferrer" className="guides-link">
          {t('consoleLink')}
        </a>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "api" && <ApiTab />}
        {activeTab === "advanced" && <AdvancedTab />}
      </div>
    </div>
  );
}

// ============================================================
// API TAB - Console de test API
// ============================================================
function ApiTab() {
  const { t } = useTranslation('home/api/index');
  const [apiPath, setApiPath] = useState("/me");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiBody, setApiBody] = useState("");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ method: string; path: string; status: number }[]>([]);

  const credentials = getCredentials();

  const testApi = async () => {
    if (!credentials) {
      setApiError(t('errors.notAuthenticated'));
      return;
    }

    setApiLoading(true);
    setApiError(null);
    setApiResponse("");

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Ovh-App-Key": credentials.appKey,
        "X-Ovh-App-Secret": credentials.appSecret,
      };

      if (credentials.consumerKey) {
        headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
      }

      const options: RequestInit = { method: apiMethod, headers };
      if (apiBody && (apiMethod === "POST" || apiMethod === "PUT")) {
        options.body = apiBody;
      }

      const response = await fetch(`${API_BASE}${apiPath}`, options);
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));

      setHistory(prev => [{ method: apiMethod, path: apiPath, status: response.status }, ...prev.slice(0, 9)]);

      if (!response.ok) {
        setApiError(`HTTP ${response.status}: ${data.message || response.statusText}`);
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : t('errors.unknown'));
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="api-tab">
      <div className="api-tester">
        <div className="api-input-row">
          <select value={apiMethod} onChange={(e) => setApiMethod(e.target.value)} className="api-method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            value={apiPath}
            onChange={(e) => setApiPath(e.target.value)}
            placeholder="/me"
            className="api-path"
          />
          <button onClick={testApi} disabled={apiLoading} className="btn btn-primary">
            {apiLoading ? "..." : t('api.execute')}
          </button>
        </div>

        {(apiMethod === "POST" || apiMethod === "PUT") && (
          <div className="api-body-section">
            <label>{t('api.requestBody')}</label>
            <textarea
              value={apiBody}
              onChange={(e) => setApiBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="api-body"
              rows={4}
            />
          </div>
        )}

        <div className="api-shortcuts">
          <span>{t('api.shortcuts')}:</span>
          <button onClick={() => setApiPath("/me")}>/me</button>
          <button onClick={() => setApiPath("/me/bill")}>/me/bill</button>
          <button onClick={() => setApiPath("/me/order")}>/me/order</button>
          <button onClick={() => setApiPath("/services")}>/services</button>
          <button onClick={() => setApiPath("/domain")}>/domain</button>
          <button onClick={() => setApiPath("/vps")}>/vps</button>
          <button onClick={() => setApiPath("/hosting/web")}>/hosting/web</button>
          <button onClick={() => setApiPath("/me/supportLevel")}>/me/supportLevel</button>
          <button onClick={() => setApiPath("/me/payment/method")}>/me/payment/method</button>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        {apiResponse && (
          <div className="api-response-section">
            <div className="api-response-header">
              <span>{t('api.response')}</span>
              <button className="btn btn-sm btn-outline" onClick={() => navigator.clipboard.writeText(apiResponse)}>{t('api.copy')}</button>
            </div>
            <pre className="api-response">{apiResponse}</pre>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="api-history">
          <h4>{t('api.recentHistory')}</h4>
          <div className="history-list">
            {history.map((item, idx) => (
              <div key={idx} className="history-item" onClick={() => { setApiMethod(item.method); setApiPath(item.path); }}>
                <span className={`method-badge method-${item.method.toLowerCase()}`}>{item.method}</span>
                <span className="history-path">{item.path}</span>
                <span className={`status-badge ${item.status < 400 ? "badge-success" : "badge-error"}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="api-docs">
        <h4>{t('api.documentation')}</h4>
        <div className="docs-links">
          <a href="https://api.ovh.com/console/" target="_blank" rel="noopener noreferrer">{t('api.links.console')}</a>
          <a href="https://docs.ovh.com/fr/api/" target="_blank" rel="noopener noreferrer">{t('api.links.docs')}</a>
          <a href="https://api.ovh.com/1.0/me.json" target="_blank" rel="noopener noreferrer">{t('api.links.schema')}</a>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADVANCED TAB - Paramètres avancés
// ============================================================
function AdvancedTab() {
  const { t } = useTranslation('home/api/index');
  const credentials = getCredentials();
  const user = getUser();

  const clearSession = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("ovh_user");
    window.location.reload();
  };

  return (
    <div className="advanced-tab">
      {/* Session Info */}
      <div className="dev-section">
        <h3>{t('advanced.session.title')}</h3>
        <div className="dev-card">
          <div className="dev-grid">
            <div className="dev-field">
              <label>{t('advanced.session.authenticated')}</label>
              <span className={credentials ? "badge badge-success" : "badge badge-error"}>
                {credentials ? t('advanced.yes') : t('advanced.no')}
              </span>
            </div>
            <div className="dev-field">
              <label>{t('advanced.session.appKey')}</label>
              <code>{credentials?.appKey || "-"}</code>
            </div>
            <div className="dev-field">
              <label>{t('advanced.session.consumerKey')}</label>
              <code>{credentials?.consumerKey ? `${credentials.consumerKey.substring(0, 12)}...` : "-"}</code>
            </div>
          </div>
          <button onClick={clearSession} className="btn btn-danger btn-sm">{t('advanced.session.clear')}</button>
        </div>
      </div>

      {/* User Info */}
      <div className="dev-section">
        <h3>{t('advanced.user.title')}</h3>
        <div className="dev-card">
          {user ? (
            <div className="dev-grid">
              <div className="dev-field">
                <label>{t('advanced.user.nichandle')}</label>
                <code>{user.nichandle}</code>
              </div>
              <div className="dev-field">
                <label>{t('advanced.user.email')}</label>
                <code>{user.email}</code>
              </div>
              <div className="dev-field">
                <label>{t('advanced.user.name')}</label>
                <span>{user.firstname} {user.name}</span>
              </div>
              <div className="dev-field">
                <label>{t('advanced.user.customerCode')}</label>
                <code>{user.customerCode || "-"}</code>
              </div>
              <div className="dev-field">
                <label>{t('advanced.user.supportLevel')}</label>
                <span>{user.supportLevel?.level || "-"}</span>
              </div>
              <div className="dev-field">
                <label>{t('advanced.user.authMethod')}</label>
                <code>{user.auth?.method || "-"}</code>
              </div>
              <div className="dev-field">
                <label>{t('advanced.user.isTrusted')}</label>
                <span className={user.isTrusted ? "badge badge-success" : "badge badge-neutral"}>
                  {user.isTrusted ? t('advanced.yes') : t('advanced.no')}
                </span>
              </div>
              <div className="dev-field">
                <label>{t('advanced.user.organisation')}</label>
                <span>{user.organisation || "-"}</span>
              </div>
            </div>
          ) : (
            <p className="dev-empty">{t('advanced.user.empty')}</p>
          )}
        </div>
      </div>

      {/* Raw Data */}
      <div className="dev-section">
        <h3>{t('advanced.rawData.title')}</h3>
        <div className="dev-card">
          <details>
            <summary>{t('advanced.rawData.credentials')}</summary>
            <pre>{credentials ? JSON.stringify(credentials, null, 2) : "null"}</pre>
          </details>
          <details>
            <summary>{t('advanced.rawData.user')}</summary>
            <pre>{user ? JSON.stringify(user, null, 2) : "null"}</pre>
          </details>
        </div>
      </div>

      {/* Environment */}
      <div className="dev-section">
        <h3>{t('advanced.environment.title')}</h3>
        <div className="dev-card">
          <div className="dev-grid">
            <div className="dev-field">
              <label>{t('advanced.environment.apiBase')}</label>
              <code>{API_BASE}</code>
            </div>
            <div className="dev-field">
              <label>{t('advanced.environment.userAgent')}</label>
              <code style={{ fontSize: "0.75rem" }}>{navigator.userAgent.substring(0, 50)}...</code>
            </div>
            <div className="dev-field">
              <label>{t('advanced.environment.timestamp')}</label>
              <code>{new Date().toISOString()}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
