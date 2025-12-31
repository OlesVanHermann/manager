// ============================================================
// GENERAL TAB - Composant ISOLÉ (défactorisé)
// ============================================================

import { useTranslation } from "react-i18next";
import type { CarrierSip } from "../../carrier-sip.types";
import "./GeneralTab.css";

interface Props {
  billingAccount: string;
  serviceName: string;
  details: CarrierSip | null;
}

export function GeneralTab({ billingAccount, serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/voip/carrier-sip/general");
  const percent = details ? Math.round((details.currentCalls / details.maxCalls) * 100) : 0;

  return (
    <div className="general-tab">
      <div className="general-tab-header">
        <div>
          <h3>{t("title")}</h3>
        </div>
      </div>

      <div className={`general-trunk-card ${details?.status === "enabled" ? "active" : ""}`}>
        <div className="general-trunk-status">
          <div className="general-trunk-icon">📡</div>
          <div className="general-trunk-info">
            <h3>{serviceName}</h3>
            <p>{details?.description || t("noDescription")}</p>
            <div className="general-calls-indicator">
              <div className="general-calls-bar">
                <div className="general-calls-fill" style={{ width: `${percent}%` }} />
              </div>
              <span className="general-calls-text">
                {details?.currentCalls || 0} / {details?.maxCalls || 0} appels
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="csip-general-info-section">
        <div className="csip-general-info-grid">
          <div className="csip-general-info-item">
            <label>{t("billingAccount")}</label>
            <span className="csip-general-font-mono">{billingAccount}</span>
          </div>
          <div className="csip-general-info-item">
            <label>{t("status")}</label>
            <span className={`csip-general-badge ${details?.status === "enabled" ? "success" : "warning"}`}>
              {details?.status || "-"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GeneralTab;
