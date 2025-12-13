import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as accountService from "../../services/account.service";

const STORAGE_KEY = "ovh_credentials";

export default function GdprTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<accountService.PrivacyRequest[]>([]);
  const [capabilities, setCapabilities] = useState<accountService.PrivacyCapabilities | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadData = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const [reqs, caps] = await Promise.all([
        accountService.getAllPrivacyRequests(credentials),
        accountService.getPrivacyCapabilities(credentials),
      ]);
      setRequests(reqs);
      setCapabilities(caps);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      blocked: { label: "Bloque", className: "badge-error" },
      cancelled: { label: "Annule", className: "badge-neutral" },
      completed: { label: "Termine", className: "badge-success" },
      confirm_verification_code: { label: "En attente", className: "badge-warning" },
      in_progress: { label: "En cours", className: "badge-info" },
    };
    return statusMap[status] || { label: status, className: "badge-neutral" };
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadData}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content gdpr-tab">
      {/* Delete Account Section */}
      <div className="gdpr-delete-section">
        <h2>Supprimer mon compte OVHcloud</h2>
        <p className="delete-warning">
          <strong>
            Si vous choisissez de supprimer votre compte, vous ne pourrez plus le reactiver. 
            Nous procederons a la suppression de votre compte apres la confirmation.
          </strong>
        </p>
        <p className="delete-info">
          Conformement a notre politique d'utilisation des donnees, certaines des donnees 
          (notamment logs de connexion, donnees comptables et financieres, etc.) resterons 
          dans nos bases de donnees afin de nous conformer a nos obligations legales et 
          faire valoir nos droits, et ce, conformement a la reglementation en vigueur.
        </p>
        
        {capabilities && !capabilities.canRequestErasure && capabilities.ineligibilityReasons && (
          <div className="warning-box">
            <p><strong>Suppression impossible :</strong></p>
            <ul>
              {capabilities.ineligibilityReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <a 
          href="https://www.ovh.com/manager/#/useraccount/gdpr"
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-primary ${!capabilities?.canRequestErasure ? "disabled" : ""}`}
        >
          Supprimer mon compte
        </a>
      </div>

      {/* Requests Table Section */}
      <div className="gdpr-requests-section">
        <h3>Vos demandes</h3>
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Demande</th>
                <th>Statut</th>
                <th>Ticket support</th>
                <th>Raison</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    Aucune demande
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const status = getStatusBadge(req.status);
                  return (
                    <tr key={req.id}>
                      <td>{formatDate(req.creationDate)}</td>
                      <td>{req.type === "erasure" ? "Suppression de compte" : req.type}</td>
                      <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                      <td>{req.ticketId || "-"}</td>
                      <td>{req.reasons?.join(", ") || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
