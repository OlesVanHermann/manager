// ============================================================
// TERMINATE TAB - Résiliation d'hébergement
// NAV3: Offre > NAV4: Résiliation
// Features: warning, options, confirmation modal
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { terminateService, type ServiceInfos } from "./TerminateTab.service";
import type { Hosting } from "../../hosting.types";
import "./TerminateTab.css";

interface TerminateTabProps {
  serviceName: string;
  details: Hosting;
  onRefresh?: () => void;
}

type TerminationOption = "at_expiration" | "cancel_renewal" | "immediate";

export function TerminateTab({ serviceName, details, onRefresh }: TerminateTabProps) {
  const { t } = useTranslation("web-cloud/hosting/index");

  const [loading, setLoading] = useState(true);
  const [serviceInfos, setServiceInfos] = useState<ServiceInfos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<TerminationOption>("at_expiration");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load service infos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const infos = await terminateService.getServiceInfos(serviceName);
      setServiceInfos(infos);
    } catch (err) {
      setError("Erreur lors du chargement des informations");
      console.error("[TerminateTab] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Check if termination is already scheduled
  const isTerminationScheduled = serviceInfos?.renew?.deleteAtExpiration === true;

  // Handle termination
  const handleTerminate = async () => {
    if (confirmInput !== serviceName) return;

    try {
      setProcessing(true);
      setError(null);

      if (selectedOption === "at_expiration" || selectedOption === "immediate") {
        // Request termination
        await terminateService.terminate(serviceName);
      } else if (selectedOption === "cancel_renewal") {
        // Just disable auto-renewal
        await terminateService.updateServiceInfos(serviceName, {
          renew: { automatic: false, deleteAtExpiration: false },
        });
      }

      setSuccess(true);
      setShowConfirmModal(false);
      if (onRefresh) onRefresh();
      await loadData();
    } catch (err) {
      setError("Erreur lors de la résiliation. Veuillez réessayer.");
      console.error("[TerminateTab] Termination error:", err);
    } finally {
      setProcessing(false);
    }
  };

  // Handle cancel termination
  const handleCancelTermination = async () => {
    try {
      setProcessing(true);
      setError(null);
      await terminateService.cancelTermination(serviceName);
      setSuccess(false);
      if (onRefresh) onRefresh();
      await loadData();
    } catch (err) {
      setError("Erreur lors de l'annulation de la résiliation.");
    } finally {
      setProcessing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="terminatetab">
        <div className="terminatetab-skeleton">
          <div className="terminatetab-skeleton-block" />
          <div className="terminatetab-skeleton-block" />
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="terminatetab">
        <div className="terminatetab-success">
          <div className="terminatetab-success-icon">✓</div>
          <h3>Résiliation enregistrée</h3>
          <p>
            Votre demande de résiliation a été prise en compte.
            {selectedOption === "at_expiration" && (
              <> Le service sera supprimé le {formatDate(serviceInfos?.expiration || "")}.</>
            )}
            {selectedOption === "cancel_renewal" && (
              <> Le renouvellement automatique a été désactivé.</>
            )}
          </p>
          <button className="terminatetab-btn-back" onClick={() => setSuccess(false)}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Already scheduled for termination
  if (isTerminationScheduled) {
    return (
      <div className="terminatetab">
        <div className="terminatetab-scheduled">
          <div className="terminatetab-scheduled-icon">⏳</div>
          <h3>Résiliation programmée</h3>
          <p>
            Ce service est programmé pour être résilié le{" "}
            <strong>{formatDate(serviceInfos?.expiration || "")}</strong>.
          </p>
          <p className="terminatetab-scheduled-note">
            Toutes les données seront définitivement supprimées à cette date.
          </p>
          <button
            className="terminatetab-btn-cancel-termination"
            onClick={handleCancelTermination}
            disabled={processing}
          >
            {processing ? "Annulation..." : "Annuler la résiliation"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="terminatetab">
      {/* Warning Banner */}
      <div className="terminatetab-warning">
        <div className="terminatetab-warning-icon">⚠️</div>
        <div className="terminatetab-warning-content">
          <strong>Attention : action irréversible</strong>
          <p>
            La résiliation de votre hébergement entraînera la suppression définitive de toutes
            les données associées. Cette action ne peut pas être annulée.
          </p>
        </div>
      </div>

      {/* Service Info */}
      <div className="terminatetab-info">
        <h3>Informations du service</h3>
        <div className="terminatetab-info-grid">
          <div className="terminatetab-info-item">
            <span className="terminatetab-info-label">Nom du service</span>
            <span className="terminatetab-info-value">{serviceName}</span>
          </div>
          <div className="terminatetab-info-item">
            <span className="terminatetab-info-label">Offre</span>
            <span className="terminatetab-info-value">{details.offer || "-"}</span>
          </div>
          <div className="terminatetab-info-item">
            <span className="terminatetab-info-label">Date d'expiration</span>
            <span className="terminatetab-info-value">
              {formatDate(serviceInfos?.expiration || "")}
            </span>
          </div>
          <div className="terminatetab-info-item">
            <span className="terminatetab-info-label">Renouvellement</span>
            <span className="terminatetab-info-value">
              {serviceInfos?.renew?.automatic ? "Automatique" : "Manuel"}
            </span>
          </div>
        </div>
      </div>

      {/* Termination Options */}
      <div className="terminatetab-options">
        <h3>Options de résiliation</h3>
        <div className="terminatetab-options-list">
          <label
            className={`terminatetab-option ${selectedOption === "at_expiration" ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="termination"
              value="at_expiration"
              checked={selectedOption === "at_expiration"}
              onChange={() => setSelectedOption("at_expiration")}
            />
            <div className="terminatetab-option-content">
              <strong>Résilier à la date d'expiration</strong>
              <span className="terminatetab-option-badge recommended">Recommandé</span>
              <p>
                Le service sera supprimé le {formatDate(serviceInfos?.expiration || "")}.
                Vous conservez l'accès jusqu'à cette date.
              </p>
            </div>
          </label>

          <label
            className={`terminatetab-option ${selectedOption === "cancel_renewal" ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="termination"
              value="cancel_renewal"
              checked={selectedOption === "cancel_renewal"}
              onChange={() => setSelectedOption("cancel_renewal")}
            />
            <div className="terminatetab-option-content">
              <strong>Annuler le renouvellement automatique</strong>
              <p>
                Le service ne sera pas renouvelé automatiquement. Vous pourrez le renouveler
                manuellement avant l'expiration si vous changez d'avis.
              </p>
            </div>
          </label>

          <label
            className={`terminatetab-option ${selectedOption === "immediate" ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="termination"
              value="immediate"
              checked={selectedOption === "immediate"}
              onChange={() => setSelectedOption("immediate")}
            />
            <div className="terminatetab-option-content">
              <strong>Résiliation immédiate</strong>
              <span className="terminatetab-option-badge danger">Irréversible</span>
              <p>
                Le service sera supprimé sous 24 heures. Aucun remboursement ne sera effectué
                pour la période restante.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Consequences */}
      <div className="terminatetab-consequences">
        <h3>Conséquences de la résiliation</h3>
        <ul>
          <li>Suppression de tous les fichiers hébergés</li>
          <li>Suppression de toutes les bases de données</li>
          <li>Suppression des comptes email associés</li>
          <li>Perte des configurations (SSL, .htaccess, etc.)</li>
          <li>Suppression des tâches CRON</li>
          <li>Libération du nom de domaine principal</li>
        </ul>
      </div>

      {/* Error */}
      {error && (
        <div className="terminatetab-error-banner">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Action Button */}
      <div className="terminatetab-actions">
        <button
          className="terminatetab-btn-terminate"
          onClick={() => setShowConfirmModal(true)}
        >
          Résilier ce service
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="terminatetab-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="terminatetab-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terminatetab-modal-header">
              <h3>Confirmer la résiliation</h3>
              <button
                className="terminatetab-modal-close"
                onClick={() => setShowConfirmModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="terminatetab-modal-body">
              <div className="terminatetab-modal-warning">
                <span>⚠️</span>
                <p>
                  Cette action est <strong>irréversible</strong>. Toutes les données seront
                  définitivement supprimées.
                </p>
              </div>
              <div className="terminatetab-modal-confirm">
                <label>
                  Pour confirmer, saisissez le nom du service :{" "}
                  <strong>{serviceName}</strong>
                </label>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder={serviceName}
                  autoFocus
                />
              </div>
            </div>
            <div className="terminatetab-modal-footer">
              <button
                className="terminatetab-btn-cancel"
                onClick={() => setShowConfirmModal(false)}
                disabled={processing}
              >
                Annuler
              </button>
              <button
                className="terminatetab-btn-confirm"
                onClick={handleTerminate}
                disabled={confirmInput !== serviceName || processing}
              >
                {processing ? "Résiliation en cours..." : "Confirmer la résiliation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TerminateTab;
