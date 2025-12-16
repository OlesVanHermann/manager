// ============================================================
// HOSTING TAB: FTP - Utilisateurs FTP/SSH
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, FtpUser, Hosting } from "../../../../services/hosting.service";

interface Props { serviceName: string; details?: Hosting; }

/** Onglet FTP/SSH - Gestion des utilisateurs. */
export function FtpTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [users, setUsers] = useState<FtpUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const logins = await hostingService.listFtpUsers(serviceName);
        const data = await Promise.all(logins.map(l => hostingService.getFtpUser(serviceName, l)));
        setUsers(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="ftp-tab">
      <div className="tab-header">
        <div>
          <h3>{t("ftp.title")}</h3>
          <p className="tab-description">{t("ftp.description")}</p>
        </div>
      </div>

      {details && (
        <div className="connection-info">
          <h4>{t("ftp.connectionInfo")}</h4>
          <div className="info-grid">
            <div className="info-item"><label>{t("ftp.server")}</label><span className="font-mono">ftp.cluster0{details.cluster}.hosting.ovh.net</span></div>
            <div className="info-item"><label>{t("ftp.port")}</label><span className="font-mono">{details.serviceManagementAccess?.ftp?.port || 21}</span></div>
            <div className="info-item"><label>{t("ftp.sshPort")}</label><span className="font-mono">{details.serviceManagementAccess?.ssh?.port || 22}</span></div>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="empty-state"><p>{t("ftp.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("ftp.login")}</th>
              <th>{t("ftp.home")}</th>
              <th>{t("ftp.state")}</th>
              <th>{t("ftp.ssh")}</th>
              <th>{t("ftp.primary")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.login}>
                <td className="font-mono">{u.login}</td>
                <td className="font-mono">{u.home}</td>
                <td><span className={`badge ${u.state === 'rw' ? 'success' : u.state === 'read' ? 'info' : 'inactive'}`}>{u.state}</span></td>
                <td><span className={`badge ${u.serviceManagementCredentials?.ssh ? 'success' : 'inactive'}`}>{u.serviceManagementCredentials?.ssh ? '✓' : '✗'}</span></td>
                <td>{u.isPrimaryAccount ? '★' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FtpTab;
