// ============================================================
// DELEGATION MODAL - Modal ajout compte OVH délégué
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

// ============ CONSTANTS ============

const ACCOUNT_FORMAT = "xx1111-ovh";
const ACCOUNT_PATTERN = /^[a-z]{2}\d+-(ovh|sys|ks)$/i;
const ACCOUNT_URN_TEMPLATE = "urn:v1:{region}:identity:account:";

// ============ TYPES ============

interface DelegationModalProps {
  region: string;
  onAdd: (urn: string) => void;
  onClose: () => void;
}

// ============ COMPOSANT ============

/** Modal pour ajouter un compte OVH délégué via son NIC handle. */
export function DelegationModal({ region, onAdd, onClose }: DelegationModalProps) {
  const { t } = useTranslation("iam/identities");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [nicHandle, setNicHandle] = useState("");
  const [touched, setTouched] = useState(false);

  // ---------- VALIDATION ----------
  const isValid = ACCOUNT_PATTERN.test(nicHandle);
  const showError = touched && nicHandle && !isValid;

  // ---------- HANDLERS ----------
  const handleSubmit = () => {
    if (!isValid) return;
    const urn = `${ACCOUNT_URN_TEMPLATE.replace("{region}", region.toLowerCase())}${nicHandle.toLowerCase()}`;
    onAdd(urn);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      handleSubmit();
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("accounts.addButton")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="nicHandle">{t("accounts.inputLabel")}</label>
            <input
              id="nicHandle"
              type="text"
              className={`form-input ${showError ? "input-error" : ""}`}
              placeholder={ACCOUNT_FORMAT}
              value={nicHandle}
              onChange={(e) => setNicHandle(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {showError && (
              <div className="input-error-message">
                {t("accounts.formatError", { format: ACCOUNT_FORMAT })}
              </div>
            )}
          </div>
          <p className="form-hint">{t("accounts.disclaimer")}</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {tCommon("actions.cancel")}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {tCommon("actions.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
