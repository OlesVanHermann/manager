// ============================================================
// PRIVACY TAB - Gestion RGPD et vie privée
// Styles: ./PrivacyTab.css (préfixe .privacy-)
// Service: ./PrivacyTab.service.ts (ISOLÉ)
// ============================================================

import "./PrivacyTab.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as privacyService from "./PrivacyTab.service";

// ============ TYPES LOCAUX ============

type ModalType = "erasure" | "confirm" | null;

// ============ COMPOSANT ============

export default function PrivacyTab() {
  const { t } = useTranslation("home/account/privacy");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<privacyService.PrivacyCapabilities | null>(null);
  const [requests, setRequests] = useState<privacyService.PrivacyRequest[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [confirmCode, setConfirmCode] = useState("");

  // ---------- LOAD DATA ----------
  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [caps, reqs] = await Promise.all([
        privacyService.getPrivacyCapabilities().catch(() => ({ canRequestErasure: true })),
        privacyService.getAllPrivacyRequests().catch(() => []),
      ]);
      setCapabilities(caps);
      setRequests(reqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ---------- MODAL HELPERS ----------
  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setModalError(null);
    setConfirmCode("");
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalError(null);
    setConfirmCode("");
    setPendingRequestId(null);
  };

  // ---------- ACTIONS ----------
  const handleCreateErasureRequest = async () => {
    setModalLoading(true);
    setModalError(null);
    try {
      const request = await privacyService.createErasureRequest();
      setPendingRequestId(String(request.id));
      setActiveModal("confirm");
      await loadPrivacyData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : tCommon("error.generic"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleSendConfirmationEmail = async (requestId: string) => {
    try {
      await privacyService.sendErasureConfirmationEmail(requestId);
      setModalError(t("modal.emailSent"));
    } catch (err) {
      setModalError(err instanceof Error ? err.message : tCommon("error.generic"));
    }
  };

  const handleConfirmErasure = async () => {
    if (!pendingRequestId || !confirmCode) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await privacyService.confirmErasure(pendingRequestId, confirmCode);
      await loadPrivacyData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : t("errors.invalidCode"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await privacyService.cancelErasureRequest(requestId);
      await loadPrivacyData();
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon("error.generic"));
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="privacy-badge privacy-badge-success">{t("status.completed")}</span>;
      case "in_progress":
        return <span className="privacy-badge privacy-badge-info">{t("status.inProgress")}</span>;
      case "cancelled":
        return <span className="privacy-badge privacy-badge-secondary">{t("status.cancelled")}</span>;
      case "blocked":
        return <span className="privacy-badge privacy-badge-danger">{t("status.blocked")}</span>;
      case "confirm_verification_code":
        return <span className="privacy-badge privacy-badge-warning">{t("status.pending")}</span>;
      default:
        return <span className="privacy-badge privacy-badge-secondary">{status}</span>;
    }
  };

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="privacy-content">
        <div className="privacy-loading">
          <div className="privacy-spinner"></div>
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error) {
    return (
      <div className="privacy-content">
        <div className="privacy-error">
          <p>{error}</p>
          <button onClick={loadPrivacyData} className="privacy-btn privacy-btn-primary">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  const pendingRequests = requests.filter(
    (r) => r.status === "in_progress" || r.status === "confirm_verification_code"
  );
  const pastRequests = requests.filter(
    (r) => r.status === "completed" || r.status === "cancelled" || r.status === "blocked"
  );

  return (
    <div className="privacy-content">
      <div className="privacy-header">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      {/* Section Droits */}
      <div className="privacy-section">
        <h3>{t("rights.title")}</h3>
        <div className="privacy-rights-grid">
          <div className="privacy-right-card">
            <h4>{t("rights.access.title")}</h4>
            <p>{t("rights.access.description")}</p>
          </div>
          <div className="privacy-right-card">
            <h4>{t("rights.rectification.title")}</h4>
            <p>{t("rights.rectification.description")}</p>
          </div>
          <div className="privacy-right-card">
            <h4>{t("rights.erasure.title")}</h4>
            <p>{t("rights.erasure.description")}</p>
          </div>
          <div className="privacy-right-card">
            <h4>{t("rights.portability.title")}</h4>
            <p>{t("rights.portability.description")}</p>
          </div>
        </div>
      </div>

      {/* Section Demandes */}
      <div className="privacy-section">
        <h3>{t("requests.title")}</h3>

        {pendingRequests.length > 0 && (
          <div className="privacy-requests-pending">
            <h4>{t("requests.pending")}</h4>
            {pendingRequests.map((request) => (
              <div key={request.id} className="privacy-request-card privacy-request-pending">
                <div className="privacy-request-info">
                  <span className="privacy-request-date">{privacyService.formatDate(request.creationDate)}</span>
                  {getStatusBadge(request.status)}
                </div>
                <div className="privacy-request-actions">
                  {request.status === "confirm_verification_code" && (
                    <>
                      <button
                        className="privacy-btn privacy-btn-primary privacy-btn-sm"
                        onClick={() => {
                          setPendingRequestId(String(request.id));
                          openModal("confirm");
                        }}
                      >
                        {tCommon("actions.confirm")}
                      </button>
                      <button
                        className="privacy-btn privacy-btn-secondary privacy-btn-sm"
                        onClick={() => handleSendConfirmationEmail(String(request.id))}
                      >
                        {t("requests.resendEmail")}
                      </button>
                    </>
                  )}
                  <button
                    className="privacy-btn privacy-btn-danger privacy-btn-sm"
                    onClick={() => handleCancelRequest(String(request.id))}
                  >
                    {tCommon("actions.cancel")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastRequests.length > 0 && (
          <div className="privacy-requests-history">
            <h4>{t("requests.history")}</h4>
            {pastRequests.map((request) => (
              <div key={request.id} className="privacy-request-card">
                <div className="privacy-request-info">
                  <span className="privacy-request-date">{privacyService.formatDate(request.creationDate)}</span>
                  {getStatusBadge(request.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="privacy-erasure-action">
          {capabilities?.canRequestErasure !== false ? (
            <>
              <p className="privacy-warning-text">
                <strong>{t("erasure.warning")}</strong>
              </p>
              <button className="privacy-btn privacy-btn-danger" onClick={() => openModal("erasure")}>
                {t("erasure.requestButton")}
              </button>
            </>
          ) : (
            <p>{t("erasure.unavailable")}</p>
          )}
        </div>
      </div>

      {/* Section En savoir plus */}
      <div className="privacy-section">
        <h3>{t("learnMore.title")}</h3>
        <div className="privacy-links">
          <a
            href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("learnMore.privacyPolicy")}
          </a>
        </div>
      </div>

      {/* Modal Demande d'effacement */}
      {activeModal === "erasure" && (
        <div className="privacy-modal-overlay" onClick={closeModal}>
          <div className="privacy-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="privacy-modal-close" onClick={closeModal}>
              ×
            </button>
            <h3>{t("modal.confirmRequest.title")}</h3>
            <p>{t("modal.confirmRequest.description")}</p>
            {modalError && <p className="privacy-modal-error">{modalError}</p>}
            <div className="privacy-modal-actions">
              <button className="privacy-btn privacy-btn-secondary" onClick={closeModal}>
                {tCommon("actions.cancel")}
              </button>
              <button
                className="privacy-btn privacy-btn-danger"
                onClick={handleCreateErasureRequest}
                disabled={modalLoading}
              >
                {modalLoading ? "..." : tCommon("actions.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation code */}
      {activeModal === "confirm" && (
        <div className="privacy-modal-overlay" onClick={closeModal}>
          <div className="privacy-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="privacy-modal-close" onClick={closeModal}>
              ×
            </button>
            <h3>{t("modal.enterCode.title")}</h3>
            <p>{t("modal.enterCode.description")}</p>
            <input
              type="text"
              placeholder={t("modal.enterCode.placeholder")}
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
            />
            {modalError && <p className="privacy-modal-error">{modalError}</p>}
            <div className="privacy-modal-actions">
              <button className="privacy-btn privacy-btn-secondary" onClick={closeModal}>
                {tCommon("actions.cancel")}
              </button>
              <button
                className="privacy-btn privacy-btn-secondary"
                onClick={() => pendingRequestId && handleSendConfirmationEmail(pendingRequestId)}
              >
                {t("requests.resendEmail")}
              </button>
              <button
                className="privacy-btn privacy-btn-danger"
                onClick={handleConfirmErasure}
                disabled={modalLoading || !confirmCode}
              >
                {modalLoading ? "..." : tCommon("actions.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
