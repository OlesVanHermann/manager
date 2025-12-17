// ============================================================
// PARTITIONS TAB - Gestion des partitions HSM
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as hsmService from "../../../../services/iam.hsm";

// ============================================================
// TYPES
// ============================================================

interface Partition {
  id: string;
  name: string;
  serialNumber: string;
  state: "active" | "inactive" | "error";
  usedStorage: number;
  totalStorage: number;
  objectCount: number;
  createdAt: string;
}

interface PartitionsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des partitions du HSM. */
export default function PartitionsTab({ serviceId }: PartitionsTabProps) {
  const { t } = useTranslation("iam/hsm/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadPartitions();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadPartitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hsmService.getPartitions(serviceId);
      setPartitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStateBadge = (state: Partition["state"]) => {
    const classes: Record<string, string> = {
      active: "badge-success",
      inactive: "badge-warning",
      error: "badge-error",
    };
    return <span className={`status-badge ${classes[state]}`}>{t(`partitions.states.${state}`)}</span>;
  };

  const getUsagePercent = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getUsageClass = (percent: number) => {
    if (percent >= 90) return "danger";
    if (percent >= 70) return "warning";
    return "";
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadPartitions}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (partitions.length === 0) {
    return (
      <div className="empty-state">
        <h2>{t("partitions.empty.title")}</h2>
        <p>{t("partitions.empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="partitions-tab">
      <div className="tab-toolbar">
        <h2>{t("partitions.title")}</h2>
        <button className="btn btn-outline" onClick={loadPartitions}>{tCommon("actions.refresh")}</button>
      </div>

      <table className="partitions-table">
        <thead>
          <tr>
            <th>{t("partitions.columns.name")}</th>
            <th>{t("partitions.columns.serial")}</th>
            <th>{t("partitions.columns.state")}</th>
            <th>{t("partitions.columns.usage")}</th>
            <th>{t("partitions.columns.objects")}</th>
            <th>{t("partitions.columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {partitions.map((partition) => {
            const usagePercent = getUsagePercent(partition.usedStorage, partition.totalStorage);
            return (
              <tr key={partition.id}>
                <td>
                  <div className="partition-name">{partition.name}</div>
                </td>
                <td className="mono">{partition.serialNumber}</td>
                <td>{getStateBadge(partition.state)}</td>
                <td style={{ minWidth: "150px" }}>
                  <div className="usage-bar">
                    <div className={`usage-fill ${getUsageClass(usagePercent)}`} style={{ width: `${usagePercent}%` }}></div>
                  </div>
                  <div className="usage-text">
                    {formatBytes(partition.usedStorage)} / {formatBytes(partition.totalStorage)} ({usagePercent}%)
                  </div>
                </td>
                <td>{partition.objectCount}</td>
                <td className="partition-actions">
                  <button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
