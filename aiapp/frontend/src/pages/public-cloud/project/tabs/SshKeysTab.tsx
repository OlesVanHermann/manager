import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as projectService from "../../../../services/public-cloud.project";
import type { CloudSshKey } from "../../../../services/public-cloud.project";

interface Props { projectId: string; }

export function SshKeysTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/index");
  const [keys, setKeys] = useState<CloudSshKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await projectService.listSshKeys(projectId); setKeys(data); }
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="sshkeys-tab">
      <div className="tab-header"><h3>{t("sshkeys.title")}</h3><span className="records-count">{keys.length}</span></div>
      {keys.length === 0 ? (<div className="empty-state"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg><p>{t("sshkeys.empty")}</p></div>) : (
        <div className="key-cards">
          {keys.map(key => (
            <div key={key.id} className="key-card">
              <div className="key-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg></div>
              <div className="key-info">
                <h4>{key.name}</h4>
                <p className="font-mono key-fingerprint">{key.publicKey.slice(0, 40)}...</p>
                <p className="key-regions">{key.regions?.length || 0} regions</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default SshKeysTab;
