import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { accessesService } from "./AccessesTab";
import type { NashaAccess } from "../../nasha.types";
import "./AccessesTab.css";

interface AccessesTabProps { serviceId: string; }

export default function AccessesTab({ serviceId }: AccessesTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");
  const [accesses, setAccesses] = useState<NashaAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadAccesses(); }, [serviceId]);

  const loadAccesses = async () => {
    try { setLoading(true); setError(null); const data = await accessesService.getAccesses(serviceId); setAccesses(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getTypeBadge = (type: string) => {
    const classes: Record<string, string> = { readwrite: "badge-success", readonly: "badge-info" };
    return <span className={`status-badge ${classes[type] || ""}`}>{type === "readwrite" ? "Lecture/Écriture" : "Lecture seule"}</span>;
  };

  const handleDelete = async (partitionName: string, ip: string) => {
    if (!confirm(t("accesses.confirmDelete"))) return;
    try { await accessesService.deleteAccess(serviceId, partitionName, ip); loadAccesses(); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadAccesses}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="accesses-tab">
      <div className="tab-toolbar"><h2>{t("accesses.title")}</h2><button className="btn btn-primary">{t("accesses.add")}</button></div>
      {accesses.length === 0 ? (
        <div className="empty-state"><h2>{t("accesses.empty.title")}</h2><p>{t("accesses.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("accesses.columns.ip")}</th><th>{t("accesses.columns.partition")}</th><th>{t("accesses.columns.type")}</th><th>{t("accesses.columns.description")}</th><th>{t("accesses.columns.actions")}</th></tr></thead>
          <tbody>
            {accesses.map((access, idx) => (
              <tr key={idx}><td className="mono">{access.ip}</td><td>{access.partitionName}</td><td>{getTypeBadge(access.type)}</td><td>{access.aclDescription || "-"}</td><td className="item-actions"><button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(access.partitionName, access.ip)}>{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
