// ============================================================
// API TAB - Console de test API OVH
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCredentials, API_BASE } from "../utils";

// ============ COMPOSANT ============

/** Console interactive pour tester les endpoints de l'API OVH. */
export function ApiTab() {
  const { t } = useTranslation('home/api/index');

  // ---------- STATE ----------
  const [apiPath, setApiPath] = useState("/me");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiBody, setApiBody] = useState("");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ method: string; path: string; status: number }[]>([]);

  const credentials = getCredentials();

  // ---------- HANDLERS ----------
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

  // ---------- RENDER ----------
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
