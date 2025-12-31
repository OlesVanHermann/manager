// ============================================================
// CDN SETTINGS TAB - Paramètres CDN par domaine
// CONFORME target_.web-cloud.hosting.cdn-settings.svg
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { cdnService } from "./CdnTab.service";
import "./CdnSettingsTab.css";

interface CdnSettingsTabProps {
  serviceName: string;
  domain: string;
}

interface CdnSettings {
  alwaysOnline: boolean;
  http2: boolean;
  brotli: boolean;
  geoHeaders: boolean;
  hsts: boolean;
  mixedContent: boolean;
}

interface CacheRule {
  id: string;
  name: string;
  type: "extension" | "uri";
  pattern: string;
  ttl: string;
}

const DEFAULT_SETTINGS: CdnSettings = {
  alwaysOnline: true,
  http2: true,
  brotli: true,
  geoHeaders: false,
  hsts: false,
  mixedContent: false,
};

const DEFAULT_RULES: CacheRule[] = [
  { id: "1", name: "static-assets", type: "extension", pattern: ".css, .js, .jpg, .png, .gif, .ico", ttl: "7 jours" },
  { id: "2", name: "fonts", type: "extension", pattern: ".woff, .woff2, .ttf, .eot", ttl: "30 jours" },
  { id: "3", name: "no-cache", type: "uri", pattern: "/api/*", ttl: "0" },
];

