// ============================================================
// MODAL: AuthInfo - Affichage du code de transfert
// Import depuis le service isolé GeneralTab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "../GeneralTab.service";

interface Props {
  domain: string;
  onClose: () => void;
}

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/** Modal affichant le code AUTH/INFO pour transfert sortant. */
export function AuthInfoModal({ domain, onClose }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");

  const [authInfo, setAuthInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const code = await generalService.getAuthInfo(domain);
        setAuthInfo(code);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  const handleCopy = async () => {
    if (!authInfo) return;
    try {
      await navigator.clipboard.writeText(authInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Impossible de copier dans le presse-papiers");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("authInfo.title")}</h2>
          <p>{t("authInfo.subtitle", { domain })}</p>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="dom-authinfo-skeleton" style={{ height: "60px" }} />
          ) : error ? (
            <div className="error-message">{t("authInfo.error")}</div>
          ) : (
            <>
              <div className="authinfo-code-container">
                <code className="authinfo-code">{authInfo}</code>
                <button className="btn-copy" onClick={handleCopy} title={t("authInfo.copy")}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-box" style={{ marginTop: "var(--space-4)" }}>
                <p>{t("authInfo.warning")}</p>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>{t("authInfo.close")}</button>
        </div>
      </div>
    </div>
  );
}
