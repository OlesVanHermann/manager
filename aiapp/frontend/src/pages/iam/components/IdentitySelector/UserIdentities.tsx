// ============================================================
// USER IDENTITIES - Section utilisateurs locaux
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhCredentials } from "../../../../types/auth.types";
import * as iamService from "../../../../services/iam";
import { SelectModal, SelectOption } from "../SelectModal";

// ============ TYPES ============

interface DecodedIdentity {
  type: string;
  id: string;
  urn: string;
}

interface UserWithMessage extends iamService.IamUser {
  urn: string;
  message?: string;
}

interface UserIdentitiesProps {
  identities: DecodedIdentity[];
  credentials: OvhCredentials;
  readOnly?: boolean;
  onAdd: (urns: string[]) => void;
  onRemove: (urn: string) => void;
}

// ============ COMPOSANT ============

/** Affiche et gère la liste des utilisateurs locaux associés. */
export function UserIdentities({
  identities,
  credentials,
  readOnly = false,
  onAdd,
  onRemove,
}: UserIdentitiesProps) {
  const { t } = useTranslation("iam/identities");

  // ---------- STATE ----------
  const [users, setUsers] = useState<UserWithMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadUsers();
  }, [identities]);

  // ---------- LOADERS ----------
  const loadUsers = async () => {
    setLoading(true);
    const results = await Promise.all(
      identities.map(async (identity) => {
        try {
          const user = await iamService.getUser(credentials, identity.id);
          return user ? { ...user, urn: identity.urn } : null;
        } catch (err) {
          return {
            login: identity.id,
            email: "",
            status: "OK" as const,
            creation: "",
            urn: identity.urn,
            message: err instanceof Error ? err.message : "Erreur",
          };
        }
      })
    );
    setUsers(results.filter((u): u is UserWithMessage => u !== null));
    setLoading(false);
  };

  const loadAvailableUsers = async (): Promise<SelectOption[]> => {
    const allUsers = await iamService.getUsers(credentials);
    return allUsers.map((user) => ({
      id: user.login,
      urn: `urn:v1:eu:identity:user:${credentials.appKey}/${user.login}`,
      label: user.login,
      description: user.email,
      details: {
        [t("users.columns.group")]: user.group || "-",
        [t("users.columns.status")]: t(`users.status.${user.status}`),
      },
    }));
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      OK: "badge-success",
      DISABLED: "badge-error",
      PASSWORD_CHANGE_REQUIRED: "badge-warning",
    };
    return map[status] || "badge-neutral";
  };

  const currentUrns = identities.map((i) => i.urn);

  // ---------- RENDER ----------
  return (
    <section className="identity-section">
      <h4>{t("users.title")}</h4>

      <div className="section-toolbar">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowModal(true)}
          disabled={readOnly}
        >
          {t("users.addButton")}
        </button>
      </div>

      {loading ? (
        <div className="loading-inline"><div className="spinner-sm"></div></div>
      ) : users.length === 0 ? (
        <p className="empty-text">{t("users.empty")}</p>
      ) : (
        <table className="data-table compact">
          <thead>
            <tr>
              <th>{t("users.columns.login")}</th>
              <th>{t("users.columns.group")}</th>
              <th>{t("users.columns.status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.urn}>
                <td>
                  <div>{user.login}</div>
                  {user.message && <div className="text-error text-sm">{user.message}</div>}
                </td>
                <td>{user.group || "-"}</td>
                <td>
                  <span className={`badge ${getStatusBadge(user.status)}`}>
                    {t(`users.status.${user.status}`)}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onRemove(user.urn)}
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

      {showModal && (
        <SelectModal
          heading={t("users.modalTitle")}
          emptyMessage={t("users.modalEmpty")}
          searchPlaceholder={t("users.searchPlaceholder")}
          currentUrns={currentUrns}
          loadOptions={loadAvailableUsers}
          onAdd={onAdd}
          onClose={() => setShowModal(false)}
          searchFilter={(opt, q) =>
            !q ||
            opt.label.toLowerCase().includes(q.toLowerCase()) ||
            (opt.description?.toLowerCase().includes(q.toLowerCase()) ?? false)
          }
        />
      )}
    </section>
  );
}
