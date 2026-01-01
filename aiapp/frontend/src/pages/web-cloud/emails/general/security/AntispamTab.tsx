// ============================================================
// SUB-TAB - Antispam (Configuration antispam)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "../../types";

interface AntispamTabProps {
  domain?: string;
  offers: EmailOffer[];
}

interface AntispamRule {
  id: string;
  type: "whitelist" | "blacklist";
  value: string;
  scope: "email" | "domain";
  createdAt: string;
}

interface AntispamSettings {
  enabled: boolean;
  level: "low" | "medium" | "high";
  quarantineEnabled: boolean;
  quarantineRetention: number;
  virusScanEnabled: boolean;
}

/** Sous-onglet Antispam - Gestion du filtrage spam. */
export default function AntispamTab({ domain, offers }: AntispamTabProps) {
  const { t } = useTranslation("web-cloud/emails/security");

  const [settings, setSettings] = useState<AntispamSettings>({
    enabled: true,
    level: "medium",
    quarantineEnabled: true,
    quarantineRetention: 14,
    virusScanEnabled: true,
  });

  const [newRule, setNewRule] = useState("");
  const [newRuleType, setNewRuleType] = useState<"whitelist" | "blacklist">("blacklist");

  // Mock data - remplacer par appel API
  const rules: AntispamRule[] = useMemo(() => [
    {
      id: "1",
      type: "whitelist",
      value: "partner@trusted.com",
      scope: "email",
      createdAt: "2023-06-01T00:00:00Z",
    },
    {
      id: "2",
      type: "whitelist",
      value: "ovh.com",
      scope: "domain",
      createdAt: "2023-01-15T00:00:00Z",
    },
    {
      id: "3",
      type: "blacklist",
      value: "spam-domain.com",
      scope: "domain",
      createdAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "4",
      type: "blacklist",
      value: "scammer@example.net",
      scope: "email",
      createdAt: "2024-01-12T00:00:00Z",
    },
  ], []);

  const whitelistRules = rules.filter((r) => r.type === "whitelist");
  const blacklistRules = rules.filter((r) => r.type === "blacklist");

  const handleSaveSettings = () => {
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setNewRule("");
  };

  const handleDeleteRule = (rule: AntispamRule) => {
  };

  // Check if antispam is available for these offers
  const hasAntispam = offers.some((o) => ["exchange", "email-pro", "zimbra"].includes(o));

  if (!hasAntispam) {
    return (
      <div className="emails-empty">
        <div className="emails-empty-icon">🛡️</div>
        <h3 className="emails-empty-title">{t("antispam.notAvailable.title")}</h3>
        <p className="emails-empty-text">{t("antispam.notAvailable.description")}</p>
      </div>
    );
  }

  return (
    <div className="antispam-tab">
      {/* Settings section */}
      <div className="settings-section">
        <h3 className="section-title">{t("antispam.settings.title")}</h3>

        <div className="settings-grid">
          {/* Enable/Disable */}
          <div className="setting-item">
            <label className="setting-label">{t("antispam.settings.enabled")}</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Level */}
          <div className="setting-item">
            <label className="setting-label">{t("antispam.settings.level")}</label>
            <select
              className="setting-select"
              value={settings.level}
              onChange={(e) => setSettings({ ...settings, level: e.target.value as "low" | "medium" | "high" })}
            >
              <option value="low">{t("antispam.levels.low")}</option>
              <option value="medium">{t("antispam.levels.medium")}</option>
              <option value="high">{t("antispam.levels.high")}</option>
            </select>
          </div>

          {/* Quarantine */}
          <div className="setting-item">
            <label className="setting-label">{t("antispam.settings.quarantine")}</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.quarantineEnabled}
                onChange={(e) => setSettings({ ...settings, quarantineEnabled: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Virus scan */}
          <div className="setting-item">
            <label className="setting-label">{t("antispam.settings.virusScan")}</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.virusScanEnabled}
                onChange={(e) => setSettings({ ...settings, virusScanEnabled: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSaveSettings}>
          {t("antispam.settings.save")}
        </button>
      </div>

      {/* Add rule */}
      <div className="add-rule-section">
        <h3 className="section-title">{t("antispam.rules.addTitle")}</h3>
        <div className="add-rule-form">
          <select
            className="rule-type-select"
            value={newRuleType}
            onChange={(e) => setNewRuleType(e.target.value as "whitelist" | "blacklist")}
          >
            <option value="whitelist">{t("antispam.rules.whitelist")}</option>
            <option value="blacklist">{t("antispam.rules.blacklist")}</option>
          </select>
          <input
            type="text"
            className="filter-input"
            placeholder={t("antispam.rules.placeholder")}
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
          />
          <button className="btn btn-primary" onClick={handleAddRule}>
            + {t("antispam.rules.add")}
          </button>
        </div>
      </div>

      {/* Rules lists */}
      <div className="rules-section">
        {/* Whitelist */}
        <div className="rules-column">
          <h4 className="rules-title whitelist">
            ✓ {t("antispam.rules.whitelist")} ({whitelistRules.length})
          </h4>
          <div className="rules-list">
            {whitelistRules.map((rule) => (
              <div key={rule.id} className="rule-item whitelist">
                <span className="rule-value">
                  {rule.scope === "domain" ? `*@${rule.value}` : rule.value}
                </span>
                <button
                  className="action-btn danger"
                  onClick={() => handleDeleteRule(rule)}
                >
                  ✗
                </button>
              </div>
            ))}
            {whitelistRules.length === 0 && (
              <p className="rules-empty">{t("antispam.rules.emptyWhitelist")}</p>
            )}
          </div>
        </div>

        {/* Blacklist */}
        <div className="rules-column">
          <h4 className="rules-title blacklist">
            ✗ {t("antispam.rules.blacklist")} ({blacklistRules.length})
          </h4>
          <div className="rules-list">
            {blacklistRules.map((rule) => (
              <div key={rule.id} className="rule-item blacklist">
                <span className="rule-value">
                  {rule.scope === "domain" ? `*@${rule.value}` : rule.value}
                </span>
                <button
                  className="action-btn danger"
                  onClick={() => handleDeleteRule(rule)}
                >
                  ✗
                </button>
              </div>
            ))}
            {blacklistRules.length === 0 && (
              <p className="rules-empty">{t("antispam.rules.emptyBlacklist")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
