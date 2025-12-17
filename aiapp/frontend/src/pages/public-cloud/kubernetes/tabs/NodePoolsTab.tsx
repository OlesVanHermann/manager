import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as k8sService from "../../../../services/public-cloud.kubernetes";

interface NodePool { id: string; name: string; flavor: string; desiredNodes: number; currentNodes: number; minNodes: number; maxNodes: number; autoscale: boolean; status: string; }
interface NodePoolsTabProps { projectId: string; clusterId: string; }

export default function NodePoolsTab({ projectId, clusterId }: NodePoolsTabProps) {
  const { t } = useTranslation("public-cloud/kubernetes/index");
  const { t: tCommon } = useTranslation("common");
  const [pools, setPools] = useState<NodePool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPools(); }, [projectId, clusterId]);

  const loadPools = async () => {
    try { setLoading(true); setError(null); const data = await k8sService.getNodePools(projectId, clusterId); setPools(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { READY: "badge-success", INSTALLING: "badge-warning", ERROR: "badge-error", DELETING: "badge-secondary" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadPools}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="nodepools-tab">
      <div className="tab-toolbar"><h2>{t("nodepools.title")}</h2><button className="btn btn-primary">{t("nodepools.add")}</button></div>
      {pools.length === 0 ? (
        <div className="empty-state"><h2>{t("nodepools.empty.title")}</h2><p>{t("nodepools.empty.description")}</p></div>
      ) : (
        <div className="nodepools-list">
          {pools.map((pool) => (
            <div key={pool.id} className="nodepool-card">
              <div className="nodepool-header">
                <div><div className="nodepool-name">{pool.name}</div><span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{pool.flavor}</span></div>
                {getStatusBadge(pool.status)}
              </div>
              <div className="info-grid" style={{ marginBottom: 0 }}>
                <div className="info-card"><div className="card-title">{t("nodepools.fields.nodes")}</div><div className="card-value">{pool.currentNodes} / {pool.desiredNodes}</div></div>
                <div className="info-card"><div className="card-title">{t("nodepools.fields.autoscale")}</div><div className="card-value">{pool.autoscale ? `${pool.minNodes} - ${pool.maxNodes}` : t("nodepools.disabled")}</div></div>
              </div>
              <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
                <button className="btn btn-sm btn-outline">{t("nodepools.actions.scale")}</button>
                <button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
