import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as nashaService from "../../../../services/bare-metal.nasha";

interface Partition {
  partitionName: string;
  partitionDescription?: string;
  protocol: string;
  size: number;
  usedBySnapshots: number;
}

interface PartitionsTabProps {
  serviceId: string;
}

export default function PartitionsTab({ serviceId }: PartitionsTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");

  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPartitions(); }, [serviceId]);

  const loadPartitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nashaService.getPartitions(serviceId);
      setPartitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (gb: number) => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;

  const handleDelete = async (partitionName: string) => {
    if (!confirm(t("partitions.confirmDelete"))) return;
    try {
      await nashaService.deletePartition(serviceId, partitionName);
      loadPartitions();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadPartitions}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="partitions-tab">
      <div className="tab-toolbar">
        <h2>{t("partitions.title")}</h2>
        <button className="btn btn-primary">{t("partitions.create")}</button>
      </div>

      {partitions.length === 0 ? (
        <div className="empty-state">
          <h2>{t("partitions.empty.title")}</h2>
          <p>{t("partitions.empty.description")}</p>
        </div>
      ) : (
        <div className="partitions-list">
          {partitions.map((partition) => (
            <div key={partition.partitionName} className="partition-card">
              <div className="partition-header">
                <div>
                  <div className="partition-name">{partition.partitionName}</div>
                  {partition.partitionDescription && <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{partition.partitionDescription}</div>}
                </div>
                <span className="partition-protocol">{partition.protocol}</span>
              </div>
              <div className="info-grid" style={{ marginBottom: 0 }}>
                <div className="info-card">
                  <div className="card-title">{t("partitions.fields.size")}</div>
                  <div className="card-value">{formatSize(partition.size)}</div>
                </div>
                <div className="info-card">
                  <div className="card-title">{t("partitions.fields.snapshots")}</div>
                  <div className="card-value">{formatSize(partition.usedBySnapshots)}</div>
                </div>
                <div className="info-card">
                  <div className="card-title">{t("partitions.fields.path")}</div>
                  <div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>/export/{partition.partitionName}</div>
                </div>
              </div>
              <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
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
