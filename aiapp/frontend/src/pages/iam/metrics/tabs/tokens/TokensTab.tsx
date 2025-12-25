// ============================================================
// TOKENS TAB - Gestion des tokens d'accès Metrics
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as tokensService from "./TokensTab.service";
import type { Token } from "../metrics.types";
import "./TokensTab.css";

// ============================================================
// TYPES
// ============================================================

interface TokensTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des tokens d'accès au service Metrics. */
export default function TokensTab({ serviceId }: TokensTabProps) {
  const { t } = useTranslation("iam/metrics/tokens");
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
      const data = await tokensService.getTokens(serviceId);
      setTokens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleRevoke = async (tokenId: string) => {
    if (!confirm(t("confirmRevoke"))) return;
    try {
      await tokensService.revokeToken(serviceId, tokenId);
      loadTokens();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleCopy = (text: string) => {
    tokensService.copyToClipboard(text);
  };

  // ---------- HELPERS ----------
  const getTypeBadge = (type: Token["type"]) => {
    return (
      <span className={`tokens-type-badge ${type}`}>
        {type === "read" ? "📖" : "✏️"} {t(`tokens.types.${type}`)}
      </span>
    );
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tokens-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="tokens-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTokens}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="tokens-tab">
      <div className="tokens-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      {tokens.length === 0 ? (
        <div className="tokens-empty-state">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="tokens-table">
          <thead>
            <tr>
              <th>{t("columns.description")}</th>
              <th>{t("columns.type")}</th>
              <th>{t("columns.token")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.created")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.id} className={token.isRevoked ? "revoked" : ""}>
                <td>{token.description || "-"}</td>
                <td>{getTypeBadge(token.type)}</td>
                <td>
                  <span className="tokens-value">
                    {token.access.substring(0, 20)}...
                    <button className="tokens-copy-btn" onClick={() => handleCopy(token.access)} title={t("copy")}>📋</button>
                  </span>
                </td>
                <td>
                  {token.isRevoked ? (
                    <span className="tokens-status-badge badge-error">{t("status.revoked")}</span>
                  ) : (
                    <span className="tokens-status-badge badge-success">{t("status.active")}</span>
                  )}
                </td>
                <td>{new Date(token.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="tokens-actions">
                  {!token.isRevoked && (
                    <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleRevoke(token.id)}>{t("revoke")}</button>
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
