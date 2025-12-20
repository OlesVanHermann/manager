// ============================================================
// TAB: DNSSEC - Sécurisation DNSSEC
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

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
      const result = await domainsService.getDnssecStatus(domain);
      setStatus(result.status);
    } catch (err) {
      setError(String(err));
      setStatus(null);
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
      if (status === "enabled") {
        await domainsService.disableDnssec(domain);
      } else {
        await domainsService.enableDnssec(domain);
      }
      await loadStatus();
    } catch (err) {
      alert(String(err));
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  const isEnabled = status === "enabled";
  const isSupported = status !== null && status !== "unsupported";

  return (
    <div className="dnssec-tab">
      <div className="tab-header">
        <div>
          <h3>{t("dnssec.title")}</h3>
          <p className="tab-description">{t("dnssec.description")}</p>
        </div>
      </div>

      <div className={`dnssec-card ${isEnabled ? "active" : "inactive"}`}>
        <div className={`dnssec-icon ${isEnabled ? "active" : "inactive"}`}>
          {isEnabled ? "🔐" : "🔓"}
        </div>
        <h3>{isEnabled ? t("dnssec.enabled") : t("dnssec.disabled")}</h3>
        <p>
          {isEnabled
            ? t("dnssec.enabledDesc")
            : isSupported
            ? t("dnssec.disabledDesc")
            : t("dnssec.unsupportedDesc")}
        </p>
        {isSupported && (
          <button className="btn-primary" onClick={handleToggle} disabled={toggling}>
            {toggling ? tCommon("loading") : isEnabled ? t("dnssec.disable") : t("dnssec.enable")}
          </button>
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
