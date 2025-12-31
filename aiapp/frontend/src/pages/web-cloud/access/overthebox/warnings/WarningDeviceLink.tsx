// ============================================================
// WARNING DEVICE LINK - OTB non lié au compte
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../../../services/api";
import "./Warnings.css";

interface WarningDeviceLinkProps {
  serviceName: string;
  onLinked: () => void;
  onBack: () => void;
}

export function WarningDeviceLink({ serviceName, onLinked, onBack }: WarningDeviceLinkProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/warnings");
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLink = async () => {
    try {
      setLinking(true);
      setError(null);
      await ovhApi.post(`/overTheBox/${serviceName}/link`);
      onLinked();
    } catch (err) {
      setError(String(err));
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="otb-warning-page">
      <div className="otb-warning-container">
        <div className="otb-warning-icon warning-link">
          🔗
        </div>
        <h2 className="otb-warning-title">{t("deviceLink.title")}</h2>
        <p className="otb-warning-description">{t("deviceLink.description")}</p>

        <div className="otb-warning-steps">
          <h4>{t("deviceLink.stepsTitle")}</h4>
          <ol>
            <li>{t("deviceLink.step1")}</li>
            <li>{t("deviceLink.step2")}</li>
            <li>{t("deviceLink.step3")}</li>
          </ol>
        </div>

        <div className="otb-warning-requirements">
          <h4>{t("deviceLink.requirementsTitle")}</h4>
          <ul>
            <li>
              <span className="req-icon">✓</span>
              {t("deviceLink.req1")}
            </li>
            <li>
              <span className="req-icon">✓</span>
              {t("deviceLink.req2")}
            </li>
            <li>
              <span className="req-icon">✓</span>
              {t("deviceLink.req3")}
            </li>
          </ul>
        </div>

        {error && (
          <div className="otb-warning-error">
            {error}
          </div>
        )}

        <div className="otb-warning-actions">
          <button className="btn-secondary" onClick={onBack}>
            {t("common.back")}
          </button>
          <button className="btn-primary" onClick={handleLink} disabled={linking}>
            {linking ? t("deviceLink.linking") : t("deviceLink.link")}
          </button>
        </div>
      </div>
    </div>
  );
}
