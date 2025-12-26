// ============================================================
// EMAIL-DOMAIN/REDIRECTIONS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listRedirections, getRedirection } from "./RedirectionsTab.service";
import type { EmailRedirection } from "../../email-domain.types";
import "./RedirectionsTab.css";

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
        const ids = await listRedirections(domain);
        const data = await Promise.all(ids.map(id => getRedirection(domain, id)));
        setRedirections(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  if (loading) return <div className="emaildomain-redirections-loading"><div className="emaildomain-redirections-skeleton" /></div>;
  if (error) return <div className="emaildomain-redirections-error">{error}</div>;

  return (
    <div className="emaildomain-redirections-tab">
      <div className="emaildomain-redirections-tab-header">
        <div>
          <h3>{t("redirections.title")}</h3>
          <p className="emaildomain-redirections-tab-description">{t("redirections.description")}</p>
        </div>
        <span className="emaildomain-redirections-records-count">{redirections.length}</span>
      </div>

      {redirections.length === 0 ? (
        <div className="emaildomain-redirections-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
          <p>{t("redirections.empty")}</p>
        </div>
      ) : (
        <div className="emaildomain-redirections-cards">
          {redirections.map(r => (
            <div key={r.id} className="emaildomain-redirections-card">
              <div className="emaildomain-redirections-flow">
                <span className="emaildomain-redirections-from">{r.from}</span>
                <span className="emaildomain-redirections-arrow">→</span>
                <span className="emaildomain-redirections-to">{r.to}</span>
              </div>
              <div className="emaildomain-redirections-meta">
                <span className={`emaildomain-redirections-badge ${r.localCopy ? 'info' : 'inactive'}`}>{r.localCopy ? '📋 Copie locale' : 'Pas de copie'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RedirectionsTab;
