// ============================================================
// BROADCAST TAB - Paramètres de diffusion
// NAV1: general / NAV2: support / NAV3: broadcast
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .broadcast-
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
      <div className="broadcast-container">
        <div className="broadcast-loading-state">
          <div className="broadcast-spinner"></div>
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="broadcast-container">
        <div className="broadcast-error-banner">
          {error}
          <button onClick={loadData} className="broadcast-btn broadcast-btn-secondary broadcast-btn-sm">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="broadcast-container">
      <div className="broadcast-header">
        <h2>{t("broadcast.title")}</h2>
        <p>{t("broadcast.subtitle")}</p>
      </div>

      {/* ----- PRÉFÉRENCES MARKETING ----- */}
      <div className="broadcast-section">
        <h3 className="broadcast-section-title">
          {t("broadcast.marketing.title")}
          {saving && <span className="broadcast-saving-indicator">({t("broadcast.saving")})</span>}
        </h3>
        <div className="broadcast-preferences-list">
          {(["email", "phone", "sms"] as const).map((key) => (
            <div key={key} className="broadcast-preference-item">
              <div className="broadcast-preference-info">
                <h4>{t(`broadcast.marketing.${key}.title`)}</h4>
                <p>{t(`broadcast.marketing.${key}.description`)}</p>
              </div>
              <label className="broadcast-toggle-switch">
                <input
                  type="checkbox"
                  checked={marketingPrefs[key]}
                  onChange={() => handleMarketingToggle(key)}
                  disabled={saving}
                />
                <span className="broadcast-toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* ----- RÈGLES DE ROUTAGE ----- */}
      <div className="broadcast-section">
        <h3 className="broadcast-section-title">
          {t("broadcast.routing.title")} ({routingRules.length})
        </h3>

        {routingRules.length === 0 ? (
          <div className="broadcast-routing-empty">
            <p>{t("broadcast.routing.empty")}</p>
            <a
              href={SUPPORT_URLS.communicationSettings}
              target="_blank"
              rel="noopener noreferrer"
              className="broadcast-btn broadcast-btn-primary broadcast-btn-sm"
            >
              {t("broadcast.routing.configure")}
            </a>
          </div>
        ) : (
          <div className="broadcast-routing-list">
            {routingRules.map((rule) => (
              <div key={rule.id} className="broadcast-routing-item">
                <div className="broadcast-routing-header">
                  <h4>{rule.name}</h4>
                  <span className={`broadcast-badge ${rule.active ? "broadcast-badge-success" : "broadcast-badge-neutral"}`}>
                    {rule.active ? t("broadcast.routing.active") : t("broadcast.routing.inactive")}
                  </span>
                </div>
                <p className="broadcast-routing-meta">
                  {t("broadcast.routing.rulesCount", { count: rule.rules.length })} •{" "}
                  {t("broadcast.routing.createdAt")} {new Date(rule.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
            <a
              href={SUPPORT_URLS.communicationSettings}
              target="_blank"
              rel="noopener noreferrer"
              className="broadcast-routing-link"
            >
              {t("broadcast.routing.manage")} →
            </a>
          </div>
        )}
      </div>

      {/* ----- RÉFÉRENCE ----- */}
      {reference && (reference.categories.length > 0 || reference.priorities.length > 0) && (
        <div className="broadcast-section broadcast-reference-section">
          <h3 className="broadcast-section-title">{t("broadcast.reference.title")}</h3>
          <div className="broadcast-reference-grid">
            {reference.categories.length > 0 && (
              <div className="broadcast-reference-group">
                <h4>{t("broadcast.reference.categories")}</h4>
                <div className="broadcast-reference-chips">
                  {reference.categories.map((c) => (
                    <span key={c.id} className="broadcast-badge broadcast-badge-neutral">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {reference.priorities.length > 0 && (
              <div className="broadcast-reference-group">
                <h4>{t("broadcast.reference.priorities")}</h4>
                <div className="broadcast-reference-chips">
                  {reference.priorities.map((p) => (
                    <span key={p.id} className="broadcast-badge broadcast-badge-neutral">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="broadcast-footer">
        <p className="broadcast-note">{t("broadcast.securityNote")}</p>
      </div>
    </div>
  );
}
