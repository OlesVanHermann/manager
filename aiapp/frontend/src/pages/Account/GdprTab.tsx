import { useState, useEffect } from "react";
import * as accountService from "../../services/account.service";
import type { OvhCredentials } from "../../types/auth.types";

const STORAGE_KEY = "ovh_credentials";

export default function GdprTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<accountService.PrivacyCapabilities | null>(null);
  const [requests, setRequests] = useState<accountService.PrivacyRequest[]>([]);

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
      // Load capabilities - may fail if not available
      let caps: accountService.PrivacyCapabilities | null = null;
      try {
        caps = await accountService.getPrivacyCapabilities(credentials);
      } catch {
        caps = { canRequestErasure: true };
      }
      setCapabilities(caps);

      // Load requests - may fail or return empty
      let reqs: accountService.PrivacyRequest[] = [];
      try {
        reqs = await accountService.getAllPrivacyRequests(credentials);
      } catch {
        reqs = [];
      }
      setRequests(reqs);
      setError(null);
    } catch (err) {
      // Don't show error, just show empty state
      setCapabilities({ canRequestErasure: true });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      blocked: "En cours avec l'equipe support",
      cancelled: "Annule",
      completed: "Termine",
      confirm_verification_code: "Confirmer le code de verification",
      in_progress: "En cours",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      blocked: "badge-warning",
      cancelled: "badge-warning",
      completed: "badge-success",
      confirm_verification_code: "badge-info",
      in_progress: "badge-info",
    };
    return classes[status] || "badge-info";
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

  return (
    <div className="tab-content gdpr-tab">
      {/* Delete Account Section */}
      <div className="gdpr-delete-section">
        <h2>Supprimer mon compte OVHcloud</h2>
        <p className="delete-warning">
          <strong>Si vous choisissez de supprimer votre compte, vous ne pourrez plus le reactiver. 
          Nous procederons a la suppression de votre compte apres la confirmation.</strong>
        </p>
        <p className="delete-info">
          Conformement a notre politique d'utilisation des donnees, certaines des donnees 
          (notamment logs de connexion, donnees comptables et financieres, etc.) resterons dans nos bases 
          de donnees afin de nous conformer a nos obligations legales et faire valoir nos droits, 
          et ce, conformement a la reglementation en vigueur.
        </p>
        
        <a 
          href="https://www.ovh.com/manager/#/useraccount/gdpr"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Supprimer mon compte
        </a>
      </div>

      {/* Requests Table */}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    Aucun resultat
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>{formatDate(request.creationDate)}</td>
                    <td>Droit d'effacement</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td>
                      {request.ticketId ? (
                        <a 
                          href={`https://help.ovhcloud.com/csm?id=csm_ticket&number=${request.ticketId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          #{request.ticketId}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{request.reasons?.join(", ") || "-"}</td>
                    <td>
                      {request.status === "confirm_verification_code" && (
                        <a 
                          href={`https://www.ovh.com/manager/#/useraccount/gdpr/confirm/${request.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-link"
                        >
                          Confirmer
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