export function CdnSettingsTab({ serviceName, domain }: CdnSettingsTabProps) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.general");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<CdnSettings>(DEFAULT_SETTINGS);
  const [rules, setRules] = useState<CacheRule[]>(DEFAULT_RULES);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [editRule, setEditRule] = useState<CacheRule | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cdnService.getSettings(serviceName, domain);
      if (data) {
        setSettings({
          alwaysOnline: data.alwaysOnline ?? true,
          http2: data.http2 ?? true,
          brotli: data.brotli ?? true,
          geoHeaders: data.geoHeaders ?? false,
          hsts: data.hsts ?? false,
          mixedContent: data.mixedContent ?? false,
        });
      }
      const rulesData = await cdnService.getCacheRules(serviceName, domain);
      if (rulesData && rulesData.length > 0) {
        setRules(rulesData);
      }
    } catch (err) {
      console.error("[CdnSettingsTab] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName, domain]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleToggle = async (key: keyof CdnSettings) => {
    const newValue = !settings[key];
    setUpdating(key);
    try {
      await cdnService.updateSettings(serviceName, domain, { [key]: newValue });
      setSettings(prev => ({ ...prev, [key]: newValue }));
    } catch (err) {
      alert(t("cdn.updateError", "Erreur lors de la mise à jour"));
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteRule = async (rule: CacheRule) => {
    if (!confirm(t("cdn.confirmDeleteRule", `Supprimer la règle "${rule.name}" ?`))) return;
    try {
      await cdnService.deleteCacheRule(serviceName, domain, rule.id);
      setRules(prev => prev.filter(r => r.id !== rule.id));
    } catch (err) {
      alert(t("cdn.deleteRuleError", "Erreur lors de la suppression"));
    }
  };

  if (loading) {
    return (
      <div className="cdn-settings-tab">
        <div className="cdn-settings-skeleton" />
        <div className="cdn-settings-skeleton" />
        <div className="cdn-settings-skeleton" />
      </div>
    );
  }

  return (
    <div className="cdn-settings-tab">
      {/* TITLE */}
      <h3 className="cdn-settings-title">
        {t("cdn.settingsTitle", "Paramètres CDN")} - {domain}
      </h3>

      {/* BANNER INFO */}
      <div className="cdn-settings-banner">
        <div className="cdn-settings-banner-icon">ℹ️</div>
        <div className="cdn-settings-banner-content">
          <p>{t("cdn.settingsInfo", "Les modifications sont propagées sur le réseau CDN en 5 minutes environ.")}</p>
        </div>
        <a
          href="https://help.ovhcloud.com/csm/fr-web-hosting-cdn"
          target="_blank"
          rel="noopener noreferrer"
          className="cdn-settings-doc-link"
        >
          {t("cdn.documentation", "Documentation")} ↗
        </a>
      </div>

      {/* PERFORMANCE OPTIONS */}
      <section className="cdn-settings-section">
        <h4 className="cdn-settings-section-title">
          {t("cdn.performanceOptions", "Options de performance")}
        </h4>
        <div className="cdn-settings-cards">
          <OptionCard
            title={t("cdn.alwaysOnline", "Always Online")}
            description={t("cdn.alwaysOnlineDesc", "Affiche une version en cache si le serveur est indisponible")}
            enabled={settings.alwaysOnline}
            loading={updating === "alwaysOnline"}
            onToggle={() => handleToggle("alwaysOnline")}
          />
          <OptionCard
            title={t("cdn.http2", "HTTP/2")}
            description={t("cdn.http2Desc", "Active le protocole HTTP/2 pour de meilleures performances")}
            enabled={settings.http2}
            loading={updating === "http2"}
            onToggle={() => handleToggle("http2")}
          />
          <OptionCard
            title={t("cdn.brotli", "Compression Brotli")}
            description={t("cdn.brotliDesc", "Compresse les ressources pour réduire la taille des transferts")}
            enabled={settings.brotli}
            loading={updating === "brotli"}
            onToggle={() => handleToggle("brotli")}
          />
          <OptionCard
            title={t("cdn.geoHeaders", "En-têtes géolocalisation")}
            description={t("cdn.geoHeadersDesc", "Ajoute des headers avec la localisation du visiteur")}
            enabled={settings.geoHeaders}
            loading={updating === "geoHeaders"}
            onToggle={() => handleToggle("geoHeaders")}
          />
        </div>
      </section>

      {/* SECURITY OPTIONS */}
      <section className="cdn-settings-section">
        <h4 className="cdn-settings-section-title">
          {t("cdn.securityOptions", "Options de sécurité")}
        </h4>
        <div className="cdn-settings-cards cdn-settings-cards-2">
          <OptionCard
            title={t("cdn.hsts", "HSTS")}
            description={t("cdn.hstsDesc", "Force l'utilisation de HTTPS")}
            enabled={settings.hsts}
            loading={updating === "hsts"}
            onToggle={() => handleToggle("hsts")}
          />
          <OptionCard
            title={t("cdn.mixedContent", "Mixed Content")}
            description={t("cdn.mixedContentDesc", "Réécrit automatiquement les URLs HTTP en HTTPS")}
            enabled={settings.mixedContent}
            loading={updating === "mixedContent"}
            onToggle={() => handleToggle("mixedContent")}
          />
        </div>
      </section>

      {/* CACHE RULES */}
      <section className="cdn-settings-section">
        <div className="cdn-settings-section-header">
          <h4 className="cdn-settings-section-title">
            {t("cdn.cacheRules", "Règles de cache")}
          </h4>
          <button
            className="cdn-settings-btn-add"
            onClick={() => setShowAddRuleModal(true)}
          >
            + {t("cdn.addRule", "Ajouter une règle")}
          </button>
        </div>

        {rules.length === 0 ? (
          <div className="cdn-settings-empty-rules">
            <p>{t("cdn.noRules", "Aucune règle de cache configurée")}</p>
          </div>
        ) : (
          <div className="cdn-settings-table-container">
            <table className="cdn-settings-table">
              <thead>
                <tr>
                  <th style={{ width: 180 }}>{t("cdn.ruleName", "Nom")}</th>
                  <th style={{ width: 120 }}>{t("cdn.ruleType", "Type")}</th>
                  <th style={{ width: 300 }}>{t("cdn.rulePattern", "Pattern")}</th>
                  <th style={{ width: 130 }}>{t("cdn.ruleTtl", "TTL")}</th>
                  <th style={{ width: 150 }}>{t("cdn.ruleActions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="cdn-settings-rule-name">{rule.name}</td>
                    <td>
                      <span className={`cdn-settings-badge cdn-settings-badge-${rule.type}`}>
                        {rule.type === "extension" ? "Extension" : "URI"}
                      </span>
                    </td>
                    <td className="cdn-settings-pattern">{rule.pattern}</td>
                    <td>{rule.ttl}</td>
                    <td className="cdn-settings-actions">
                      <button
                        className="cdn-settings-action-link"
                        onClick={() => setEditRule(rule)}
                      >
                        {t("cdn.edit", "Modifier")}
                      </button>
                      <button
                        className="cdn-settings-action-link cdn-settings-action-danger"
                        onClick={() => handleDeleteRule(rule)}
                      >
                        {t("cdn.delete", "Supprimer")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// Toggle Card Component
function OptionCard({
  title,
  description,
  enabled,
  loading,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="cdn-settings-card">
      <div className="cdn-settings-card-content">
        <h5 className="cdn-settings-card-title">{title}</h5>
        <p className="cdn-settings-card-desc">{description}</p>
      </div>
      <div className="cdn-settings-card-toggle">
        <button
          className={`cdn-settings-toggle ${enabled ? "enabled" : ""} ${loading ? "loading" : ""}`}
          onClick={onToggle}
          disabled={loading}
        >
          <span className="cdn-settings-toggle-slider" />
        </button>
      </div>
    </div>
  );
}

export default CdnSettingsTab;
