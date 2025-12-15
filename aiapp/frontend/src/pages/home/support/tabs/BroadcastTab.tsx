// ============================================================
// BROADCAST TAB - Paramètres de diffusion
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as communicationService from "../../../../services/communication.service";
import { SUPPORT_URLS } from "../utils";

// ============ COMPOSANT ============

/** Gère les préférences marketing et les règles de routage des notifications. */
export function BroadcastTab() {
  const { t } = useTranslation('home/support/index');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [marketingPrefs, setMarketingPrefs] = useState<communicationService.MarketingPreferences>({
    email: false,
    phone: false,
    sms: false,
    fax: false,
  });
  const [routingRules, setRoutingRules] = useState<communicationService.NotificationRouting[]>([]);
  const [reference, setReference] = useState<communicationService.NotificationReference | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => { loadData(); }, []);

  // ---------- LOADERS ----------
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prefs, rules, ref] = await Promise.all([
        communicationService.getMarketingPreferences(),
        communicationService.getRoutingRules(),
        communicationService.getNotificationReference(),
      ]);
      setMarketingPrefs(prefs);
      setRoutingRules(rules);
      setReference(ref);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleMarketingToggle = async (key: keyof communicationService.MarketingPreferences) => {
    const newPrefs = { ...marketingPrefs, [key]: !marketingPrefs[key] };
    setMarketingPrefs(newPrefs);
    setSaving(true);
    try {
      await communicationService.updateMarketingPreferences(newPrefs);
    } catch (err) {
      setMarketingPrefs(marketingPrefs);
      setError(err instanceof Error ? err.message : t('errors.saveError'));
    } finally {
      setSaving(false);
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="broadcast-tab"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  }

  if (error) {
    return (
      <div className="broadcast-tab">
        <div className="error-banner">
          {error}
          <button onClick={loadData} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="broadcast-tab">
      <div className="section-header">
        <h2>{t('broadcast.title')}</h2>
        <p>{t('broadcast.subtitle')}</p>
      </div>

      {/* ----- PRÉFÉRENCES MARKETING ----- */}
      <div className="preferences-section" style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          {t('broadcast.marketing.title')} {saving && <span style={{ fontSize: "0.75rem", color: "var(--color-primary)" }}>({t('broadcast.saving')})</span>}
        </h3>
        <div className="preferences-list">
          <div className="preference-item">
            <div className="preference-info">
              <h4>{t('broadcast.marketing.email.title')}</h4>
              <p>{t('broadcast.marketing.email.description')}</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={marketingPrefs.email} onChange={() => handleMarketingToggle("email")} disabled={saving} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <h4>{t('broadcast.marketing.phone.title')}</h4>
              <p>{t('broadcast.marketing.phone.description')}</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={marketingPrefs.phone} onChange={() => handleMarketingToggle("phone")} disabled={saving} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <h4>{t('broadcast.marketing.sms.title')}</h4>
              <p>{t('broadcast.marketing.sms.description')}</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={marketingPrefs.sms} onChange={() => handleMarketingToggle("sms")} disabled={saving} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* ----- RÈGLES DE ROUTAGE ----- */}
      <div className="routing-section" style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          {t('broadcast.routing.title')} ({routingRules.length})
        </h3>

        {routingRules.length === 0 ? (
          <div className="empty-routing" style={{ padding: "1.5rem", background: "var(--color-background-subtle)", borderRadius: "8px", textAlign: "center" }}>
            <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
              {t('broadcast.routing.empty')}
            </p>
            <a href={SUPPORT_URLS.communicationSettings} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              {t('broadcast.routing.configure')}
            </a>
          </div>
        ) : (
          <div className="routing-list">
            {routingRules.map((rule) => (
              <div key={rule.id} className="routing-item" style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "8px", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0 }}>{rule.name}</h4>
                  <span className={`badge ${rule.active ? "badge-success" : "badge-neutral"}`}>
                    {rule.active ? t('broadcast.routing.active') : t('broadcast.routing.inactive')}
                  </span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0 }}>
                  {t('broadcast.routing.rulesCount', { count: rule.rules.length })} • {t('broadcast.routing.createdAt')} {new Date(rule.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
            <a href={SUPPORT_URLS.communicationSettings} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--color-primary)" }}>
              {t('broadcast.routing.manage')} →
            </a>
          </div>
        )}
      </div>

      {/* ----- RÉFÉRENCE ----- */}
      {reference && (reference.categories.length > 0 || reference.priorities.length > 0) && (
        <div className="reference-section">
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
            {t('broadcast.reference.title')}
          </h3>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {reference.categories.length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t('broadcast.reference.categories')}</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {reference.categories.map((c) => (
                    <span key={c.id} className="badge badge-neutral">{c.name}</span>
                  ))}
                </div>
              </div>
            )}
            {reference.priorities.length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t('broadcast.reference.priorities')}</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {reference.priorities.map((p) => (
                    <span key={p.id} className="badge badge-neutral">{p.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="preferences-footer" style={{ marginTop: "2rem" }}>
        <p className="preferences-note">{t('broadcast.securityNote')}</p>
      </div>
    </div>
  );
}
