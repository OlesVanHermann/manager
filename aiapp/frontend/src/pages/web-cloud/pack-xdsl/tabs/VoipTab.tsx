import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as packXdslService from "../../../../services/web-cloud.pack-xdsl";

interface VoipLine { serviceName: string; number: string; description?: string; status: string; }
interface VoipTabProps { serviceId: string; }

export default function VoipTab({ serviceId }: VoipTabProps) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const { t: tCommon } = useTranslation("common");
  const [lines, setLines] = useState<VoipLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadLines(); }, [serviceId]);

  const loadLines = async () => {
    try { setLoading(true); setError(null); const data = await packXdslService.getVoipLines(serviceId); setLines(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "badge-success", inactive: "badge-error", pending: "badge-warning" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`voip.status.${status}`)}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadLines}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="voip-tab">
      <div className="tab-toolbar"><h2>{t("voip.title")}</h2></div>
      {lines.length === 0 ? (
        <div className="empty-state"><h2>{t("voip.empty.title")}</h2><p>{t("voip.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("voip.columns.number")}</th><th>{t("voip.columns.description")}</th><th>{t("voip.columns.status")}</th><th>{t("voip.columns.actions")}</th></tr></thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.serviceName}>
                <td><strong style={{ fontSize: "var(--font-size-lg)" }}>{line.number}</strong></td>
                <td>{line.description || "-"}</td>
                <td>{getStatusBadge(line.status)}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline">{t("voip.actions.configure")}</button><button className="btn btn-sm btn-outline">{t("voip.actions.calls")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
