// ############################################################
// #  NASHA/ACCESSES - COMPOSANT STRICTEMENT ISOLÉ            #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./AccessesTab.css                           #
// #  SERVICE LOCAL : ./AccessesTab.ts                        #
// #  I18N LOCAL : bare-metal/nasha/accesses                  #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { accessesService } from "./AccessesTab.service";
import type { NashaAccess } from "../../nasha.types";
import "./AccessesTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface AccessesTabProps {
  serviceId: string;
}

// ============================================================
// Composant Principal
// ============================================================
export default function AccessesTab({ serviceId }: AccessesTabProps) {
  const { t } = useTranslation("bare-metal/nasha/accesses");
  const { t: tCommon } = useTranslation("common");
  const [accesses, setAccesses] = useState<NashaAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des accès
  const loadAccesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accessesService.getAccesses(serviceId);
      setAccesses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccesses();
  }, [serviceId]);

  // Suppression d'un accès
  const handleDelete = async (partitionName: string, ip: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await accessesService.deleteAccess(serviceId, partitionName, ip);
      loadAccesses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // État de chargement
  if (loading) {
    return <div className="nasha-accesses-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="nasha-accesses-error">
        <p>{error}</p>
        <button className="nasha-accesses-btn nasha-accesses-btn-primary" onClick={loadAccesses}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="nasha-accesses-tab">
      {/* Barre d'outils */}
      <div className="nasha-accesses-toolbar">
        <h2>{t("title")}</h2>
        <button className="nasha-accesses-btn nasha-accesses-btn-primary">{t("add")}</button>
      </div>

      {/* Liste vide */}
      {accesses.length === 0 ? (
        <div className="nasha-accesses-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="nasha-accesses-table">
          <thead>
            <tr>
              <th>{t("columns.ip")}</th>
              <th>{t("columns.partition")}</th>
              <th>{t("columns.type")}</th>
              <th>{t("columns.description")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {accesses.map((access, idx) => (
              <tr key={idx}>
                <td className="nasha-accesses-mono">{access.ip}</td>
                <td>{access.partitionName}</td>
                <td>
                  <span
                    className={`nasha-accesses-type-badge ${access.type === "readwrite" ? "nasha-accesses-readwrite" : "nasha-accesses-readonly"}`}
                  >
                    {t(`types.${access.type}`)}
                  </span>
                </td>
                <td>{access.aclDescription || "-"}</td>
                <td className="nasha-accesses-actions">
                  <button
                    className="nasha-accesses-btn nasha-accesses-btn-sm nasha-accesses-btn-outline nasha-accesses-btn-danger"
                    onClick={() => handleDelete(access.partitionName, access.ip)}
                  >
                    {tCommon("actions.delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
