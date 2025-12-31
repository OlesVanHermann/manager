// ============================================================
// MODAL: Anycast - Activer DNS Anycast
// Ref: target_.web-cloud.domain.modal-anycast.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dnsServersService } from "./dnsservers/DnsServersTab.service";

interface Props {
  domain: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export function AnycastModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dnsservers");
  const { t: tCommon } = useTranslation("common");

  const [acceptCGU, setAcceptCGU] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (!acceptCGU) {
      setError(t("anycast.errorAcceptCGU"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await dnsServersService.activateAnycast(domain);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dnsservers-modal-overlay" onClick={onClose}>
      <div className="dnsservers-modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="dnsservers-modal-header anycast-header">
          <h3>{t("anycast.activateTitle")}</h3>
          <button className="dnsservers-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="dnsservers-modal-body">
          <div className="anycast-info-banner">
            <p>{t("anycast.description")}</p>
          </div>
          <div className="anycast-domain-row">
            <span className="anycast-label">{t("anycast.domain")}</span>
            <span className="anycast-value">{domain}</span>
          </div>
          <div className="anycast-advantages">
            <h4>{t("anycast.advantagesTitle")}</h4>
            <ul>
              <li><CheckIcon /> {t("anycast.advantage1")}</li>
              <li><CheckIcon /> {t("anycast.advantage2")}</li>
              <li><CheckIcon /> {t("anycast.advantage3")}</li>
              <li><CheckIcon /> {t("anycast.advantage4")}</li>
            </ul>
          </div>
          <div className="anycast-pricing">
            <span className="anycast-price">1,00 € HT/mois</span>
            <span className="anycast-period">{t("anycast.noCommitment")}</span>
          </div>
          <label className="anycast-cgu">
            <input type="checkbox" checked={acceptCGU} onChange={(e) => setAcceptCGU(e.target.checked)} />
            <span>{t("anycast.acceptCGU")}</span>
          </label>
          {error && <div className="dnsservers-form-error">{error}</div>}
        </div>
        <div className="dnsservers-modal-footer">
          <button className="dnsservers-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="dnsservers-btn-primary" onClick={handleActivate} disabled={loading || !acceptCGU}>
            {loading ? tCommon("loading") : t("anycast.activate")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnycastModal;
