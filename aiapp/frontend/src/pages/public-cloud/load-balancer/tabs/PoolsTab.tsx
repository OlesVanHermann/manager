import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as lbService from "../../../../services/public-cloud.load-balancer";

interface Pool { id: string; name: string; protocol: string; algorithm: string; membersCount: number; status: string; }
interface PoolsTabProps { projectId: string; lbId: string; }

export default function PoolsTab({ projectId, lbId }: PoolsTabProps) {
  const { t } = useTranslation("public-cloud/load-balancer/index");
  const { t: tCommon } = useTranslation("common");
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPools(); }, [projectId, lbId]);

  const loadPools = async () => {
    try { setLoading(true); setError(null); const data = await lbService.getPools(projectId, lbId); setPools(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { ACTIVE: "badge-success", PENDING: "badge-warning", ERROR: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadPools}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="pools-tab">
      <div className="tab-toolbar"><h2>{t("pools.title")}</h2><button className="btn btn-primary">{t("pools.add")}</button></div>
      {pools.length === 0 ? (
        <div className="empty-state"><h2>{t("pools.empty.title")}</h2><p>{t("pools.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("pools.columns.name")}</th><th>{t("pools.columns.protocol")}</th><th>{t("pools.columns.algorithm")}</th><th>{t("pools.columns.members")}</th><th>{t("pools.columns.status")}</th><th>{t("pools.columns.actions")}</th></tr></thead>
          <tbody>
            {pools.map((pool) => (
              <tr key={pool.id}><td>{pool.name}</td><td>{pool.protocol}</td><td>{pool.algorithm}</td><td>{pool.membersCount}</td><td>{getStatusBadge(pool.status)}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("pools.actions.members")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
