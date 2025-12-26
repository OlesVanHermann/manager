import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as volumesService from "./VolumesTab.service";
import type { CloudVolume } from "../project.types";
import "./VolumesTab.css";

interface Props { projectId: string; }

export function VolumesTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/volumes");
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
    const map: Record<string, string> = { available: 'volumes-badge-success', 'in-use': 'volumes-badge-info', creating: 'volumes-badge-warning', error: 'volumes-badge-error' };
    return <span className={`volumes-badge ${map[status] || 'volumes-badge-inactive'}`}>{status}</span>;
  };

  const getTypeBadge = (type: string) => {
    const map: Record<string, string> = { classic: 'volumes-badge-inactive', 'high-speed': 'volumes-badge-info', 'high-speed-gen2': 'volumes-badge-success' };
    return <span className={`volumes-badge ${map[type] || 'volumes-badge-inactive'}`}>{type}</span>;
  };

  if (loading) return <div className="volumes-loading"><div className="volumes-skeleton-block" /></div>;

  return (
    <div className="volumes-tab">
      <div className="volumes-header"><h3>{t("title")}</h3><span className="volumes-count">{volumes.length}</span></div>
      {volumes.length === 0 ? (<div className="volumes-empty-state"><p>{t("empty")}</p></div>) : (
        <table className="volumes-data-table">
          <thead><tr><th>{t("name")}</th><th>{t("size")}</th><th>{t("type")}</th><th>{t("region")}</th><th>{t("attached")}</th><th>{t("status")}</th></tr></thead>
          <tbody>
            {volumes.map(vol => (
              <tr key={vol.id}>
                <td className="volumes-mono">{vol.name || vol.id.slice(0, 8)}</td>
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
