import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as networksService from "./NetworksTab.service";
import type { CloudNetwork } from "../project.types";
import "./NetworksTab.css";

interface Props { projectId: string; }

export function NetworksTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/networks");
  const [networks, setNetworks] = useState<CloudNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await networksService.listNetworks(projectId); setNetworks(data); }
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  if (loading) return <div className="networks-loading"><div className="networks-skeleton-block" /></div>;

  return (
    <div className="networks-tab">
      <div className="networks-header"><h3>{t("title")}</h3><span className="networks-count">{networks.length}</span></div>
      {networks.length === 0 ? (<div className="networks-empty-state"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg><p>{t("empty")}</p></div>) : (
        <table className="networks-data-table">
          <thead><tr><th>{t("name")}</th><th>{t("vlanId")}</th><th>{t("regions")}</th><th>{t("status")}</th></tr></thead>
          <tbody>
            {networks.map(net => (
              <tr key={net.id}>
                <td className="networks-mono">{net.name}</td>
                <td>{net.vlanId || '-'}</td>
                <td>{net.regions?.map(r => r.region).join(', ') || '-'}</td>
                <td><span className={`networks-badge ${net.status === 'ACTIVE' ? 'networks-badge-success' : 'networks-badge-warning'}`}>{net.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default NetworksTab;
