// ============================================================
// TAB: DNSSEC - Securite DNS
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService } from "../../../../services/domains.service";

interface Props {
  domain: string;
}

/** Onglet DNSSEC - Activation/desactivation de la securite DNS. */
export function DnssecTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await domainsService.getDnssecStatus(domain);
        setStatus(result.status);
      } catch (err) {
        // DNSSEC peut ne pas etre supporte
        setStatus('unsupported');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  const handleToggle = async () => {
    try {
      setActionLoading(true);
      setError(null);
      if (status === 'enabled') {
        await domainsService.disableDnssec(domain);
        setStatus('disabled');
      } else {
        await domainsService.enableDnssec(domain);
        setStatus('enabled');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  const isEnabled = status === 'enabled';
  const isSupported = status !== 'unsupported';

  return (
    <div className="dnssec-tab">
      <div className="tab-header">
        <h3>{t("dnssec.title")}</h3>
        <p className="tab-description">{t("dnssec.description")}</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="dnssec-card">
        <div className="dnssec-status">
          <div className={`status-icon ${isEnabled ? 'enabled' : 'disabled'}`}>
            {isEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <div className="status-text">
            <span className={`status-label ${isEnabled ? 'enabled' : 'disabled'}`}>
              {isEnabled ? t("dnssec.enabled") : t("dnssec.disabled")}
            </span>
            <span className="status-description">
              {isEnabled ? t("dnssec.enabledDesc") : t("dnssec.disabledDesc")}
            </span>
          </div>
        </div>

        {isSupported && (
          <button
            className={`btn-toggle ${isEnabled ? 'btn-danger' : 'btn-success'}`}
            onClick={handleToggle}
            disabled={actionLoading}
          >
            {actionLoading ? tCommon("loading") : (isEnabled ? t("dnssec.disable") : t("dnssec.enable"))}
          </button>
        )}

        {!isSupported && (
          <div className="unsupported-message">{t("dnssec.unsupported")}</div>
        )}
      </div>

      <div className="info-box">
        <h4>{t("dnssec.whatIs")}</h4>
        <p>{t("dnssec.explanation")}</p>
      </div>
    </div>
  );
}

export default DnssecTab;
