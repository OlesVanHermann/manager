// ============================================================
// SMS - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { smsService, SmsAccount } from "../../../services/web-cloud.sms";
import { SendersTab, OutgoingTab, IncomingTab } from "./tabs";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface AccountWithDetails { name: string; details?: SmsAccount; loading: boolean; }

export default function SmsPage() {
  const { t } = useTranslation("web-cloud/sms/index");
  const { t: tCommon } = useTranslation("common");
  const [accounts, setAccounts] = useState<AccountWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("outgoing");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "outgoing", labelKey: "tabs.outgoing" },
    { id: "incoming", labelKey: "tabs.incoming" },
    { id: "senders", labelKey: "tabs.senders" },
  ];

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const names = await smsService.listSmsAccounts();
      const list: AccountWithDetails[] = names.map(name => ({ name, loading: true }));
      setAccounts(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (const name of names) {
        try {
          const details = await smsService.getSmsAccount(name);
          setAccounts(prev => prev.map(a => a.name === name ? { ...a, details, loading: false } : a));
        } catch { setAccounts(prev => prev.map(a => a.name === name ? { ...a, loading: false } : a)); }
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadAccounts(); }, []);

  const filtered = accounts.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = accounts.find(a => a.name === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "outgoing": return <OutgoingTab serviceName={selected} />;
      case "incoming": return <IncomingTab serviceName={selected} />;
      case "senders": return <SendersTab serviceName={selected} />;
      default: return null;
    }
  };

  return (
    <div className="sms-page">
      <aside className="sms-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{accounts.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="sms-list">
          {loading && accounts.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((a) => (
              <button key={a.name} className={`sms-item ${selected === a.name ? "active" : ""}`} onClick={() => setSelected(a.name)}>
                <div className="sms-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg></div>
                <div className="sms-info">
                  <span className="sms-name">{a.name}</span>
                  {a.details && <span className="sms-credits">{a.details.creditsLeft} credits</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="sms-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && <p className="page-description">{current.details.description} | <span className="credits-badge">{current.details.creditsLeft} credits</span></p>}
              </div>
              <button className="btn-refresh" onClick={loadAccounts}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg><p>{t("selectAccount")}</p></div>)}
      </main>
    </div>
  );
}
