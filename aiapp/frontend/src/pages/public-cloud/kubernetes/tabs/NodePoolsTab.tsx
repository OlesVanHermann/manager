// ============================================================
// PUBLIC-CLOUD / KUBERNETES / NODEPOOLS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getNodePools, getNodePoolStatusClass } from "./NodePoolsTab.service";
import type { NodePool } from "../kubernetes.types";
import "./NodePoolsTab.css";

interface NodePoolsTabProps {
  projectId: string;
  clusterId: string;
}

export default function NodePoolsTab({ projectId, clusterId }: NodePoolsTabProps) {
  const { t } = useTranslation("public-cloud/kubernetes/nodepools");
  const { t: tCommon } = useTranslation("common");
  const [pools, setPools] = useState<NodePool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPools();
  }, [projectId, clusterId]);

  const loadPools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNodePools(projectId, clusterId);
      setPools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="nodepools-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="nodepools-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadPools}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="nodepools-tab">
      <div className="nodepools-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("add")}</button>
      </div>

      {pools.length === 0 ? (
        <div className="nodepools-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="nodepools-list">
          {pools.map((pool) => (
            <div key={pool.id} className="nodepools-card">
              <div className="nodepools-header">
                <div>
                  <div className="nodepools-name">{pool.name}</div>
                  <span className="nodepools-flavor">{pool.flavor}</span>
                </div>
                <span className={`nodepools-status-badge ${getNodePoolStatusClass(pool.status)}`}>
                  {pool.status}
                </span>
              </div>

              <div className="nodepools-info-grid">
                <div className="nodepools-info-item">
                  <div className="nodepools-info-title">{t("fields.nodes")}</div>
                  <div className="nodepools-info-value">
                    {pool.currentNodes} / {pool.desiredNodes}
                  </div>
                </div>
                <div className="nodepools-info-item">
                  <div className="nodepools-info-title">{t("fields.autoscale")}</div>
                  <div className="nodepools-info-value">
                    {pool.autoscale ? `${pool.minNodes} - ${pool.maxNodes}` : t("disabled")}
                  </div>
                </div>
              </div>

              <div className="nodepools-actions">
                <button className="btn btn-sm btn-outline">{t("actions.scale")}</button>
                <button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
