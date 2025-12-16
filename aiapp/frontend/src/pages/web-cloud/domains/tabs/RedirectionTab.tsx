// ============================================================
// TAB: REDIRECTION - Redirections web
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, Redirection } from "../../../../services/domains.service";

interface Props {
  domain: string;
}

/** Onglet Redirections web du domaine. */
export function RedirectionTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const [redirections, setRedirections] = useState<Redirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const ids = await domainsService.listRedirections(domain);
        const details = await Promise.all(ids.map(id => domainsService.getRedirection(domain, id)));
        setRedirections(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'visible': return t("redirection.typeVisible");
      case 'visiblePermanent': return t("redirection.typePermanent");
      case 'invisible': return t("redirection.typeInvisible");
      default: return type;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'visible': return 'info';
      case 'visiblePermanent': return 'success';
      case 'invisible': return 'warning';
      default: return '';
    }
  };

  return (
    <div className="redirection-tab">
      <div className="tab-header">
        <div>
          <h3>{t("redirection.title")}</h3>
          <p className="tab-description">{t("redirection.description")}</p>
        </div>
      </div>

      {redirections.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <p>{t("redirection.empty")}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("redirection.subdomain")}</th>
              <th>{t("redirection.target")}</th>
              <th>{t("redirection.type")}</th>
              <th>{t("redirection.title")}</th>
            </tr>
          </thead>
          <tbody>
            {redirections.map(redir => (
              <tr key={redir.id}>
                <td className="font-mono">{redir.subDomain || '@'}.{domain}</td>
                <td className="font-mono target-cell">
                  <a href={redir.target} target="_blank" rel="noopener noreferrer">{redir.target}</a>
                </td>
                <td><span className={`badge ${getTypeBadgeClass(redir.type)}`}>{getTypeLabel(redir.type)}</span></td>
                <td>{redir.title || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RedirectionTab;
