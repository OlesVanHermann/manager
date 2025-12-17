// ============================================================
// SERVICE ACCOUNT IDENTITIES - Section comptes de service
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhCredentials } from "../../../../types/auth.types";
import * as iamService from "../../../../services/iam";

// ============ TYPES ============

interface DecodedIdentity {
  type: string;
  id: string;
  urn: string;
}

interface ServiceAccountWithMessage extends iamService.IamServiceAccount {
  urn: string;
  message?: string;
}

interface ServiceAccountIdentitiesProps {
  identities: DecodedIdentity[];
  credentials: OvhCredentials;
  readOnly?: boolean;
  onRemove: (urn: string) => void;
}

// ============ COMPOSANT ============

/** Affiche la liste des comptes de service associés (lecture seule, pas d'ajout). */
export function ServiceAccountIdentities({
  identities,
  credentials,
  readOnly = false,
  onRemove,
}: ServiceAccountIdentitiesProps) {
  const { t } = useTranslation("iam/identities");

  // ---------- STATE ----------
  const [serviceAccounts, setServiceAccounts] = useState<ServiceAccountWithMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadServiceAccounts();
  }, [identities]);

  // ---------- LOADERS ----------
  const loadServiceAccounts = async () => {
    setLoading(true);
    const results = await Promise.all(
      identities.map(async (identity) => {
        try {
          const sa = await iamService.getServiceAccount(credentials, identity.id);
          return sa ? { ...sa, urn: identity.urn } : null;
        } catch (err) {
          return {
            clientId: identity.id,
            name: identity.id,
            description: "",
            identity: identity.urn,
            urn: identity.urn,
            message: err instanceof Error ? err.message : "Erreur",
          };
        }
      })
    );
    setServiceAccounts(results.filter((sa): sa is ServiceAccountWithMessage => sa !== null));
    setLoading(false);
  };

  // ---------- RENDER ----------
  return (
    <section className="identity-section">
      <h4>{t("serviceAccounts.title")}</h4>

      {loading ? (
        <div className="loading-inline"><div className="spinner-sm"></div></div>
      ) : serviceAccounts.length === 0 ? (
        <p className="empty-text">{t("serviceAccounts.empty")}</p>
      ) : (
        <table className="data-table compact">
          <thead>
            <tr>
              <th>{t("serviceAccounts.columns.name")}</th>
              <th>{t("serviceAccounts.columns.clientId")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {serviceAccounts.map((sa) => (
              <tr key={sa.urn}>
                <td>
                  <div>{sa.name || sa.clientId}</div>
                  {sa.message && <div className="text-error text-sm">{sa.message}</div>}
                </td>
                <td className="text-mono">{sa.clientId}</td>
                <td className="actions-cell">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onRemove(sa.urn)}
                    disabled={readOnly}
                    title={t("common.delete")}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
