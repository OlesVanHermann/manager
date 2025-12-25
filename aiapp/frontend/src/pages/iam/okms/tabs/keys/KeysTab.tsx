// ============================================================
// KEYS TAB - Liste des clés cryptographiques
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as keysService from "./KeysTab";
import type { Key } from "../../okms.types";
import "./KeysTab.css";

// ============================================================
// TYPES
// ============================================================

interface KeysTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Liste des clés cryptographiques avec actions de gestion. */
export default function KeysTab({ serviceId }: KeysTabProps) {
  const { t } = useTranslation("iam/okms/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadKeys();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keysService.getKeys(serviceId);
      setKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDeactivate = async (keyId: string) => {
    if (!confirm(t("keys.confirmDeactivate"))) return;
    try {
      await keysService.deactivateKey(serviceId, keyId);
      loadKeys();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // ---------- HELPERS ----------
  const getTypeBadge = (type: Key["type"]) => {
    return (
      <span className={`keys-type-badge ${type}`}>
        {type === "symmetric" ? "🔑" : "🔐"} {t(`keys.types.${type}`)}
      </span>
    );
  };

  const getStateBadge = (state: Key["state"]) => {
    const classes: Record<string, string> = {
      active: "badge-success",
      deactivated: "badge-warning",
      compromised: "badge-error",
      destroyed: "badge-error",
    };
    return <span className={`status-badge ${classes[state]}`}>{t(`keys.states.${state}`)}</span>;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="keys-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="keys-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadKeys}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <div className="keys-empty-state">
        <h2>{t("keys.empty.title")}</h2>
        <p>{t("keys.empty.description")}</p>
        <button className="btn btn-primary">{t("keys.create")}</button>
      </div>
    );
  }

  return (
    <div className="keys-tab">
      <div className="keys-toolbar">
        <button className="btn btn-primary">{t("keys.create")}</button>
      </div>

      <table className="keys-table">
        <thead>
          <tr>
            <th>{t("keys.columns.name")}</th>
            <th>{t("keys.columns.type")}</th>
            <th>{t("keys.columns.algorithm")}</th>
            <th>{t("keys.columns.state")}</th>
            <th>{t("keys.columns.created")}</th>
            <th>{t("keys.columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td>
                <div className="keys-name">{key.name}</div>
                <div className="keys-id">{key.id}</div>
              </td>
              <td>{getTypeBadge(key.type)}</td>
              <td>{key.algorithm} ({key.size} bits)</td>
              <td>{getStateBadge(key.state)}</td>
              <td>{new Date(key.createdAt).toLocaleDateString("fr-FR")}</td>
              <td className="keys-actions">
                <button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button>
                {key.state === "active" && (
                  <button className="btn btn-sm btn-outline btn-warning" onClick={() => handleDeactivate(key.id)}>{t("keys.deactivate")}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
