// ============================================================
// EMAIL DOMAIN TAB: REDIRECTIONS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService, EmailRedirection } from "../../../../../services/web-cloud.email-domain";

interface Props { domain: string; }

/** Onglet Redirections email. */
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
      <div className="tab-header">
        <div>
          <h3>{t("redirections.title")}</h3>
          <p className="tab-description">{t("redirections.description")}</p>
        </div>
        <span className="records-count">{redirections.length}</span>
      </div>

      {redirections.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
          <p>{t("redirections.empty")}</p>
        </div>
      ) : (
        <div className="redirection-cards">
          {redirections.map(r => (
            <div key={r.id} className="redirection-card">
              <div className="redirection-flow">
                <span className="from">{r.from}</span>
                <span className="arrow">→</span>
                <span className="to">{r.to}</span>
              </div>
              <div className="redirection-meta">
                <span className={`badge ${r.localCopy ? 'info' : 'inactive'}`}>{r.localCopy ? '📋 Copie locale' : 'Pas de copie'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RedirectionsTab;
