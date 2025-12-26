// ============================================================
// PUBLIC-CLOUD / LOAD-BALANCER / POOLS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getPools, getPoolStatusClass } from "./PoolsTab.service";
import type { Pool } from "../load-balancer.types";
import "./PoolsTab.css";

interface PoolsTabProps {
  projectId: string;
  lbId: string;
}

export default function PoolsTab({ projectId, lbId }: PoolsTabProps) {
  const { t } = useTranslation("public-cloud/load-balancer/pools");
  const { t: tCommon } = useTranslation("common");
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPools();
  }, [projectId, lbId]);

  const loadPools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPools(projectId, lbId);
      setPools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="pools-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="pools-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadPools}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="pools-tab">
      <div className="pools-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("add")}</button>
      </div>

      {pools.length === 0 ? (
        <div className="pools-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="pools-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.protocol")}</th>
              <th>{t("columns.algorithm")}</th>
              <th>{t("columns.members")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool) => (
              <tr key={pool.id}>
                <td>{pool.name}</td>
                <td>{pool.protocol}</td>
                <td>{pool.algorithm}</td>
                <td className="pools-members-count">{pool.membersCount}</td>
                <td>
                  <span className={`pools-status-badge ${getPoolStatusClass(pool.status)}`}>
                    {pool.status}
                  </span>
                </td>
                <td className="pools-actions">
                  <button className="btn btn-sm btn-outline">{t("actions.members")}</button>
                  <button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
