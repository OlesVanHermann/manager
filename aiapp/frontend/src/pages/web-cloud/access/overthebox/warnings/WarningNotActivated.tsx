// ============================================================
// WARNING NOT ACTIVATED - OTB en attente d'activation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../../../services/api";
import "./Warnings.css";

interface WarningNotActivatedProps {
  serviceName: string;
  onActivated: () => void;
  onBack: () => void;
}

interface ActivationStep {
  id: string;
  status: "done" | "current" | "pending";
}

export function WarningNotActivated({ serviceName, onActivated, onBack }: WarningNotActivatedProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/warnings");
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const [steps, setSteps] = useState<ActivationStep[]>([
    { id: "delivery", status: "current" },
    { id: "connection", status: "pending" },
    { id: "activation", status: "pending" },
  ]);

  useEffect(() => {
    loadTracking();
  }, [serviceName]);

  const loadTracking = async () => {
    try {
      const tracking = await ovhApi.get<{ trackingUrl: string }>(`/overTheBox/${serviceName}/tracking`);
      setTrackingUrl(tracking.trackingUrl);
    } catch {
      // Tracking may not be available
    }
  };

  const handleActivate = async () => {
    try {
      setActivating(true);
      setError(null);
      await ovhApi.post(`/overTheBox/${serviceName}/activate`);
      onActivated();
    } catch (err) {
      setError(String(err));
    } finally {
      setActivating(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "done": return "✓";
      case "current": return "●";
      default: return "○";
    }
  };

  return (
    <div className="otb-warning-page">
      <div className="otb-warning-container">
        <div className="otb-warning-icon warning-pending">
          ⏳
        </div>
        <h2 className="otb-warning-title">{t("notActivated.title")}</h2>
        <p className="otb-warning-description">{t("notActivated.description")}</p>

        <div className="otb-activation-steps">
          {steps.map((step) => (
            <div key={step.id} className={`activation-step ${step.status}`}>
              <span className="step-icon">{getStepIcon(step.status)}</span>
              <div className="step-content">
                <span className="step-title">{t(`notActivated.steps.${step.id}.title`)}</span>
                <span className="step-desc">{t(`notActivated.steps.${step.id}.desc`)}</span>
              </div>
            </div>
          ))}
        </div>

        {trackingUrl && (
          <div className="otb-tracking-link">
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
              📦 {t("notActivated.trackPackage")}
            </a>
          </div>
        )}

        {error && (
          <div className="otb-warning-error">
            {error}
          </div>
        )}

        <div className="otb-warning-actions">
          <button className="btn-secondary" onClick={onBack}>
            {t("common.back")}
          </button>
          <button className="btn-primary" onClick={handleActivate} disabled={activating}>
            {activating ? t("notActivated.activating") : t("notActivated.activate")}
          </button>
        </div>
      </div>
    </div>
  );
}
