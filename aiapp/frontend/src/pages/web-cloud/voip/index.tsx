// ============================================================
// VOIP - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { voipService, TelephonyBillingAccount } from "../../../services/web-cloud.voip";
import { LinesTab, NumbersTab, VoicemailsTab } from "./tabs";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface AccountWithDetails { billingAccount: string; details?: TelephonyBillingAccount; loading: boolean; }

export default function VoipPage() {
  const { t } = useTranslation("web-cloud/voip/index");
  const { t: tCommon } = useTranslation("common");
  const [accounts, setAccounts] = useState<AccountWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("lines");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "lines", labelKey: "tabs.lines" },
    { id: "numbers", labelKey: "tabs.numbers" },
    { id: "voicemails", labelKey: "tabs.voicemails" },
  ];

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const names = await voipService.listBillingAccounts();
      const list: AccountWithDetails[] = names.map(billingAccount => ({ billingAccount, loading: true }));
      setAccounts(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (const name of names) {
        try {
          const details = await voipService.getBillingAccount(name);
          setAccounts(prev => prev.map(a => a.billingAccount === name ? { ...a, details, loading: false } : a));
        } catch { setAccounts(prev => prev.map(a => a.billingAccount === name ? { ...a, loading: false } : a)); }
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadAccounts(); }, []);

  const filtered = accounts.filter(a => a.billingAccount.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = accounts.find(a => a.billingAccount === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "lines": return <LinesTab billingAccount={selected} />;
      case "numbers": return <NumbersTab billingAccount={selected} />;
      case "voicemails": return <VoicemailsTab billingAccount={selected} />;
      default: return null;
    }
  };

  return (
    <div className="voip-page">
      <aside className="voip-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{accounts.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="account-list">
          {loading && accounts.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((a) => (
              <button key={a.billingAccount} className={`account-item ${selected === a.billingAccount ? "active" : ""}`} onClick={() => setSelected(a.billingAccount)}>
                <div className={`account-status-dot ${a.details?.status === 'enabled' ? 'running' : 'stopped'}`} />
                <div className="account-info">
                  <span className="account-name">{a.billingAccount}</span>
                  {a.details?.description && <span className="account-desc">{a.details.description}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="voip-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && <p className="page-description">{current.details.description} | Credits: {current.details.currentOutplan?.toFixed(2) || 0}€ / {current.details.allowedOutplan}€</p>}
              </div>
              <button className="btn-refresh" onClick={loadAccounts}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg><p>{t("selectAccount")}</p></div>)}
      </main>
    </div>
  );
}
