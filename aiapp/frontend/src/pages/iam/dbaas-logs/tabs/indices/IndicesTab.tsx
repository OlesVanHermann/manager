// ============================================================
// INDICES TAB - Gestion des indices Elasticsearch
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as indicesService from "./IndicesTab.service";
import type { Index } from "../dbaas-logs.types";
import "./IndicesTab.css";

interface IndicesTabProps { serviceId: string; }

export default function IndicesTab({ serviceId }: IndicesTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/indices");
  const { t: tCommon } = useTranslation("common");

  const [indices, setIndices] = useState<Index[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadIndices(); }, [serviceId]);

  const loadIndices = async () => {
    try { setLoading(true); setError(null); const data = await indicesService.getIndices(serviceId); setIndices(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="indices-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="indices-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadIndices}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="indices-tab">
      <div className="indices-toolbar"><h2>{t("title")}</h2><button className="btn btn-primary">{t("create")}</button></div>
      {indices.length === 0 ? (
        <div className="indices-empty-state"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>
      ) : (
        <table className="indices-table">
          <thead><tr><th>{t("columns.name")}</th><th>{t("columns.shards")}</th><th>{t("columns.usage")}</th><th>{t("columns.created")}</th><th>{t("columns.actions")}</th></tr></thead>
          <tbody>
            {indices.map((idx) => {
              const pct = indicesService.getUsagePercent(idx.currentSize, idx.maxSize);
              return (
                <tr key={idx.indexId}>
                  <td><div className="indices-name">{idx.name}</div>{idx.description && <div className="indices-desc">{idx.description}</div>}</td>
                  <td>{idx.nbShard}</td>
                  <td style={{ minWidth: "180px" }}>
                    <div className="indices-usage-bar"><div className={`indices-usage-fill ${indicesService.getUsageClass(pct)}`} style={{ width: `${pct}%` }}></div></div>
                    <div className="indices-usage-text">{indicesService.formatSize(idx.currentSize)} / {indicesService.formatSize(idx.maxSize)} ({pct}%)</div>
                  </td>
                  <td>{new Date(idx.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="indices-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
