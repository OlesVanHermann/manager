import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as volumesService from "./VolumesTab.service";
import type { CloudVolume } from "../project.types";
import "./VolumesTab.css";

interface Props { projectId: string; }

export function VolumesTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/index");
  const [volumes, setVolumes] = useState<CloudVolume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await volumesService.listVolumes(projectId); setVolumes(data); }
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { available: 'success', 'in-use': 'info', creating: 'warning', error: 'error' };
    return <span className={`badge ${map[status] || 'inactive'}`}>{status}</span>;
  };

  const getTypeBadge = (type: string) => {
    const map: Record<string, string> = { classic: 'inactive', 'high-speed': 'info', 'high-speed-gen2': 'success' };
    return <span className={`badge ${map[type] || 'inactive'}`}>{type}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="volumes-tab">
      <div className="tab-header"><h3>{t("volumes.title")}</h3><span className="records-count">{volumes.length}</span></div>
      {volumes.length === 0 ? (<div className="empty-state"><p>{t("volumes.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("volumes.name")}</th><th>{t("volumes.size")}</th><th>{t("volumes.type")}</th><th>{t("volumes.region")}</th><th>{t("volumes.attached")}</th><th>{t("volumes.status")}</th></tr></thead>
          <tbody>
            {volumes.map(vol => (
              <tr key={vol.id}>
                <td className="font-mono">{vol.name || vol.id.slice(0, 8)}</td>
                <td>{vol.size} GB</td>
                <td>{getTypeBadge(vol.type)}</td>
                <td>{vol.region}</td>
                <td>{vol.attachedTo?.length > 0 ? vol.attachedTo.length + ' instance(s)' : '-'}</td>
                <td>{getStatusBadge(vol.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default VolumesTab;
