// ============================================================
// DMARC TAB - Wizard DMARC configuration
// Groupe: DNS
// ============================================================

import "./DmarcTab.css";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dmarcService, type DmarcRecord, type DmarcConfig } from "./DmarcTab.service";

interface DmarcTabProps {
  zoneName: string;
}

export const DmarcTab: React.FC<DmarcTabProps> = ({ zoneName }) => {
  const { t } = useTranslation("web-cloud/domains/dmarc");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentDmarc, setCurrentDmarc] = useState<DmarcRecord | null>(null);
  const [config, setConfig] = useState<DmarcConfig>({
    policy: "none",
    subdomainPolicy: "none",
    percentage: 100,
    reportEmail: "",
    forensicEmail: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const dmarc = await dmarcService.getCurrentDmarc(zoneName);
        setCurrentDmarc(dmarc);
        if (dmarc) {
          setConfig(dmarcService.parseDmarcRecord(dmarc.target));
        }
      } catch (err) {
        console.error("Failed to load DMARC:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [zoneName]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const dmarcValue = dmarcService.generateDmarcRecord(config);
      if (currentDmarc) {
        await dmarcService.updateDmarc(zoneName, currentDmarc.id, dmarcValue);
      } else {
        await dmarcService.createDmarc(zoneName, dmarcValue);
      }
      const dmarc = await dmarcService.getCurrentDmarc(zoneName);
      setCurrentDmarc(dmarc);
    } catch (err) {
      console.error("Failed to save DMARC:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="dmarc-loading"><div className="dmarc-skeleton" /></div>;
  }

  const generatedDmarc = dmarcService.generateDmarcRecord(config);

  return (
    <div className="dmarc-container">
      <div className="dmarc-header">
        <h3>{t("title")}</h3>
        <p className="dmarc-description">{t("description")}</p>
      </div>

      {currentDmarc && (
        <div className="dmarc-current">
          <div className="dmarc-current-label">{t("label.currentDmarc")}</div>
          <code className="dmarc-current-value">{currentDmarc.target}</code>
        </div>
      )}

      <div className="dmarc-section">
        <h4>{t("section.policy")}</h4>
        <div className="dmarc-policy">
          <label className="dmarc-radio">
            <input type="radio" name="policy" value="none" checked={config.policy === "none"} onChange={() => setConfig({ ...config, policy: "none" })} />
            <span>none</span><small>{t("policy.none")}</small>
          </label>
          <label className="dmarc-radio">
            <input type="radio" name="policy" value="quarantine" checked={config.policy === "quarantine"} onChange={() => setConfig({ ...config, policy: "quarantine" })} />
            <span>quarantine</span><small>{t("policy.quarantine")}</small>
          </label>
          <label className="dmarc-radio">
            <input type="radio" name="policy" value="reject" checked={config.policy === "reject"} onChange={() => setConfig({ ...config, policy: "reject" })} />
            <span>reject</span><small>{t("policy.reject")}</small>
          </label>
        </div>
      </div>

      <div className="dmarc-section">
        <h4>{t("section.reporting")}</h4>
        <div className="dmarc-form-field">
          <label>{t("label.reportEmail")}</label>
          <input type="email" value={config.reportEmail} onChange={(e) => setConfig({ ...config, reportEmail: e.target.value })} placeholder="dmarc-reports@example.com" />
        </div>
        <div className="dmarc-form-field">
          <label>{t("label.forensicEmail")}</label>
          <input type="email" value={config.forensicEmail} onChange={(e) => setConfig({ ...config, forensicEmail: e.target.value })} placeholder="dmarc-forensic@example.com" />
        </div>
      </div>

      <div className="dmarc-preview">
        <div className="dmarc-preview-label">{t("label.preview")}</div>
        <code className="dmarc-preview-value">{generatedDmarc}</code>
      </div>

      <div className="dmarc-actions">
        <button className="dmarc-btn primary" onClick={handleSave} disabled={saving}>
          {saving ? t("action.saving") : currentDmarc ? t("action.update") : t("action.create")}
        </button>
      </div>
    </div>
  );
};

export default DmarcTab;
