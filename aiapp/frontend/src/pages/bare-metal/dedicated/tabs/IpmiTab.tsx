import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dedicatedService, DedicatedServerIpmi } from "../../../../services/dedicated.service";

interface Props { serviceName: string; }

export function IpmiTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const { t: tCommon } = useTranslation("common");
  const [ipmi, setIpmi] = useState<DedicatedServerIpmi | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await dedicatedService.getIpmi(serviceName); setIpmi(data); }
      catch { setIpmi(null); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const startSession = async (type: 'kvmipHtml5URL' | 'serialOverLanURL') => {
    try {
      setSessionLoading(true);
      const result = await dedicatedService.startIpmiSession(serviceName, type);
      setSessionUrl(result.value);
    } finally { setSessionLoading(false); }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="ipmi-tab">
      <div className="tab-header"><h3>{t("ipmi.title")}</h3><p className="tab-description">{t("ipmi.description")}</p></div>
      {!ipmi || !ipmi.activated ? (
        <div className="empty-state"><p>{t("ipmi.notAvailable")}</p></div>
      ) : (
        <>
          <div className="ipmi-features">
            <div className="feature-item"><label>KVM over IP</label><span className={`badge ${ipmi.supportedFeatures?.kvmoverip ? 'success' : 'inactive'}`}>{ipmi.supportedFeatures?.kvmoverip ? t("ipmi.supported") : t("ipmi.notSupported")}</span></div>
            <div className="feature-item"><label>Serial over LAN</label><span className={`badge ${ipmi.supportedFeatures?.serialOverLanUrl ? 'success' : 'inactive'}`}>{ipmi.supportedFeatures?.serialOverLanUrl ? t("ipmi.supported") : t("ipmi.notSupported")}</span></div>
          </div>
          <div className="ipmi-actions">
            {ipmi.supportedFeatures?.kvmoverip && <button className="btn-primary" onClick={() => startSession('kvmipHtml5URL')} disabled={sessionLoading}>{sessionLoading ? tCommon("loading") : t("ipmi.launchKvm")}</button>}
            {ipmi.supportedFeatures?.serialOverLanUrl && <button className="btn-secondary" onClick={() => startSession('serialOverLanURL')} disabled={sessionLoading}>{sessionLoading ? tCommon("loading") : t("ipmi.launchSol")}</button>}
          </div>
          {sessionUrl && (
            <div className="session-url">
              <label>{t("ipmi.sessionUrl")}</label>
              <a href={sessionUrl} target="_blank" rel="noopener noreferrer">{t("ipmi.openSession")}</a>
            </div>
          )}
        </>
      )}
      <div className="info-box"><h4>{t("ipmi.whatIs")}</h4><p>{t("ipmi.explanation")}</p></div>
    </div>
  );
}
export default IpmiTab;
