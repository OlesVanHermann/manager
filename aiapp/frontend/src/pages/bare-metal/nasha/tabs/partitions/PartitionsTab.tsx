// ############################################################
// #  NASHA/PARTITIONS - COMPOSANT STRICTEMENT ISOLÉ          #
// #  CSS LOCAL : ./PartitionsTab.css                         #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { partitionsService } from "./PartitionsTab";
import type { NashaPartition } from "../../nasha.types";
import "./PartitionsTab.css";

interface PartitionsTabProps { serviceId: string; }

const formatSize = (gb: number): string => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;

export default function PartitionsTab({ serviceId }: PartitionsTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");
  const [partitions, setPartitions] = useState<NashaPartition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPartitions(); }, [serviceId]);

  const loadPartitions = async () => {
    try {
      setLoading(true); setError(null);
      const data = await partitionsService.getPartitions(serviceId);
      setPartitions(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (partitionName: string) => {
    if (!confirm(t("partitions.confirmDelete"))) return;
    try { await partitionsService.deletePartition(serviceId, partitionName); loadPartitions(); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
  };

  if (loading) return <div className="nasha-partitions-loading">{tCommon("loading")}</div>;
  if (error) return <div className="nasha-partitions-error"><p>{error}</p><button className="btn btn-primary" onClick={loadPartitions}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="nasha-partitions-tab">
      <div className="nasha-partitions-toolbar">
        <h2>{t("partitions.title")}</h2>
        <button className="btn btn-primary">{t("partitions.create")}</button>
      </div>

      {partitions.length === 0 ? (
        <div className="nasha-partitions-empty"><h2>{t("partitions.empty.title")}</h2><p>{t("partitions.empty.description")}</p></div>
      ) : (
        <div className="nasha-partitions-list">
          {partitions.map((partition) => (
            <div key={partition.partitionName} className="nasha-partitions-card">
              <div className="nasha-partitions-header">
                <div>
                  <div className="nasha-partitions-name">{partition.partitionName}</div>
                  {partition.partitionDescription && <div className="nasha-partitions-description">{partition.partitionDescription}</div>}
                </div>
                <span className="nasha-partitions-protocol">{partition.protocol}</span>
              </div>
              <div className="nasha-partitions-info-grid">
                <div className="nasha-partitions-info-card"><div className="nasha-partitions-card-title">{t("partitions.fields.size")}</div><div className="nasha-partitions-card-value">{formatSize(partition.size)}</div></div>
                <div className="nasha-partitions-info-card"><div className="nasha-partitions-card-title">{t("partitions.fields.snapshots")}</div><div className="nasha-partitions-card-value">{formatSize(partition.usedBySnapshots)}</div></div>
                <div className="nasha-partitions-info-card"><div className="nasha-partitions-card-title">{t("partitions.fields.path")}</div><div className="nasha-partitions-card-value mono">/export/{partition.partitionName}</div></div>
              </div>
              <div className="nasha-partitions-actions">
                <button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button>
                <button className="btn btn-sm btn-outline">{t("partitions.resize")}</button>
                <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(partition.partitionName)}>{tCommon("actions.delete")}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
