import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as accountService from "../../services/account.service";

const STORAGE_KEY = "ovh_credentials";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
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

  useEffect(() => {
    loadGdprData();
  }, []);

  const loadGdprData = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const [caps, reqs] = await Promise.all([
        accountService.getPrivacyCapabilities(credentials),
        accountService.getAllPrivacyRequests(credentials),
      ]);
      setCapabilities(caps);
      setRequests(reqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

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
      setModalError(err instanceof Error ? err.message : "Erreur lors de la creation de la demande");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSendConfirmationEmail = async (requestId: string) => {
    const credentials = getCredentials();
    if (!credentials) return;

    try {
      await accountService.sendErasureConfirmationEmail(credentials, requestId);
      setModalError("Email de confirmation envoye.");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
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
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="badge badge-success">Termine</span>;
      case "in_progress":
        return <span className="badge badge-info">En cours</span>;
      case "cancelled":
        return <span className="badge badge-secondary">Annule</span>;
      case "blocked":
        return <span className="badge badge-danger">Bloque</span>;
      case "confirm_verification_code":
        return <span className="badge badge-warning">En attente de confirmation</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des donnees personnelles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadGdprData} className="btn btn-primary">Reessayer</button>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === "in_progress" || r.status === "confirm_verification_code");
  const pastRequests = requests.filter(r => r.status === "completed" || r.status === "cancelled" || r.status === "blocked");

  return (
    <div className="tab-content gdpr-tab">
      <div className="gdpr-header">
        <h2>Donnees personnelles</h2>
        <p>
          Conformement au RGPD, vous avez le droit de demander la suppression de votre compte
          et de toutes les donnees personnelles associees.
        </p>
      </div>

      <div className="gdpr-section">
        <h3>Vos droits</h3>
        <div className="rights-grid">
          <div className="right-card">
            <h4>Droit d'acces</h4>
            <p>Vous pouvez consulter toutes vos donnees personnelles dans votre espace client.</p>
          </div>
          <div className="right-card">
            <h4>Droit de rectification</h4>
            <p>Vous pouvez modifier vos informations dans la section "Mon profil".</p>
          </div>
          <div className="right-card">
            <h4>Droit a l'effacement</h4>
            <p>Vous pouvez demander la suppression complete de votre compte.</p>
          </div>
          <div className="right-card">
            <h4>Droit a la portabilite</h4>
            <p>Vous pouvez exporter vos donnees au format standard.</p>
          </div>
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
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setPendingRequestId(String(request.id));
                          openModal("confirm");
                        }}
                      >
                        Confirmer
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleSendConfirmationEmail(String(request.id))}
                      >
                        Renvoyer l'email
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleCancelRequest(String(request.id))}
                  >
                    Annuler
                  </button>
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
          {capabilities?.canRequestErasure ? (
            <>
              <p className="warning-text">
                <strong>Attention :</strong> La suppression de votre compte est definitive et irréversible.
                Tous vos services seront resilies.
              </p>
              <button className="btn btn-danger" onClick={() => openModal("erasure")}>
                Demander la suppression de mon compte
              </button>
            </>
          ) : (
            <div className="cannot-erasure">
              <p>Vous ne pouvez pas demander la suppression de votre compte pour le moment.</p>
              {capabilities?.ineligibilityReasons && capabilities.ineligibilityReasons.length > 0 && (
                <ul>
                  {capabilities.ineligibilityReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {activeModal === "erasure" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3>Confirmer la demande de suppression</h3>
            <p className="warning-text">
              Vous etes sur le point de demander la suppression definitive de votre compte OVHcloud.
              Cette action est irreversible.
            </p>
            <p>Un email de confirmation vous sera envoye.</p>
            {modalError && <p className="modal-error">{modalError}</p>}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
              <button className="btn btn-danger" onClick={handleCreateErasureRequest} disabled={modalLoading}>
                {modalLoading ? "Creation..." : "Confirmer la demande"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "confirm" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3>Entrez le code de confirmation</h3>
            <p>Un code vous a ete envoye par email. Entrez-le ci-dessous pour finaliser la demande.</p>
            <div className="form-group">
              <label>Code de confirmation</label>
              <input
                type="text"
                placeholder="Code recu par email"
                value={confirmCode}
                onChange={e => setConfirmCode(e.target.value)}
              />
            </div>
            {modalError && <p className={modalError.includes("envoye") ? "modal-info" : "modal-error"}>{modalError}</p>}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
              <button
                className="btn btn-secondary"
                onClick={() => pendingRequestId && handleSendConfirmationEmail(pendingRequestId)}
              >
                Renvoyer l'email
              </button>
              <button className="btn btn-danger" onClick={handleConfirmErasure} disabled={modalLoading || !confirmCode}>
                {modalLoading ? "Confirmation..." : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
