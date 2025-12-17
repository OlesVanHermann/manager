// ============================================================
// TOKENS TAB - Gestion des tokens d'accès Metrics
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as metricsService from "../../../../services/iam.metrics";

// ============================================================
// TYPES
// ============================================================

interface Token {
  id: string;
  description?: string;
  type: "read" | "write";
  access: string;
  isRevoked: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface TokensTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des tokens d'accès au service Metrics. */
export default function TokensTab({ serviceId }: TokensTabProps) {
  const { t } = useTranslation("iam/metrics/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadTokens();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await metricsService.getTokens(serviceId);
      setTokens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleRevoke = async (tokenId: string) => {
    if (!confirm(t("tokens.confirmRevoke"))) return;
    try {
      await metricsService.revokeToken(serviceId, tokenId);
      loadTokens();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // ---------- HELPERS ----------
  const getTypeBadge = (type: Token["type"]) => {
    return (
      <span className={`token-type-badge ${type}`}>
        {type === "read" ? "📖" : "✏️"} {t(`tokens.types.${type}`)}
      </span>
    );
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTokens}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="tokens-tab">
      <div className="tab-toolbar">
        <h2>{t("tokens.title")}</h2>
        <button className="btn btn-primary">{t("tokens.create")}</button>
      </div>

      {tokens.length === 0 ? (
        <div className="empty-state">
          <h2>{t("tokens.empty.title")}</h2>
          <p>{t("tokens.empty.description")}</p>
        </div>
      ) : (
        <table className="tokens-table">
          <thead>
            <tr>
              <th>{t("tokens.columns.description")}</th>
              <th>{t("tokens.columns.type")}</th>
              <th>{t("tokens.columns.token")}</th>
              <th>{t("tokens.columns.status")}</th>
              <th>{t("tokens.columns.created")}</th>
              <th>{t("tokens.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.id} className={token.isRevoked ? "revoked" : ""}>
                <td>{token.description || "-"}</td>
                <td>{getTypeBadge(token.type)}</td>
                <td>
                  <span className="token-value">
                    {token.access.substring(0, 20)}...
                    <button className="copy-btn" onClick={() => handleCopy(token.access)} title={t("tokens.copy")}>📋</button>
                  </span>
                </td>
                <td>
                  {token.isRevoked ? (
                    <span className="status-badge badge-error">{t("tokens.status.revoked")}</span>
                  ) : (
                    <span className="status-badge badge-success">{t("tokens.status.active")}</span>
                  )}
                </td>
                <td>{new Date(token.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="token-actions">
                  {!token.isRevoked && (
                    <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleRevoke(token.id)}>{t("tokens.revoke")}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
