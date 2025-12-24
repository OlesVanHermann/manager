// ============================================================
import "./EmailsTab.css";
// TAB: EMAILS - Comptes email et mailing lists
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { emailsService } from "./EmailsTab";

interface Props { domain: string; }

const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ExternalLinkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";

export function EmailsTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/emails");
  const [activeView, setActiveView] = useState<"accounts" | "mailinglists" | "redirections">("accounts");
  const [accounts, setAccounts] = useState<string[]>([]);
  const [mailingLists, setMailingLists] = useState<string[]>([]);
  const [redirections, setRedirections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEmailService, setHasEmailService] = useState(true);

  const loadData = useCallback(async () => {
    try { setLoading(true); const [a, m, r] = await Promise.all([emailsService.listEmailAccounts(domain), emailsService.listMailingLists(domain), emailsService.listEmailRedirections(domain)]); setAccounts(a); setMailingLists(m); setRedirections(r); setHasEmailService(a.length > 0 || m.length > 0 || r.length > 0); }
    catch { setHasEmailService(false); } finally { setLoading(false); }
  }, [domain]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  const emailManagerUrl = `${OVH_MANAGER_BASE}/#/web/email-domain/${domain}`;

  return (
    <div className="emails-tab">
      <div className="tab-header"><div><h3>{t("title")}</h3><p className="tab-description">{t("description")}</p></div><div className="tab-header-actions"><a href={emailManagerUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">{t("manageInManager")} <ExternalLinkIcon /></a></div></div>
      {!hasEmailService ? (
        <div className="empty-state"><MailIcon /><h3>{t("noEmailService")}</h3><p>{t("noEmailServiceHint")}</p><a href="https://www.ovh.com/fr/emails/" target="_blank" rel="noopener noreferrer" className="btn-primary">{t("orderEmail")} <ExternalLinkIcon /></a></div>
      ) : (
        <>
          <div className="view-toggle" style={{ marginBottom: "var(--space-4)" }}><button className={`toggle-btn ${activeView === "accounts" ? "active" : ""}`} onClick={() => setActiveView("accounts")}><MailIcon /> {t("accounts")} ({accounts.length})</button><button className={`toggle-btn ${activeView === "mailinglists" ? "active" : ""}`} onClick={() => setActiveView("mailinglists")}><UsersIcon /> {t("mailingLists")} ({mailingLists.length})</button><button className={`toggle-btn ${activeView === "redirections" ? "active" : ""}`} onClick={() => setActiveView("redirections")}>{t("redirections")} ({redirections.length})</button></div>
          {activeView === "accounts" && (accounts.length === 0 ? <div className="info-banner"><span>ℹ️</span><p>{t("noAccounts")}</p></div> : <div className="email-list">{accounts.map((a) => <div key={a} className="email-item"><MailIcon /><span>{a}@{domain}</span></div>)}</div>)}
          {activeView === "mailinglists" && (mailingLists.length === 0 ? <div className="info-banner"><span>ℹ️</span><p>{t("noMailingLists")}</p></div> : <div className="email-list">{mailingLists.map((l) => <div key={l} className="email-item"><UsersIcon /><span>{l}@{domain}</span></div>)}</div>)}
          {activeView === "redirections" && (redirections.length === 0 ? <div className="info-banner"><span>ℹ️</span><p>{t("noRedirections")}</p></div> : <div className="email-list">{redirections.map((r) => <div key={r} className="email-item"><span>{r}</span></div>)}</div>)}
          <div className="info-box" style={{ marginTop: "var(--space-6)" }}><p>{t("manageHint")}</p></div>
        </>
      )}
    </div>
  );
}

export default EmailsTab;
