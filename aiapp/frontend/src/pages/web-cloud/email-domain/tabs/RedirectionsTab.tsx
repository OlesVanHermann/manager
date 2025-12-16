// ============================================================
// EMAIL DOMAIN TAB: REDIRECTIONS
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService, EmailRedirection } from "../../../../services/email-domain.service";

interface Props { domain: string; }

export function RedirectionsTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/email-domain/index");
  const [redirections, setRedirections] = useState<EmailRedirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await emailDomainService.listRedirections(domain);
        const data = await Promise.all(ids.map(id => emailDomainService.getRedirection(domain, id)));
        setRedirections(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="redirections-tab">
      <div className="tab-header"><h3>{t("redirections.title")}</h3><p className="tab-description">{t("redirections.description")}</p></div>
      {redirections.length === 0 ? (
        <div className="empty-state"><p>{t("redirections.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("redirections.from")}</th><th>{t("redirections.to")}</th><th>{t("redirections.localCopy")}</th></tr></thead>
          <tbody>
            {redirections.map(r => (
              <tr key={r.id}>
                <td className="font-mono">{r.from}</td>
                <td className="font-mono">{r.to}</td>
                <td><span className={`badge ${r.localCopy ? 'success' : 'inactive'}`}>{r.localCopy ? '✓' : '✗'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RedirectionsTab;
