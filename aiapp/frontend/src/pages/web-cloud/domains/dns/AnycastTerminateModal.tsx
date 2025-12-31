// ============================================================
// MODAL: Anycast Terminate - Résilier DNS Anycast
// Ref: target_.web-cloud.domain.modal-anycast-terminate.svg
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

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export function AnycastTerminateModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dnsservers");
  const { t: tCommon } = useTranslation("common");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTerminate = async () => {
    try {
      setLoading(true);
      setError(null);
      await dnsServersService.terminateAnycast(domain);
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
      <div className="dnsservers-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="dnsservers-modal-header">
          <h3>{t("anycast.terminateTitle")}</h3>
          <button className="dnsservers-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="dnsservers-modal-body">
          <p className="anycast-confirm-text">{t("anycast.terminateConfirm", { domain })}</p>
          <p className="anycast-description-text">{t("anycast.terminateDescription")}</p>
          <div className="anycast-warning-banner">
            <WarningIcon />
            <span>{t("anycast.terminateWarning")}</span>
          </div>
          {error && <div className="dnsservers-form-error">{error}</div>}
        </div>
        <div className="dnsservers-modal-footer">
          <button className="dnsservers-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="dnsservers-btn-danger" onClick={handleTerminate} disabled={loading}>
            {loading ? tCommon("loading") : t("anycast.terminate")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnycastTerminateModal;
