// ############################################################
// #  NASHA/PARTITIONS - COMPOSANT STRICTEMENT ISOLÉ          #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./PartitionsTab.css                         #
// #  SERVICE LOCAL : ./PartitionsTab.ts                      #
// #  I18N LOCAL : bare-metal/nasha/partitions                #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { partitionsService } from "./PartitionsTab.service";
import type { NashaPartition } from "../../nasha.types";
import "./PartitionsTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface PartitionsTabProps {
  serviceId: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatSize = (gb: number): string => {
  return gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
};

// ============================================================
// Composant Principal
// ============================================================
export default function PartitionsTab({ serviceId }: PartitionsTabProps) {
  const { t } = useTranslation("bare-metal/nasha/partitions");
  const { t: tCommon } = useTranslation("common");
  const [partitions, setPartitions] = useState<NashaPartition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des partitions
  const loadPartitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await partitionsService.getPartitions(serviceId);
      setPartitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartitions();
  }, [serviceId]);

  // Suppression d'une partition
  const handleDelete = async (partitionName: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await partitionsService.deletePartition(serviceId, partitionName);
      loadPartitions();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // État de chargement
  if (loading) {
    return <div className="nasha-partitions-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="nasha-partitions-error">
        <p>{error}</p>
        <button className="nasha-partitions-btn nasha-partitions-btn-primary" onClick={loadPartitions}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="nasha-partitions-tab">
      {/* Barre d'outils */}
      <div className="nasha-partitions-toolbar">
        <h2>{t("title")}</h2>
        <button className="nasha-partitions-btn nasha-partitions-btn-primary">{t("create")}</button>
      </div>

      {/* Liste vide */}
      {partitions.length === 0 ? (
        <div className="nasha-partitions-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="nasha-partitions-list">
          {partitions.map((partition) => (
            <div key={partition.partitionName} className="nasha-partitions-card">
              <div className="nasha-partitions-header">
                <div>
                  <div className="nasha-partitions-name">{partition.partitionName}</div>
                  {partition.partitionDescription && (
                    <div className="nasha-partitions-description">
                      {partition.partitionDescription}
                    </div>
                  )}
                </div>
                <span className="nasha-partitions-protocol">{partition.protocol}</span>
              </div>
              <div className="nasha-partitions-info-grid">
                <div className="nasha-partitions-info-card">
                  <div className="nasha-partitions-card-title">{t("fields.size")}</div>
                  <div className="nasha-partitions-card-value">{formatSize(partition.size)}</div>
                </div>
                <div className="nasha-partitions-info-card">
                  <div className="nasha-partitions-card-title">{t("fields.snapshots")}</div>
                  <div className="nasha-partitions-card-value">
                    {formatSize(partition.usedBySnapshots)}
                  </div>
                </div>
                <div className="nasha-partitions-info-card">
                  <div className="nasha-partitions-card-title">{t("fields.path")}</div>
                  <div className="nasha-partitions-card-value nasha-partitions-mono">
                    /export/{partition.partitionName}
                  </div>
                </div>
              </div>
              <div className="nasha-partitions-actions">
                <button className="nasha-partitions-btn nasha-partitions-btn-sm nasha-partitions-btn-outline">{tCommon("actions.edit")}</button>
                <button className="nasha-partitions-btn nasha-partitions-btn-sm nasha-partitions-btn-outline">{t("resize")}</button>
                <button
                  className="nasha-partitions-btn nasha-partitions-btn-sm nasha-partitions-btn-outline nasha-partitions-btn-danger"
                  onClick={() => handleDelete(partition.partitionName)}
                >
                  {tCommon("actions.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
