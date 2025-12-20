// ============================================================
// HOSTING TAB: SSL - Certificat SSL
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, SslCertificate } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Certificat SSL. */
export function SslTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [ssl, setSsl] = useState<SslCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await hostingService.getSslCertificate(serviceName);
        setSsl(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="ssl-tab">
      <div className="tab-header">
        <h3>{t("ssl.title")}</h3>
        <p className="tab-description">{t("ssl.description")}</p>
      </div>

      {ssl ? (
        <div className="ssl-card">
          <div className="ssl-status">
            <div className="status-icon enabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label enabled">{t("ssl.active")}</span>
              <span className="status-description">{t("ssl.provider")}: {ssl.provider}</span>
            </div>
          </div>
          <div className="ssl-details">
            <div className="info-item"><label>{t("ssl.type")}</label><span className="badge success">{ssl.type}</span></div>
            <div className="info-item"><label>{t("ssl.status")}</label><span className="badge info">{ssl.status}</span></div>
            <div className="info-item"><label>{t("ssl.regenerable")}</label><span>{ssl.regenerable ? '✓' : '✗'}</span></div>
          </div>
        </div>
      ) : (
        <div className="ssl-card inactive">
          <div className="ssl-status">
            <div className="status-icon disabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label disabled">{t("ssl.inactive")}</span>
              <span className="status-description">{t("ssl.noSsl")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>{t("ssl.whatIs")}</h4>
        <p>{t("ssl.explanation")}</p>
      </div>
    </div>
  );
}

export default SslTab;
