// ============================================================
// ALIASES TAB - Gestion des aliases Elasticsearch
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as aliasesService from "./AliasesTab.service";
import type { Alias } from "../dbaas-logs.types";
import "./AliasesTab.css";

interface AliasesTabProps { serviceId: string; }

export default function AliasesTab({ serviceId }: AliasesTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/aliases");
  const { t: tCommon } = useTranslation("common");

  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadAliases(); }, [serviceId]);

  const loadAliases = async () => {
    try { setLoading(true); setError(null); const data = await aliasesService.getAliases(serviceId); setAliases(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (aliasId: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try { await aliasesService.deleteAlias(serviceId, aliasId); loadAliases(); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
  };

  if (loading) return <div className="dbaas-logs-aliases-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="dbaas-logs-aliases-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadAliases}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="dbaas-logs-aliases-tab">
      <div className="dbaas-logs-aliases-toolbar"><h2>{t("title")}</h2><button className="btn btn-primary">{t("create")}</button></div>
      {aliases.length === 0 ? (
        <div className="dbaas-logs-aliases-empty-state"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>
      ) : (
        <table className="dbaas-logs-aliases-table">
          <thead><tr><th>{t("columns.name")}</th><th>{t("columns.description")}</th><th>{t("columns.indices")}</th><th>{t("columns.streams")}</th><th>{t("columns.actions")}</th></tr></thead>
          <tbody>
            {aliases.map((a) => (
              <tr key={a.aliasId}>
                <td><div className="dbaas-logs-aliases-name">{a.name}</div></td>
                <td>{a.description || "-"}</td><td>{a.indexIds.length}</td><td>{a.streamIds.length}</td>
                <td className="dbaas-logs-aliases-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button><button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(a.aliasId)}>{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
