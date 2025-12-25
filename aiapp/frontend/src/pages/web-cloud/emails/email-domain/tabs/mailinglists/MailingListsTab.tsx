// ============================================================
// EMAIL-DOMAIN/MAILINGLISTS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listMailingLists, getMailingList } from "./MailingListsTab.service";
import type { EmailMailingList } from "../../email-domain.types";
import "./MailingListsTab.css";

interface Props { domain: string; }

export function MailingListsTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/email-domain/index");
  const [lists, setLists] = useState<EmailMailingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await listMailingLists(domain);
        const data = await Promise.all(names.map(n => getMailingList(domain, n)));
        setLists(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="emaildomain-mailinglists-tab">
      <div className="emaildomain-mailinglists-tab-header">
        <div>
          <h3>{t("mailinglists.title")}</h3>
          <p className="emaildomain-mailinglists-tab-description">{t("mailinglists.description")}</p>
        </div>
        <span className="emaildomain-mailinglists-records-count">{lists.length}</span>
      </div>

      {lists.length === 0 ? (
        <div className="emaildomain-mailinglists-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
          <p>{t("mailinglists.empty")}</p>
        </div>
      ) : (
        <div className="emaildomain-mailinglists-cards">
          {lists.map(l => (
            <div key={l.id} className="emaildomain-mailinglists-card">
              <div className="emaildomain-mailinglists-icon">📧</div>
              <h4>{l.name}@{domain}</h4>
              <div className="emaildomain-mailinglists-stats">
                <div><label>{t("mailinglists.subscribers")}</label> <span>{l.nbSubscribers}</span></div>
                <div><label>Langue</label> <span>{l.language}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MailingListsTab;
