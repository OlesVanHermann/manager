// ============================================================
// ADVANCED TAB - Paramètres avancés et debug
// NAV1: general / NAV2: api / NAV3: advanced
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .advanced-
// ============================================================

import { useTranslation } from "react-i18next";
import { getCredentials, getUser, STORAGE_KEY, API_BASE } from "./AdvancedTab.service";
import "./AdvancedTab.css";

// ============ COMPOSANT ============

/** Affiche les infos de session, utilisateur et environnement pour debug. */
export function AdvancedTab() {
  const { t } = useTranslation('general/api/index');
  const credentials = getCredentials();
  const user = getUser();

  // ---------- HANDLERS ----------
  const clearSession = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("ovh_user");
    window.location.reload();
  };

  // ---------- RENDER ----------
  return (
    <div className="advanced-tab">
      {/* Session Info */}
      <div className="advanced-section">
        <h3>{t('advanced.session.title')}</h3>
        <div className="advanced-card">
          <div className="advanced-grid">
            <div className="advanced-field">
              <label>{t('advanced.session.authenticated')}</label>
              <span className={credentials ? "advanced-badge advanced-badge-success" : "advanced-badge advanced-badge-error"}>
                {credentials ? t('advanced.yes') : t('advanced.no')}
              </span>
            </div>
            <div className="advanced-field">
              <label>{t('advanced.session.appKey')}</label>
              <code>{credentials?.appKey || "-"}</code>
            </div>
            <div className="advanced-field">
              <label>{t('advanced.session.consumerKey')}</label>
              <code>{credentials?.consumerKey ? `${credentials.consumerKey.substring(0, 12)}...` : "-"}</code>
            </div>
          </div>
          <button onClick={clearSession} className="advanced-btn advanced-btn-danger advanced-btn-sm">{t('advanced.session.clear')}</button>
        </div>
      </div>

      {/* User Info */}
      <div className="advanced-section">
        <h3>{t('advanced.user.title')}</h3>
        <div className="advanced-card">
          {user ? (
            <div className="advanced-grid">
              <div className="advanced-field">
                <label>{t('advanced.user.nichandle')}</label>
                <code>{user.nichandle}</code>
              </div>
              <div className="advanced-field">
                <label>{t('advanced.user.email')}</label>
                <code>{user.email}</code>
              </div>
              <div className="advanced-field">
                <label>{t('advanced.user.name')}</label>
                <span>{user.firstname} {user.name}</span>
              </div>
              <div className="advanced-field">
                <label>{t('advanced.user.customerCode')}</label>
                <code>{user.customerCode || "-"}</code>
              </div>
              <div className="advanced-field">
                <label>{t('advanced.user.supportLevel')}</label>
                <span>{user.supportLevel?.level || "-"}</span>
              </div>
              <div className="advanced-field">
                <label>{t('advanced.user.authMethod')}</label>
                <code>{user.auth?.method || "-"}</code>
              </div>
              <div className="advanced-field">
                <label>{t('advanced.user.isTrusted')}</label>
                <span className={user.isTrusted ? "advanced-badge advanced-badge-success" : "advanced-badge advanced-badge-neutral"}>
                  {user.isTrusted ? t('advanced.yes') : t('advanced.no')}
                </span>
              </div>
              <div className="advanced-field">
                <label>{t('advanced.user.organisation')}</label>
                <span>{user.organisation || "-"}</span>
              </div>
            </div>
          ) : (
            <p className="advanced-empty">{t('advanced.user.empty')}</p>
          )}
        </div>
      </div>

      {/* Raw Data */}
      <div className="advanced-section">
        <h3>{t('advanced.rawData.title')}</h3>
        <div className="advanced-card">
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
      <div className="advanced-section">
        <h3>{t('advanced.environment.title')}</h3>
        <div className="advanced-card">
          <div className="advanced-grid">
            <div className="advanced-field">
              <label>{t('advanced.environment.apiBase')}</label>
              <code>{API_BASE}</code>
            </div>
            <div className="advanced-field">
              <label>{t('advanced.environment.userAgent')}</label>
              <code style={{ fontSize: "0.75rem" }}>{navigator.userAgent.substring(0, 50)}...</code>
            </div>
            <div className="advanced-field">
              <label>{t('advanced.environment.timestamp')}</label>
              <code>{new Date().toISOString()}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
