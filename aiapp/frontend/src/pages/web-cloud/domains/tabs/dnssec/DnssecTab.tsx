// ============================================================
import "./DnssecTab.css";
// TAB: DNSSEC - Sécurisation DNSSEC
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dnssecService } from "./DnssecTab.service";
import type { DnssecStatus } from "../../domains.types";

interface Props {
  domain: string;
}

// ============ ICONS ============

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
  </svg>
);

/** Onglet DNSSEC du domaine. */
export function DnssecTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dnssecService.getDnssecStatus(domain);
      setStatus(result.status);
    } catch (err) {
      const errMsg = String(err);
      if (errMsg.includes("404") || errMsg.includes("not found")) {
        setStatus("disabled");
      } else {
        setError(errMsg);
        setStatus(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [domain]);

  const handleToggle = async () => {
    try {
      setToggling(true);
      setError(null);
      if (status === "enabled") {
        await dnssecService.disableDnssec(domain);
      } else {
        await dnssecService.enableDnssec(domain);
      }
      await loadStatus();
    } catch (err) {
      setError(String(err));
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" style={{ height: "200px" }} />
      </div>
    );
  }

  const isEnabled = status === "enabled";
  const isInProgress = status === "enableInProgress" || status === "disableInProgress";
  const isSupported = status !== null && status !== "unsupported";

  return (
    <div className="dnssec-tab">
      <div className="tab-header">
        <div>
          <h3>{t("dnssec.title")}</h3>
          <p className="tab-description">{t("dnssec.description")}</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className={`dnssec-status-card ${isEnabled ? "enabled" : "disabled"}`}>
        <div className="dnssec-icon">
          {isEnabled ? <ShieldCheckIcon /> : <ShieldIcon />}
        </div>
        <div className="dnssec-content">
          <h3 className={isEnabled ? "text-success" : "text-warning"}>
            {isEnabled ? t("dnssec.enabled") : t("dnssec.disabled")}
          </h3>
          <p>
            {isEnabled
              ? t("dnssec.enabledDesc")
              : isSupported
              ? t("dnssec.disabledDesc")
              : t("dnssec.unsupportedDesc")}
          </p>
          {isInProgress && (
            <p className="status-progress">
              {status === "enableInProgress" ? "Activation en cours..." : "Désactivation en cours..."}
            </p>
          )}
        </div>
        {isSupported && !isInProgress && (
          <div className="dnssec-action">
            <button 
              className={isEnabled ? "btn-secondary" : "btn-primary"} 
              onClick={handleToggle} 
              disabled={toggling}
            >
              {toggling ? tCommon("loading") : isEnabled ? t("dnssec.disable") : t("dnssec.enable")}
            </button>
          </div>
        )}
      </div>

      <div className="info-box">
        <h4>{t("dnssec.info")}</h4>
        <p>{t("dnssec.infoDesc")}</p>
      </div>
    </div>
  );
}

export default DnssecTab;
