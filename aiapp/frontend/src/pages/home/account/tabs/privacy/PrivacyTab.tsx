import "./PrivacyTab.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhCredentials } from "../../../../../types/auth.types";
import * as accountService from "../../../../../services/home.account";

const STORAGE_KEY = "ovh_credentials";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

type ModalType = "erasure" | "confirm" | null;

export default function GdprTab() {
  const { t } = useTranslation('home/account/privacy');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<accountService.PrivacyCapabilities | null>(null);
  const [requests, setRequests] = useState<accountService.PrivacyRequest[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [confirmCode, setConfirmCode] = useState("");

  useEffect(() => { loadGdprData(); }, []);

  const loadGdprData = async () => {
    const credentials = getCredentials();
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      let caps: accountService.PrivacyCapabilities = { canRequestErasure: true };
      let reqs: accountService.PrivacyRequest[] = [];
      try { caps = await accountService.getPrivacyCapabilities(credentials); } catch { caps = { canRequestErasure: true }; }
      try { reqs = await accountService.getAllPrivacyRequests(credentials); } catch { reqs = []; }
      setCapabilities(caps);
      setRequests(reqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: ModalType) => { setActiveModal(type); setModalError(null); setConfirmCode(""); };
  const closeModal = () => { setActiveModal(null); setModalError(null); setConfirmCode(""); setPendingRequestId(null); };

  const handleCreateErasureRequest = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const request = await accountService.createErasureRequest(credentials);
      setPendingRequestId(String(request.id));
      setActiveModal("confirm");
      await loadGdprData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : tCommon('error.generic'));
    } finally {
      setModalLoading(false);
    }
  };

  const handleSendConfirmationEmail = async (requestId: string) => {
    const credentials = getCredentials();
    if (!credentials) return;
    try {
      await accountService.sendErasureConfirmationEmail(credentials, requestId);
      setModalError(t('modal.emailSent'));
    } catch (err) {
      setModalError(err instanceof Error ? err.message : tCommon('error.generic'));
    }
  };

  const handleConfirmErasure = async () => {
    const credentials = getCredentials();
    if (!credentials || !pendingRequestId || !confirmCode) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await accountService.confirmErasure(credentials, pendingRequestId, confirmCode);
      await loadGdprData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : t('errors.invalidCode'));
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    const credentials = getCredentials();
    if (!credentials) return;
    try {
      await accountService.cancelErasureRequest(credentials, requestId);
      await loadGdprData();
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon('error.generic'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <span className="badge badge-success">{t('status.completed')}</span>;
      case "in_progress": return <span className="badge badge-info">{t('status.inProgress')}</span>;
      case "cancelled": return <span className="badge badge-secondary">{t('status.cancelled')}</span>;
      case "blocked": return <span className="badge badge-danger">{t('status.blocked')}</span>;
      case "confirm_verification_code": return <span className="badge badge-warning">{t('status.pending')}</span>;
      default: return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  if (loading) return <div className="tab-content"><div className="privacy-loading-state"><div className="privacy-spinner"></div><p>{tCommon('loading')}</p></div></div>;
  if (error) return <div className="tab-content"><div className="error-state"><p>{error}</p><button onClick={loadGdprData} className="btn btn-primary">{tCommon('actions.refresh')}</button></div></div>;

  const pendingRequests = requests.filter(r => r.status === "in_progress" || r.status === "confirm_verification_code");
  const pastRequests = requests.filter(r => r.status === "completed" || r.status === "cancelled" || r.status === "blocked");

  return (
    <div className="tab-content gdpr-tab">
      <div className="gdpr-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <div className="gdpr-section">
        <h3>{t('rights.title')}</h3>
        <div className="rights-grid">
          <div className="right-card"><h4>{t('rights.access.title')}</h4><p>{t('rights.access.description')}</p></div>
          <div className="right-card"><h4>{t('rights.rectification.title')}</h4><p>{t('rights.rectification.description')}</p></div>
          <div className="right-card"><h4>{t('rights.erasure.title')}</h4><p>{t('rights.erasure.description')}</p></div>
          <div className="right-card"><h4>{t('rights.portability.title')}</h4><p>{t('rights.portability.description')}</p></div>
        </div>
      </div>

      <div className="gdpr-section">
        <h3>{t('requests.title')}</h3>
        {pendingRequests.length > 0 && (
          <div className="pending-requests">
            <h4>{t('requests.pending')}</h4>
            {pendingRequests.map(request => (
              <div key={request.id} className="request-card pending">
                <div className="request-info">
                  <span className="request-date">{formatDate(request.creationDate)}</span>
                  {getStatusBadge(request.status)}
                </div>
                <div className="request-actions">
                  {request.status === "confirm_verification_code" && (
                    <>
                      <button className="btn btn-sm btn-primary" onClick={() => { setPendingRequestId(String(request.id)); openModal("confirm"); }}>{tCommon('actions.confirm')}</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleSendConfirmationEmail(String(request.id))}>{t('requests.resendEmail')}</button>
                    </>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => handleCancelRequest(String(request.id))}>{tCommon('actions.cancel')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {pastRequests.length > 0 && (
          <div className="past-requests">
            <h4>{t('requests.history')}</h4>
            {pastRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-info">
                  <span className="request-date">{formatDate(request.creationDate)}</span>
                  {getStatusBadge(request.status)}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="erasure-action">
          {capabilities?.canRequestErasure !== false ? (
            <>
              <p className="warning-text"><strong>{t('erasure.warning')}</strong></p>
              <button className="btn btn-danger" onClick={() => openModal("erasure")}>{t('erasure.requestButton')}</button>
            </>
          ) : (
            <p>{t('erasure.unavailable')}</p>
          )}
        </div>
      </div>

      <div className="gdpr-section">
        <h3>{t('learnMore.title')}</h3>
        <div className="gdpr-links">
          <a href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/" target="_blank" rel="noopener noreferrer">{t('learnMore.privacyPolicy')}</a>
        </div>
      </div>

      {activeModal === "erasure" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h3>{t('modal.confirmRequest.title')}</h3>
            <p>{t('modal.confirmRequest.description')}</p>
            {modalError && <p className="modal-error">{modalError}</p>}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>{tCommon('actions.cancel')}</button>
              <button className="btn btn-danger" onClick={handleCreateErasureRequest} disabled={modalLoading}>{modalLoading ? "..." : tCommon('actions.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "confirm" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h3>{t('modal.enterCode.title')}</h3>
            <input type="text" placeholder={t('modal.enterCode.placeholder')} value={confirmCode} onChange={e => setConfirmCode(e.target.value)} />
            {modalError && <p className="modal-error">{modalError}</p>}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>{tCommon('actions.cancel')}</button>
              <button className="btn btn-secondary" onClick={() => pendingRequestId && handleSendConfirmationEmail(pendingRequestId)}>{t('requests.resendEmail')}</button>
              <button className="btn btn-danger" onClick={handleConfirmErasure} disabled={modalLoading || !confirmCode}>{modalLoading ? "..." : tCommon('actions.confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
