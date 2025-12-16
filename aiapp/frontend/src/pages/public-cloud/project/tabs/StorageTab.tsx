import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cloudService, CloudContainer } from "../../../../services/cloud.service";

interface Props { projectId: string; }

export function StorageTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/index");
  const [containers, setContainers] = useState<CloudContainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await cloudService.listContainers(projectId); setContainers(data); }
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="storage-tab">
      <div className="tab-header"><h3>{t("storage.title")}</h3><span className="records-count">{containers.length}</span></div>
      {containers.length === 0 ? (<div className="empty-state"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg><p>{t("storage.empty")}</p></div>) : (
        <div className="container-cards">
          {containers.map(c => (
            <div key={c.id} className={`container-card ${c.archive ? 'archive' : ''}`}>
              <div className="container-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></div>
              <h4>{c.name}</h4>
              <div className="container-meta">
                <span className={`badge ${c.containerType === 'public' ? 'warning' : c.containerType === 'static' ? 'info' : 'success'}`}>{c.containerType}</span>
                {c.archive && <span className="badge inactive">Archive</span>}
              </div>
              <div className="container-stats">
                <div><label>{t("storage.objects")}</label><span>{c.storedObjects}</span></div>
                <div><label>{t("storage.size")}</label><span>{formatSize(c.storedBytes)}</span></div>
                <div><label>{t("storage.region")}</label><span>{c.region}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default StorageTab;
