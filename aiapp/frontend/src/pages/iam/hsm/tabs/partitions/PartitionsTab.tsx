// ============================================================
// PARTITIONS TAB - Gestion des partitions HSM
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as partitionsService from "./PartitionsTab.service";
import type { Partition } from "../hsm.types";
import "./PartitionsTab.css";

// ============================================================
// TYPES
// ============================================================

interface PartitionsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des partitions du HSM. */
export default function PartitionsTab({ serviceId }: PartitionsTabProps) {
  const { t } = useTranslation("iam/hsm/partitions");
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
      const data = await partitionsService.getPartitions(serviceId);
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
    return <span className={`partitions-status-badge ${classes[state]}`}>{t(`partitions.states.${state}`)}</span>;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="partitions-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="partitions-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadPartitions}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (partitions.length === 0) {
    return (
      <div className="partitions-empty-state">
        <h2>{t("empty.title")}</h2>
        <p>{t("empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="partitions-tab">
      <div className="partitions-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadPartitions}>{tCommon("actions.refresh")}</button>
      </div>

      <table className="partitions-table">
        <thead>
          <tr>
            <th>{t("columns.name")}</th>
            <th>{t("columns.serial")}</th>
            <th>{t("columns.state")}</th>
            <th>{t("columns.usage")}</th>
            <th>{t("columns.objects")}</th>
            <th>{t("columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {partitions.map((partition) => {
            const usagePercent = partitionsService.getUsagePercent(partition.usedStorage, partition.totalStorage);
            return (
              <tr key={partition.id}>
                <td>
                  <div className="partitions-name">{partition.name}</div>
                </td>
                <td className="partitions-serial">{partition.serialNumber}</td>
                <td>{getStateBadge(partition.state)}</td>
                <td style={{ minWidth: "150px" }}>
                  <div className="partitions-usage-bar">
                    <div className={`partitions-usage-fill ${partitionsService.getUsageClass(usagePercent)}`} style={{ width: `${usagePercent}%` }}></div>
                  </div>
                  <div className="partitions-usage-text">
                    {partitionsService.formatBytes(partition.usedStorage)} / {partitionsService.formatBytes(partition.totalStorage)} ({usagePercent}%)
                  </div>
                </td>
                <td>{partition.objectCount}</td>
                <td className="partitions-actions">
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
