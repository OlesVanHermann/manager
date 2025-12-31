// ============================================================
// BIMI TAB - Wizard BIMI configuration
// Groupe: DNS
// ============================================================

import "./BimiTab.css";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { bimiService, type BimiRecord, type BimiConfig } from "./BimiTab.service";

interface BimiTabProps {
  zoneName: string;
}

export const BimiTab: React.FC<BimiTabProps> = ({ zoneName }) => {
  const { t } = useTranslation("web-cloud/domains/bimi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentBimi, setCurrentBimi] = useState<BimiRecord | null>(null);
  const [config, setConfig] = useState<BimiConfig>({ logoUrl: "", vmcUrl: "" });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const bimi = await bimiService.getCurrentBimi(zoneName);
        setCurrentBimi(bimi);
        if (bimi) setConfig(bimiService.parseBimiRecord(bimi.target));
      } catch (err) {
        console.error("Failed to load BIMI:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [zoneName]);

  const handleSave = async () => {
    if (!config.logoUrl) return;
    setSaving(true);
    try {
      const bimiValue = bimiService.generateBimiRecord(config);
      if (currentBimi) {
        await bimiService.updateBimi(zoneName, currentBimi.id, bimiValue);
      } else {
        await bimiService.createBimi(zoneName, bimiValue);
      }
      const bimi = await bimiService.getCurrentBimi(zoneName);
      setCurrentBimi(bimi);
    } catch (err) {
      console.error("Failed to save BIMI:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="bimi-loading"><div className="bimi-skeleton" /></div>;
  }

  const generatedBimi = bimiService.generateBimiRecord(config);

  return (
    <div className="bimi-container">
      <div className="bimi-header">
        <h3>{t("title")}</h3>
        <p className="bimi-description">{t("description")}</p>
      </div>

      <div className="bimi-prereq">
        <h4>{t("section.prerequisites")}</h4>
        <ul>
          <li>{t("prereq.dmarc")}</li>
          <li>{t("prereq.logo")}</li>
          <li>{t("prereq.vmc")}</li>
        </ul>
      </div>

      {currentBimi && (
        <div className="bimi-current">
          <div className="bimi-current-label">{t("label.currentBimi")}</div>
          <code className="bimi-current-value">{currentBimi.target}</code>
        </div>
      )}

      <div className="bimi-section">
        <h4>{t("section.configuration")}</h4>
        <div className="bimi-form-field">
          <label>{t("label.logoUrl")} *</label>
          <input type="url" value={config.logoUrl} onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })} placeholder="https://example.com/logo.svg" />
          <small>{t("hint.logoFormat")}</small>
        </div>
        <div className="bimi-form-field">
          <label>{t("label.vmcUrl")}</label>
          <input type="url" value={config.vmcUrl} onChange={(e) => setConfig({ ...config, vmcUrl: e.target.value })} placeholder="https://example.com/vmc.pem" />
          <small>{t("hint.vmcOptional")}</small>
        </div>
      </div>

      <div className="bimi-preview">
        <div className="bimi-preview-label">{t("label.preview")}</div>
        <code className="bimi-preview-value">{generatedBimi}</code>
        <div className="bimi-preview-subdomain">default._bimi.{zoneName}</div>
      </div>

      <div className="bimi-actions">
        <button className="bimi-btn primary" onClick={handleSave} disabled={saving || !config.logoUrl}>
          {saving ? t("action.saving") : currentBimi ? t("action.update") : t("action.create")}
        </button>
      </div>
    </div>
  );
};

export default BimiTab;
