// ============================================================
// BROADCAST TAB - Paramètres de diffusion
// NAV1: general / NAV2: support / NAV3: broadcast
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .support-broadcast-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as broadcastService from "./BroadcastTab.service";
import { SUPPORT_URLS } from "./BroadcastTab.service";
import "./BroadcastTab.css";

// ============ COMPOSANT ============

export function BroadcastTab() {
  const { t } = useTranslation("general/support/index");
  const { t: tCommon } = useTranslation("common");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [marketingPrefs, setMarketingPrefs] = useState<broadcastService.MarketingPreferences>({
    email: false,
    phone: false,
    sms: false,
    fax: false,
  });
  const [routingRules, setRoutingRules] = useState<broadcastService.NotificationRouting[]>([]);
  const [reference, setReference] = useState<broadcastService.NotificationReference | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prefs, rules, ref] = await Promise.all([
        broadcastService.getMarketingPreferences(),
        broadcastService.getRoutingRules(),
        broadcastService.getNotificationReference(),
      ]);
      setMarketingPrefs(prefs);
      setRoutingRules(rules);
      setReference(ref);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleMarketingToggle = async (key: keyof broadcastService.MarketingPreferences) => {
    const newPrefs = { ...marketingPrefs, [key]: !marketingPrefs[key] };
    setMarketingPrefs(newPrefs);
    setSaving(true);
    try {
      await broadcastService.updateMarketingPreferences(newPrefs);
    } catch (err) {
      setMarketingPrefs(marketingPrefs);
      setError(err instanceof Error ? err.message : t("errors.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="support-broadcast-container">
        <div className="support-broadcast-loading-state">
          <div className="support-broadcast-spinner"></div>
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="support-broadcast-container">
        <div className="support-broadcast-error-banner">
          {error}
          <button onClick={loadData} className="support-broadcast-btn broadcast-btn-secondary broadcast-btn-sm">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-broadcast-container">
      <div className="support-broadcast-header">
        <h2>{t("broadcast.title")}</h2>
        <p>{t("broadcast.subtitle")}</p>
      </div>

      {/* ----- PRÉFÉRENCES MARKETING ----- */}
      <div className="support-broadcast-section">
        <h3 className="support-broadcast-section-title">
          {t("broadcast.marketing.title")}
          {saving && <span className="support-broadcast-saving-indicator">({t("broadcast.saving")})</span>}
        </h3>
        <div className="support-broadcast-preferences-list">
          {(["email", "phone", "sms"] as const).map((key) => (
            <div key={key} className="support-broadcast-preference-item">
              <div className="support-broadcast-preference-info">
                <h4>{t(`broadcast.marketing.${key}.title`)}</h4>
                <p>{t(`broadcast.marketing.${key}.description`)}</p>
              </div>
              <label className="support-broadcast-toggle-switch">
                <input
                  type="checkbox"
                  checked={marketingPrefs[key]}
                  onChange={() => handleMarketingToggle(key)}
                  disabled={saving}
                />
                <span className="support-broadcast-toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* ----- RÈGLES DE ROUTAGE ----- */}
      <div className="support-broadcast-section">
        <h3 className="support-broadcast-section-title">
          {t("broadcast.routing.title")} ({routingRules.length})
        </h3>

        {routingRules.length === 0 ? (
          <div className="support-broadcast-routing-empty">
            <p>{t("broadcast.routing.empty")}</p>
            <a
              href={SUPPORT_URLS.communicationSettings}
              target="_blank"
              rel="noopener noreferrer"
              className="support-broadcast-btn broadcast-btn-primary broadcast-btn-sm"
            >
              {t("broadcast.routing.configure")}
            </a>
          </div>
        ) : (
          <div className="support-broadcast-routing-list">
            {routingRules.map((rule) => (
              <div key={rule.id} className="support-broadcast-routing-item">
                <div className="support-broadcast-routing-header">
                  <h4>{rule.name}</h4>
                  <span className={`broadcast-badge ${rule.active ? "support-broadcast-badge-success" : "support-broadcast-badge-neutral"}`}>
                    {rule.active ? t("broadcast.routing.active") : t("broadcast.routing.inactive")}
                  </span>
                </div>
                <p className="support-broadcast-routing-meta">
                  {t("broadcast.routing.rulesCount", { count: rule.rules.length })} •{" "}
                  {t("broadcast.routing.createdAt")} {new Date(rule.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
            <a
              href={SUPPORT_URLS.communicationSettings}
              target="_blank"
              rel="noopener noreferrer"
              className="support-broadcast-routing-link"
            >
              {t("broadcast.routing.manage")} →
            </a>
          </div>
        )}
      </div>

      {/* ----- RÉFÉRENCE ----- */}
      {reference && (reference.categories.length > 0 || reference.priorities.length > 0) && (
        <div className="support-broadcast-section broadcast-reference-section">
          <h3 className="support-broadcast-section-title">{t("broadcast.reference.title")}</h3>
          <div className="support-broadcast-reference-grid">
            {reference.categories.length > 0 && (
              <div className="support-broadcast-reference-group">
                <h4>{t("broadcast.reference.categories")}</h4>
                <div className="support-broadcast-reference-chips">
                  {reference.categories.map((c) => (
                    <span key={c.id} className="support-broadcast-badge broadcast-badge-neutral">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {reference.priorities.length > 0 && (
              <div className="support-broadcast-reference-group">
                <h4>{t("broadcast.reference.priorities")}</h4>
                <div className="support-broadcast-reference-chips">
                  {reference.priorities.map((p) => (
                    <span key={p.id} className="support-broadcast-badge broadcast-badge-neutral">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="support-broadcast-footer">
        <p className="support-broadcast-note">{t("broadcast.securityNote")}</p>
      </div>
    </div>
  );
}
