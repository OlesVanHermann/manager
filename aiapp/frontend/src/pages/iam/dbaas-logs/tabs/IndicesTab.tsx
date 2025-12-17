// ============================================================
// INDICES TAB - Gestion des indices Elasticsearch
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.dbaas-logs";

// ============================================================
// TYPES
// ============================================================

interface Index {
  indexId: string;
  name: string;
  description?: string;
  nbShard: number;
  isEditable: boolean;
  createdAt: string;
  currentSize: number;
  maxSize: number;
}

interface IndicesTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des indices Elasticsearch. */
export default function IndicesTab({ serviceId }: IndicesTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [indices, setIndices] = useState<Index[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadIndices();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadIndices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsService.getIndices(serviceId);
      setIndices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getUsagePercent = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getUsageClass = (percent: number) => {
    if (percent >= 90) return "danger";
    if (percent >= 70) return "warning";
    return "";
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadIndices}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="indices-tab">
      <div className="tab-toolbar">
        <h2>{t("indices.title")}</h2>
        <button className="btn btn-primary">{t("indices.create")}</button>
      </div>

      {indices.length === 0 ? (
        <div className="empty-state">
          <h2>{t("indices.empty.title")}</h2>
          <p>{t("indices.empty.description")}</p>
        </div>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>{t("indices.columns.name")}</th>
              <th>{t("indices.columns.shards")}</th>
              <th>{t("indices.columns.usage")}</th>
              <th>{t("indices.columns.created")}</th>
              <th>{t("indices.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {indices.map((index) => {
              const usagePercent = getUsagePercent(index.currentSize, index.maxSize);
              return (
                <tr key={index.indexId}>
                  <td>
                    <div className="index-name">{index.name}</div>
                    {index.description && <div className="index-desc" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{index.description}</div>}
                  </td>
                  <td>{index.nbShard}</td>
                  <td style={{ minWidth: "180px" }}>
                    <div className="usage-bar">
                      <div className={`usage-fill ${getUsageClass(usagePercent)}`} style={{ width: `${usagePercent}%` }}></div>
                    </div>
                    <div className="usage-text">{formatSize(index.currentSize)} / {formatSize(index.maxSize)} ({usagePercent}%)</div>
                  </td>
                  <td>{new Date(index.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="item-actions">
                    <button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
