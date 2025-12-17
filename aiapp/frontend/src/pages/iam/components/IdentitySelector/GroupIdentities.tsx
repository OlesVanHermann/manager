// ============================================================
// GROUP IDENTITIES - Section groupes d'utilisateurs
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

interface GroupWithMessage extends iamService.IamGroup {
  urn: string;
  message?: string;
}

interface GroupIdentitiesProps {
  identities: DecodedIdentity[];
  credentials: OvhCredentials;
  readOnly?: boolean;
  onAdd: (urns: string[]) => void;
  onRemove: (urn: string) => void;
}

// ============ COMPOSANT ============

/** Affiche et gère la liste des groupes d'utilisateurs associés. */
export function GroupIdentities({
  identities,
  credentials,
  readOnly = false,
  onAdd,
  onRemove,
}: GroupIdentitiesProps) {
  const { t } = useTranslation("iam/identities");

  // ---------- STATE ----------
  const [groups, setGroups] = useState<GroupWithMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadGroups();
  }, [identities]);

  // ---------- LOADERS ----------
  const loadGroups = async () => {
    setLoading(true);
    const results = await Promise.all(
      identities.map(async (identity) => {
        try {
          const group = await iamService.getGroup(credentials, identity.id);
          return group ? { ...group, urn: identity.urn } : null;
        } catch (err) {
          return {
            name: identity.id,
            description: "",
            role: "",
            urn: identity.urn,
            message: err instanceof Error ? err.message : "Erreur",
          };
        }
      })
    );
    setGroups(results.filter((g): g is GroupWithMessage => g !== null));
    setLoading(false);
  };

  const loadAvailableGroups = async (): Promise<SelectOption[]> => {
    const allGroups = await iamService.getGroups(credentials);
    return allGroups.map((group) => ({
      id: group.name,
      urn: `urn:v1:eu:identity:group:${credentials.appKey}/${group.name}`,
      label: group.name,
      description: group.description,
      details: group.role ? { [t("groups.columns.role")]: group.role } : undefined,
    }));
  };

  const currentUrns = identities.map((i) => i.urn);

  // ---------- RENDER ----------
  return (
    <section className="identity-section">
      <h4>{t("groups.title")}</h4>

      <div className="section-toolbar">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowModal(true)}
          disabled={readOnly}
        >
          {t("groups.addButton")}
        </button>
      </div>

      {loading ? (
        <div className="loading-inline"><div className="spinner-sm"></div></div>
      ) : groups.length === 0 ? (
        <p className="empty-text">{t("groups.empty")}</p>
      ) : (
        <table className="data-table compact">
          <thead>
            <tr>
              <th>{t("groups.columns.name")}</th>
              <th>{t("groups.columns.description")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.urn}>
                <td>
                  <div>{group.name}</div>
                  {group.message && <div className="text-error text-sm">{group.message}</div>}
                </td>
                <td>{group.description || "-"}</td>
                <td className="actions-cell">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onRemove(group.urn)}
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
          heading={t("groups.modalTitle")}
          emptyMessage={t("groups.modalEmpty")}
          searchPlaceholder={t("groups.searchPlaceholder")}
          currentUrns={currentUrns}
          loadOptions={loadAvailableGroups}
          onAdd={onAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
