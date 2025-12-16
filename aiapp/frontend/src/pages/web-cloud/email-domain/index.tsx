// ============================================================
// EMAIL DOMAIN (MX Plan) - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService, EmailDomain } from "../../../services/email-domain.service";
import { AccountsTab, RedirectionsTab, MailingListsTab, TasksTab } from "./tabs";
import "../styles.css";

interface Tab { id: string; labelKey: string; }
interface DomainWithDetails { domain: string; details?: EmailDomain; loading: boolean; error?: string; }

export default function EmailDomainPage() {
  const { t } = useTranslation("web-cloud/email-domain/index");
  const { t: tCommon } = useTranslation("common");
  const [domains, setDomains] = useState<DomainWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "accounts", labelKey: "tabs.accounts" },
    { id: "redirections", labelKey: "tabs.redirections" },
    { id: "mailingLists", labelKey: "tabs.mailingLists" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      const names = await emailDomainService.listDomains();
      const list: DomainWithDetails[] = names.map(domain => ({ domain, loading: true }));
      setDomains(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (const name of names) {
        try {
          const details = await emailDomainService.getDomain(name);
          setDomains(prev => prev.map(d => d.domain === name ? { ...d, details, loading: false } : d));
        } catch (err) {
          setDomains(prev => prev.map(d => d.domain === name ? { ...d, loading: false, error: String(err) } : d));
        }
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadDomains(); }, []);

  const filtered = domains.filter(d => d.domain.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = domains.find(d => d.domain === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "accounts": return <AccountsTab domain={selected} />;
      case "redirections": return <RedirectionsTab domain={selected} />;
      case "mailingLists": return <MailingListsTab domain={selected} />;
      case "tasks": return <TasksTab domain={selected} />;
      default: return null;
    }
  };

  return (
    <div className="email-page">
      <aside className="email-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{domains.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="email-list">
          {loading && domains.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : error ? (<div className="error-state">{error}</div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((d) => (
              <button key={d.domain} className={`email-item ${selected === d.domain ? "active" : ""}`} onClick={() => setSelected(d.domain)}>
                <div className="email-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></div>
                <div className="email-info"><span className="email-name">{d.domain}</span>{d.details && <span className="email-status badge success">{d.details.status}</span>}</div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="email-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div><h1>{selected}</h1><p className="page-description">MX Plan</p></div>
              <button className="btn-refresh" onClick={loadDomains}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75" /></svg><p>{t("selectDomain")}</p></div>)}
      </main>
    </div>
  );
}
