// ============================================================
// SPF TAB - Wizard SPF configuration
// Groupe: DNS
// ============================================================

import "./SpfTab.css";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { spfService, type SpfRecord, type SpfConfig } from "./SpfTab.service";

interface SpfTabProps {
  zoneName: string;
}

export const SpfTab: React.FC<SpfTabProps> = ({ zoneName }) => {
  const { t } = useTranslation("web-cloud/domains/spf");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSpf, setCurrentSpf] = useState<SpfRecord | null>(null);
  const [config, setConfig] = useState<SpfConfig>({
    includeOvh: true,
    includeMicrosoft: false,
    includeGoogle: false,
    includeCustom: [],
    policy: "~all",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const spf = await spfService.getCurrentSpf(zoneName);
        setCurrentSpf(spf);
        if (spf) {
          setConfig(spfService.parseSpfRecord(spf.target));
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [zoneName]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const spfValue = spfService.generateSpfRecord(config);
      if (currentSpf) {
        await spfService.updateSpf(zoneName, currentSpf.id, spfValue);
      } else {
        await spfService.createSpf(zoneName, spfValue);
      }
      const spf = await spfService.getCurrentSpf(zoneName);
      setCurrentSpf(spf);
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="spf-loading"><div className="spf-skeleton" /></div>;
  }

  const generatedSpf = spfService.generateSpfRecord(config);

  return (
    <div className="spf-container">
      <div className="spf-header">
        <h3>{t("title")}</h3>
        <p className="spf-description">{t("description")}</p>
      </div>

      {currentSpf && (
        <div className="spf-current">
          <div className="spf-current-label">{t("label.currentSpf")}</div>
          <code className="spf-current-value">{currentSpf.target}</code>
        </div>
      )}

      <div className="spf-section">
        <h4>{t("section.includes")}</h4>
        <div className="spf-options">
          <label className="spf-option">
            <input type="checkbox" checked={config.includeOvh} onChange={(e) => setConfig({ ...config, includeOvh: e.target.checked })} />
            <span>OVH (mx.ovh.com)</span>
          </label>
          <label className="spf-option">
            <input type="checkbox" checked={config.includeMicrosoft} onChange={(e) => setConfig({ ...config, includeMicrosoft: e.target.checked })} />
            <span>Microsoft 365</span>
          </label>
          <label className="spf-option">
            <input type="checkbox" checked={config.includeGoogle} onChange={(e) => setConfig({ ...config, includeGoogle: e.target.checked })} />
            <span>Google Workspace</span>
          </label>
        </div>
      </div>

      <div className="spf-section">
        <h4>{t("section.policy")}</h4>
        <div className="spf-policy">
          <label className="spf-radio">
            <input type="radio" name="policy" value="~all" checked={config.policy === "~all"} onChange={() => setConfig({ ...config, policy: "~all" })} />
            <span>~all</span><small>{t("policy.softfail")}</small>
          </label>
          <label className="spf-radio">
            <input type="radio" name="policy" value="-all" checked={config.policy === "-all"} onChange={() => setConfig({ ...config, policy: "-all" })} />
            <span>-all</span><small>{t("policy.hardfail")}</small>
          </label>
          <label className="spf-radio">
            <input type="radio" name="policy" value="?all" checked={config.policy === "?all"} onChange={() => setConfig({ ...config, policy: "?all" })} />
            <span>?all</span><small>{t("policy.neutral")}</small>
          </label>
        </div>
      </div>

      <div className="spf-preview">
        <div className="spf-preview-label">{t("label.preview")}</div>
        <code className="spf-preview-value">{generatedSpf}</code>
      </div>

      <div className="spf-actions">
        <button className="spf-btn primary" onClick={handleSave} disabled={saving}>
          {saving ? t("action.saving") : currentSpf ? t("action.update") : t("action.create")}
        </button>
      </div>
    </div>
  );
};

export default SpfTab;
