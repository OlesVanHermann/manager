// ============================================================
// ACCOUNT IDENTITIES - Section autres comptes OVH (délégation)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DelegationModal } from "../DelegationModal";

// ============ TYPES ============

interface DecodedIdentity {
  type: string;
  id: string;
  urn: string;
}

interface AccountIdentitiesProps {
  identities: DecodedIdentity[];
  region: string;
  readOnly?: boolean;
  onAdd: (urns: string[]) => void;
  onRemove: (urn: string) => void;
}

// ============ COMPOSANT ============

/** Affiche et gère la liste des comptes OVH délégués. */
export function AccountIdentities({
  identities,
  region,
  readOnly = false,
  onAdd,
  onRemove,
}: AccountIdentitiesProps) {
  const { t } = useTranslation("iam/identities");

  // ---------- STATE ----------
  const [showModal, setShowModal] = useState(false);

  // ---------- HANDLERS ----------
  const handleAdd = (urn: string) => {
    onAdd([urn]);
  };

  // ---------- RENDER ----------
  return (
    <section className="identity-section">
      <h4>{t("accounts.title")}</h4>

      <div className="section-toolbar">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowModal(true)}
          disabled={readOnly}
        >
          {t("accounts.addButton")}
        </button>
      </div>

      <p className="form-hint">{t("accounts.disclaimer")}</p>

      {identities.length === 0 ? (
        <p className="empty-text">{t("accounts.empty")}</p>
      ) : (
        <table className="data-table compact">
          <thead>
            <tr>
              <th>{t("accounts.columns.nicHandle")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {identities.map((identity) => (
              <tr key={identity.urn}>
                <td className="text-mono">{identity.id}</td>
                <td className="actions-cell">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onRemove(identity.urn)}
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
        <DelegationModal
          region={region}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
