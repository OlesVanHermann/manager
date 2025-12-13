import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../../types/auth.types";
import * as accountService from "../../../services/account.service";

const STORAGE_KEY = "ovh_credentials";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

type ModalType = "erasure" | "confirm" | null;

export default function GdprTab() {
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
    if (!credentials) { setError("Non authentifie"); setLoading(false); return; }
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
      setError(err instanceof Error ? err.message : "Erreur de chargement");
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
      setModalError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSendConfirmationEmail = async (requestId: string) => {
    const credentials = getCredentials();
    if (!credentials) return;
    try {
      await accountService.sendErasureConfirmationEmail(credentials, requestId);
      setModalError("Email envoye.");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur");
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
      setModalError(err instanceof Error ? err.message : "Code invalide");
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
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <span className="badge badge-success">Termine</span>;
      case "in_progress": return <span className="badge badge-info">En cours</span>;
      case "cancelled": return <span className="badge badge-secondary">Annule</span>;
      case "blocked": return <span className="badge badge-danger">Bloque</span>;
      case "confirm_verification_code": return <span className="badge badge-warning">En attente</span>;
      default: return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  if (loading) return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-content"><div className="error-state"><p>{error}</p><button onClick={loadGdprData} className="btn btn-primary">Reessayer</button></div></div>;

  const pendingRequests = requests.filter(r => r.status === "in_progress" || r.status === "confirm_verification_code");
  const pastRequests = requests.filter(r => r.status === "completed" || r.status === "cancelled" || r.status === "blocked");

  return (
    <div className="tab-content gdpr-tab">
      <div className="gdpr-header">
        <h2>Donnees personnelles</h2>
        <p>Conformement au RGPD, vous pouvez demander la suppression de votre compte.</p>
      </div>

      <div className="gdpr-section">
        <h3>Vos droits</h3>
        <div className="rights-grid">
          <div className="right-card"><h4>Droit d'acces</h4><p>Consultez vos donnees dans votre espace client.</p></div>
          <div className="right-card"><h4>Droit de rectification</h4><p>Modifiez vos informations dans "Mon profil".</p></div>
          <div className="right-card"><h4>Droit a l'effacement</h4><p>Demandez la suppression de votre compte.</p></div>
          <div className="right-card"><h4>Droit a la portabilite</h4><p>Exportez vos donnees.</p></div>
        </div>
      </div>

      <div className="gdpr-section">
        <h3>Demandes de suppression</h3>
        {pendingRequests.length > 0 && (
          <div className="pending-requests">
            <h4>Demandes en cours</h4>
            {pendingRequests.map(request => (
              <div key={request.id} className="request-card pending">
                <div className="request-info">
                  <span className="request-date">{formatDate(request.creationDate)}</span>
                  {getStatusBadge(request.status)}
                </div>
                <div className="request-actions">
                  {request.status === "confirm_verification_code" && (
                    <>
                      <button className="btn btn-sm btn-primary" onClick={() => { setPendingRequestId(String(request.id)); openModal("confirm"); }}>Confirmer</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleSendConfirmationEmail(String(request.id))}>Renvoyer email</button>
                    </>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => handleCancelRequest(String(request.id))}>Annuler</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {pastRequests.length > 0 && (
          <div className="past-requests">
            <h4>Historique</h4>
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
              <p className="warning-text"><strong>Attention :</strong> Action irreversible.</p>
              <button className="btn btn-danger" onClick={() => openModal("erasure")}>Demander la suppression</button>
            </>
          ) : (
            <p>Suppression non disponible actuellement.</p>
          )}
        </div>
      </div>

      <div className="gdpr-section">
        <h3>En savoir plus</h3>
        <div className="gdpr-links">
          <a href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/" target="_blank" rel="noopener noreferrer">Politique de confidentialite</a>
        </div>
      </div>

      {activeModal === "erasure" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>x</button>
            <h3>Confirmer la demande</h3>
            <p>Un email de confirmation vous sera envoye.</p>
            {modalError && <p className="modal-error">{modalError}</p>}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
              <button className="btn btn-danger" onClick={handleCreateErasureRequest} disabled={modalLoading}>{modalLoading ? "..." : "Confirmer"}</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "confirm" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>x</button>
            <h3>Code de confirmation</h3>
            <input type="text" placeholder="Code" value={confirmCode} onChange={e => setConfirmCode(e.target.value)} />
            {modalError && <p className="modal-error">{modalError}</p>}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
              <button className="btn btn-secondary" onClick={() => pendingRequestId && handleSendConfirmationEmail(pendingRequestId)}>Renvoyer</button>
              <button className="btn btn-danger" onClick={handleConfirmErasure} disabled={modalLoading || !confirmCode}>{modalLoading ? "..." : "Confirmer"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
