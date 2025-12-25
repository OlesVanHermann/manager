// ============================================================
// CREDENTIALS TAB - Gestion des credentials OKMS
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as credentialsService from "./CredentialsTab";
import type { Credential } from "../../okms.types";
import "./CredentialsTab.css";

// ============================================================
// TYPES
// ============================================================

interface CredentialsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des credentials pour accéder à l'OKMS. */
export default function CredentialsTab({ serviceId }: CredentialsTabProps) {
  const { t } = useTranslation("iam/okms/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadCredentials();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await credentialsService.getCredentials(serviceId);
      setCredentials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleRevoke = async (credentialId: string) => {
    if (!confirm(t("credentials.confirmRevoke"))) return;
    try {
      await credentialsService.revokeCredential(serviceId, credentialId);
      loadCredentials();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDownloadCert = (credential: Credential) => {
    if (!credential.certificatePem) return;
    const blob = new Blob([credential.certificatePem], { type: "application/x-pem-file" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${credential.name}.pem`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: Credential["status"]) => {
    const classes: Record<string, string> = {
      active: "badge-success",
      expired: "badge-warning",
      revoked: "badge-error",
    };
    return <span className={`status-badge ${classes[status]}`}>{t(`credentials.status.${status}`)}</span>;
  };

  const isExpiringSoon = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="credentials-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="credentials-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadCredentials}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="credentials-tab">
      <div className="credentials-toolbar">
        <button className="btn btn-primary">{t("credentials.create")}</button>
      </div>

      {credentials.length === 0 ? (
        <div className="credentials-empty-state">
          <h2>{t("credentials.empty.title")}</h2>
          <p>{t("credentials.empty.description")}</p>
        </div>
      ) : (
        <div className="credentials-list">
          {credentials.map((credential) => (
            <div key={credential.id} className="credentials-card">
              <div className="credentials-card-header">
                <span className="credentials-name">{credential.name}</span>
                {getStatusBadge(credential.status)}
              </div>
              {credential.description && (
                <p className="credentials-description">{credential.description}</p>
              )}
              <div className="credentials-details">
                <div className="credentials-detail-item">
                  <span className="credentials-detail-label">{t("credentials.fields.id")}</span>
                  <span className="credentials-detail-value">{credential.id}</span>
                </div>
                <div className="credentials-detail-item">
                  <span className="credentials-detail-label">{t("credentials.fields.created")}</span>
                  <span className="credentials-detail-value">{new Date(credential.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="credentials-detail-item">
                  <span className="credentials-detail-label">{t("credentials.fields.expires")}</span>
                  <span className="credentials-detail-value">
                    {new Date(credential.expiresAt).toLocaleDateString("fr-FR")}
                    {isExpiringSoon(credential.expiresAt) && (
                      <span className="credentials-expiring-warning"> ⚠️ {t("credentials.expiringSoon")}</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="credentials-actions">
                {credential.certificatePem && (
                  <button className="btn btn-sm btn-outline" onClick={() => handleDownloadCert(credential)}>
                    {t("credentials.downloadCert")}
                  </button>
                )}
                {credential.status === "active" && (
                  <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleRevoke(credential.id)}>
                    {t("credentials.revoke")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
