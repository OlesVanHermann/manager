// ============================================================
// WARNING NOT FOUND - OTB 404 introuvable
// ============================================================

import { useTranslation } from "react-i18next";
import "./Warnings.css";

interface WarningNotFoundProps {
  serviceName?: string;
  onBack: () => void;
}

export function WarningNotFound({ serviceName, onBack }: WarningNotFoundProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/warnings");

  const handleSupport = () => {
    window.location.href = "/support/ticket/new";
  };

  return (
    <div className="otb-warning-page">
      <div className="otb-warning-container">
        <div className="otb-warning-icon warning-error">
          ❌
        </div>
        <h2 className="otb-warning-title">{t("notFound.title")}</h2>
        <p className="otb-warning-description">{t("notFound.description")}</p>

        {serviceName && (
          <div className="otb-warning-details">
            <span className="detail-label">{t("notFound.serviceId")}</span>
            <span className="detail-value mono">{serviceName}</span>
          </div>
        )}

        <div className="otb-warning-reasons">
          <h4>{t("notFound.reasonsTitle")}</h4>
          <ul>
            <li>{t("notFound.reason1")}</li>
            <li>{t("notFound.reason2")}</li>
            <li>{t("notFound.reason3")}</li>
            <li>{t("notFound.reason4")}</li>
          </ul>
        </div>

        <div className="otb-warning-actions">
          <button className="btn-secondary" onClick={onBack}>
            {t("notFound.backToList")}
          </button>
          <button className="btn-primary" onClick={handleSupport}>
            {t("notFound.contactSupport")}
          </button>
        </div>
      </div>
    </div>
  );
}
