import { useState, useEffect } from "react";
import type { OvhCredentials, OvhUser } from "../types/auth.types";

const STORAGE_KEY = "ovh_credentials";
const API_BASE = "/api/ovh";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function getUser(): OvhUser | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export default function Dev() {
  const [apiPath, setApiPath] = useState("/me");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const credentials = getCredentials();
  const user = getUser();

  const testApi = async () => {
    if (!credentials) {
      setApiError("Non authentifie");
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

      const response = await fetch(`${API_BASE}${apiPath}`, {
        method: apiMethod,
        headers,
      });

      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        setApiError(`HTTP ${response.status}: ${data.message || response.statusText}`);
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setApiLoading(false);
    }
  };

  const clearSession = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("ovh_user");
    window.location.reload();
  };

  return (
    <div className="dev-page">
      <h1>Mode Developpeur</h1>
      <p className="dev-subtitle">Outils de debug et test API</p>

      {/* Session Info */}
      <div className="dev-section">
        <h2>Informations de session</h2>
        <div className="dev-card">
          <div className="dev-grid">
            <div className="dev-field">
              <label>Authentifie</label>
              <span className={credentials ? "badge badge-success" : "badge badge-error"}>
                {credentials ? "Oui" : "Non"}
              </span>
            </div>
            <div className="dev-field">
              <label>App Key</label>
              <code>{credentials?.appKey || "-"}</code>
            </div>
            <div className="dev-field">
              <label>Consumer Key</label>
              <code>{credentials?.consumerKey ? `${credentials.consumerKey.substring(0, 12)}...` : "-"}</code>
            </div>
          </div>
          <button onClick={clearSession} className="btn btn-danger btn-sm">
            Effacer la session
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="dev-section">
        <h2>Informations utilisateur</h2>
        <div className="dev-card">
          {user ? (
            <div className="dev-grid">
              <div className="dev-field">
                <label>Nichandle</label>
                <code>{user.nichandle}</code>
              </div>
              <div className="dev-field">
                <label>Email</label>
                <code>{user.email}</code>
              </div>
              <div className="dev-field">
                <label>Nom</label>
                <span>{user.firstname} {user.name}</span>
              </div>
              <div className="dev-field">
                <label>Code client</label>
                <code>{user.customerCode || "-"}</code>
              </div>
              <div className="dev-field">
                <label>Support Level</label>
                <span>{user.supportLevel?.level || "-"}</span>
              </div>
              <div className="dev-field">
                <label>Auth Method</label>
                <code>{user.auth?.method || "-"}</code>
              </div>
              <div className="dev-field">
                <label>Is Trusted</label>
                <span className={user.isTrusted ? "badge badge-success" : "badge badge-neutral"}>
                  {user.isTrusted ? "Oui" : "Non"}
                </span>
              </div>
              <div className="dev-field">
                <label>Organisation</label>
                <span>{user.organisation || "-"}</span>
              </div>
            </div>
          ) : (
            <p className="dev-empty">Aucun utilisateur charge</p>
          )}
        </div>
      </div>

      {/* API Tester */}
      <div className="dev-section">
        <h2>Test API OVH</h2>
        <div className="dev-card">
          <div className="api-tester">
            <div className="api-input-row">
              <select 
                value={apiMethod} 
                onChange={(e) => setApiMethod(e.target.value)}
                className="api-method"
              >
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
              <button 
                onClick={testApi} 
                disabled={apiLoading}
                className="btn btn-primary"
              >
                {apiLoading ? "..." : "Executer"}
              </button>
            </div>
            
            <div className="api-shortcuts">
              <span>Raccourcis:</span>
              <button onClick={() => setApiPath("/me")}>/me</button>
              <button onClick={() => setApiPath("/me/bill")}>/me/bill</button>
              <button onClick={() => setApiPath("/domain")}>/domain</button>
              <button onClick={() => setApiPath("/vps")}>/vps</button>
              <button onClick={() => setApiPath("/hosting/web")}>/hosting/web</button>
              <button onClick={() => setApiPath("/me/supportLevel")}>/me/supportLevel</button>
            </div>

            {apiError && (
              <div className="api-error">
                {apiError}
              </div>
            )}

            {apiResponse && (
              <pre className="api-response">{apiResponse}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Raw Data */}
      <div className="dev-section">
        <h2>Donnees brutes</h2>
        <div className="dev-card">
          <details>
            <summary>Credentials (sessionStorage)</summary>
            <pre>{credentials ? JSON.stringify(credentials, null, 2) : "null"}</pre>
          </details>
          <details>
            <summary>User (sessionStorage)</summary>
            <pre>{user ? JSON.stringify(user, null, 2) : "null"}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}
