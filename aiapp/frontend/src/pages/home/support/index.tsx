// ============================================================
// SUPPORT PAGE - Support
// 5 Tabs: Tickets, Créer, Niveau, Communications, Diffusion
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhCredentials } from "../../../types/auth.types";
import * as supportService from "../../../services/support.service";
import * as accountService from "../../../services/account.service";
import * as communicationService from "../../../services/communication.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

interface SupportPageProps {
  initialTab?: string;
}

const tabIdMap: Record<string, string> = {
  "support-tickets": "tickets",
  "support-create": "create",
  "support-level": "level",
  "support-communications": "communications",
  "support-broadcast": "broadcast",
};

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export default function SupportPage({ initialTab = "tickets" }: SupportPageProps) {
  const { t } = useTranslation('home/support/index');
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "tickets", label: t('tabs.tickets') },
    { id: "create", label: t('tabs.create') },
    { id: "level", label: t('tabs.level') },
    { id: "communications", label: t('tabs.communications') },
    { id: "broadcast", label: t('tabs.broadcast') },
  ];

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(t => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  return (
    <div className="support-page">
      <div className="support-header">
        <div className="support-header-content">
          <h1>{t('title')}</h1>
          <p className="support-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-support" target="_blank" rel="noopener noreferrer" className="guides-link">
          {t('guides')}
        </a>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content support-content">
        {activeTab === "tickets" && <TicketsTab />}
        {activeTab === "create" && <CreateTicketTab />}
        {activeTab === "level" && <SupportLevelTab />}
        {activeTab === "communications" && <CommunicationsTab />}
        {activeTab === "broadcast" && <BroadcastTab />}
      </div>
    </div>
  );
}

// ============================================================
// TICKETS TAB - Liste des tickets
// ============================================================
function TicketsTab() {
  const { t } = useTranslation('home/support/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<supportService.SupportTicket[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  useEffect(() => { loadTickets(); }, [filter]);

  const loadTickets = async () => {
    const credentials = getCredentials();
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }

    setLoading(true);
    setError(null);

    try {
      const data = await supportService.getTickets(credentials, filter);
      setTickets(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errors.loadError');
      if (message.includes("404") || message.includes("not found")) {
        setTickets([]);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getStateBadge = (state: string) => {
    const stateMap: Record<string, { label: string; className: string }> = {
      open: { label: t('tickets.states.open'), className: "badge-success" },
      closed: { label: t('tickets.states.closed'), className: "badge-neutral" },
      unknown: { label: t('tickets.states.unknown'), className: "badge-neutral" },
    };
    return stateMap[state] || { label: state, className: "badge-neutral" };
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      assistance: { label: t('tickets.types.assistance'), className: "badge-info" },
      billing: { label: t('tickets.types.billing'), className: "badge-warning" },
      incident: { label: t('tickets.types.incident'), className: "badge-error" },
    };
    return typeMap[type] || { label: type, className: "badge-neutral" };
  };

  if (loading) {
    return <div className="tickets-tab"><div className="loading-state"><div className="spinner"></div><p>{t('tickets.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tickets-tab"><div className="error-banner"><span>{error}</span><button onClick={loadTickets}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tickets-tab">
      <div className="filter-bar">
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value as "all" | "open" | "closed")}>
          <option value="all">{t('tickets.filters.all')}</option>
          <option value="open">{t('tickets.filters.open')}</option>
          <option value="closed">{t('tickets.filters.closed')}</option>
        </select>
        <span className="result-count">{t('tickets.count', { count: tickets.length })}</span>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <TicketIcon />
          <h3>{t('tickets.empty.title')}</h3>
          <p>{t('tickets.empty.description')}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('tickets.columns.ticketNumber')}</th>
              <th>{t('tickets.columns.subject')}</th>
              <th>{t('tickets.columns.service')}</th>
              <th>{t('tickets.columns.type')}</th>
              <th>{t('tickets.columns.state')}</th>
              <th>{t('tickets.columns.lastUpdate')}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const state = getStateBadge(ticket.state);
              const type = getTypeBadge(ticket.type);
              return (
                <tr key={ticket.ticketId}>
                  <td><span className="ticket-number">#{ticket.ticketNumber}</span></td>
                  <td className="subject-cell">{ticket.subject}</td>
                  <td>{ticket.serviceName || "-"}</td>
                  <td><span className={`badge ${type.className}`}>{type.label}</span></td>
                  <td><span className={`badge ${state.className}`}>{state.label}</span></td>
                  <td>
                    <div className="update-info">
                      <span>{formatDate(ticket.updateDate)}</span>
                      <span className="last-from">{ticket.lastMessageFrom === "support" ? t('tickets.lastFrom.support') : t('tickets.lastFrom.you')}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="table-actions">
        <a href="https://help.ovhcloud.com/csm" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{t('tickets.helpCenter')}</a>
      </div>
    </div>
  );
}

// ============================================================
// CREATE TICKET TAB
// ============================================================
function CreateTicketTab() {
  const { t } = useTranslation('home/support/index');
  
  return (
    <div className="new-ticket-tab">
      <div className="info-box">
        <h3>{t('create.title')}</h3>
        <p>{t('create.description')}</p>
      </div>
      <div className="quick-links">
        <h4>{t('create.resources')}</h4>
        <ul>
          <li><a href="https://docs.ovh.com" target="_blank" rel="noopener noreferrer">{t('create.links.documentation')}</a></li>
          <li><a href="https://community.ovh.com" target="_blank" rel="noopener noreferrer">{t('create.links.community')}</a></li>
          <li><a href="https://status.ovhcloud.com" target="_blank" rel="noopener noreferrer">{t('create.links.status')}</a></li>
        </ul>
      </div>
      <a href="https://help.ovhcloud.com/csm?id=csm_get_help" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('create.button')}</a>
    </div>
  );
}

// ============================================================
// SUPPORT LEVEL TAB
// ============================================================
interface SupportLevelInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: string;
  isCurrent: boolean;
  actionType: "none" | "included" | "upgrade" | "contact";
}

const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
};

function SupportLevelTab() {
  const { t } = useTranslation('home/support/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>("standard");

  const SUPPORT_LEVELS: Omit<SupportLevelInfo, "isCurrent">[] = [
    { id: "standard", name: t('level.levels.standard.name'), description: t('level.levels.standard.description'), features: t('level.levels.standard.features', { returnObjects: true }) as string[], price: t('level.included'), actionType: "included" },
    { id: "premium", name: t('level.levels.premium.name'), description: t('level.levels.premium.description'), features: t('level.levels.premium.features', { returnObjects: true }) as string[], price: t('level.onQuote'), actionType: "contact" },
    { id: "business", name: t('level.levels.business.name'), description: t('level.levels.business.description'), features: t('level.levels.business.features', { returnObjects: true }) as string[], price: t('level.onQuote'), actionType: "contact" },
    { id: "enterprise", name: t('level.levels.enterprise.name'), description: t('level.levels.enterprise.description'), features: t('level.levels.enterprise.features', { returnObjects: true }) as string[], price: t('level.onQuote'), actionType: "contact" },
  ];

  useEffect(() => { loadSupportLevel(); }, []);

  const loadSupportLevel = async () => {
    const credentials = getCredentials();
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const level = await accountService.getSupportLevel(credentials);
      const normalizedLevel = level.level?.toLowerCase().replace("-accredited", "") || "standard";
      setCurrentLevel(normalizedLevel);
    } catch { setCurrentLevel("standard"); }
    finally { setLoading(false); }
  };

  if (loading) {
    return <div className="support-level-tab"><div className="loading-state"><div className="spinner"></div><p>{t('level.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="support-level-tab"><div className="error-state"><p>{error}</p><button onClick={loadSupportLevel} className="btn btn-primary">{tCommon('actions.refresh')}</button></div></div>;
  }

  const levels: SupportLevelInfo[] = SUPPORT_LEVELS.map(level => ({ ...level, isCurrent: level.id === currentLevel }));
  const currentLevelInfo = levels.find(l => l.isCurrent);

  return (
    <div className="support-level-tab">
      <div className="support-header">
        <h2>{t('level.title')}</h2>
        <p>{t('level.subtitle')}</p>
        <a href={SUPPORT_URLS.comparison} target="_blank" rel="noopener noreferrer" className="comparison-link">{t('level.comparison')}</a>
      </div>

      {currentLevelInfo && (
        <div className="current-level-banner">
          <div className="current-level-info">
            <span className="current-label">{t('level.currentLevel')}</span>
            <span className="current-name">{currentLevelInfo.name}</span>
          </div>
          <span className="badge badge-primary">{t('level.active')}</span>
        </div>
      )}

      <div className="support-levels-grid">
        {levels.map((level) => (
          <div key={level.id} className={`support-level-card ${level.isCurrent ? "current" : ""}`}>
            <div className="level-header">
              <h3>{level.name}</h3>
              {level.isCurrent && <span className="badge badge-success">{t('level.current')}</span>}
            </div>
            <p className="level-description">{level.description}</p>
            <div className="level-price">{level.price}</div>
            <ul className="level-features">
              {level.features.map((feature, idx) => (<li key={idx}>{feature}</li>))}
            </ul>
            <div className="level-actions">
              {level.isCurrent ? (
                <button className="btn btn-secondary" disabled>{t('level.currentButton')}</button>
              ) : level.actionType === "included" ? (
                <span className="included-text">{t('level.includedDefault')}</span>
              ) : (
                <a href={SUPPORT_URLS.comparison} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('level.learnMore')}</a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="support-contact">
        <h3>{t('level.needHelp')}</h3>
        <p>{t('level.contactSales')}</p>
        <a href={SUPPORT_URLS.contact} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{t('level.contactButton')}</a>
      </div>
    </div>
  );
}

// ============================================================
// COMMUNICATIONS TAB - Emails et notifications reçus
// ============================================================
function CommunicationsTab() {
  const { t } = useTranslation('home/support/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<communicationService.NotificationHistory[]>([]);
  const [contactMeans, setContactMeans] = useState<communicationService.ContactMean[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [notifs, contacts] = await Promise.all([
        communicationService.getNotificationHistory(50),
        communicationService.getContactMeans(),
      ]);
      setNotifications(notifs);
      setContactMeans(contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, { label: string; className: string }> = {
      high: { label: t('communications.priorities.high'), className: "badge-error" },
      medium: { label: t('communications.priorities.medium'), className: "badge-warning" },
      low: { label: t('communications.priorities.low'), className: "badge-info" },
      normal: { label: t('communications.priorities.normal'), className: "badge-neutral" },
    };
    return map[priority?.toLowerCase()] || { label: priority || t('communications.priorities.normal'), className: "badge-neutral" };
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      billing: t('communications.categories.billing'),
      incident: t('communications.categories.incident'),
      technical: t('communications.categories.technical'),
      security: t('communications.categories.security'),
      commercial: t('communications.categories.commercial'),
    };
    return map[category?.toLowerCase()] || category || t('communications.categories.other');
  };

  const getContactStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      VALID: { label: t('communications.contactStatus.valid'), className: "badge-success" },
      TO_VALIDATE: { label: t('communications.contactStatus.toValidate'), className: "badge-warning" },
      ERROR: { label: t('communications.contactStatus.error'), className: "badge-error" },
      DISABLED: { label: t('communications.contactStatus.disabled'), className: "badge-neutral" },
    };
    return map[status] || { label: status, className: "badge-neutral" };
  };

  if (loading) {
    return <div className="communications-tab"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  }

  if (error) {
    return (
      <div className="communications-tab">
        <div className="error-banner">
          {error}
          <button onClick={loadData} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="communications-tab">
      <div className="section-header">
        <h2>{t('communications.title')}</h2>
        <p>{t('communications.subtitle')}</p>
      </div>

      {contactMeans.length > 0 && (
        <div className="contacts-section" style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>{t('communications.configuredContacts')}</h3>
          <div className="contacts-chips" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {contactMeans.map((c) => {
              const status = getContactStatusBadge(c.status);
              return (
                <div key={c.id} className="contact-chip" style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  padding: "0.5rem 1rem", 
                  background: "var(--color-background-subtle)", 
                  borderRadius: "20px",
                  fontSize: "0.875rem"
                }}>
                  <MailIcon />
                  <span>{c.email}</span>
                  <span className={`badge ${status.className}`} style={{ fontSize: "0.75rem" }}>{status.label}</span>
                  {c.default && <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>{t('communications.default')}</span>}
                </div>
              );
            })}
          </div>
          <a 
            href="https://www.ovh.com/manager/#/dedicated/contacts" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--color-primary)" }}
          >
            {t('communications.manageContacts')} →
          </a>
        </div>
      )}

      <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
        {t('communications.history')} ({notifications.length})
      </h3>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <MailIcon />
          <h3>{t('communications.empty.title')}</h3>
          <p>{t('communications.empty.description')}</p>
        </div>
      ) : (
        <div className="communications-list">
          {notifications.map((n) => {
            const priority = getPriorityBadge(n.priority);
            return (
              <div key={n.id} className="communication-item">
                <div className="communication-icon">
                  <MailIcon />
                </div>
                <div className="communication-content">
                  <h4>{n.subject}</h4>
                  <div className="communication-meta">
                    <span className="communication-date">{formatDate(n.createdAt)}</span>
                    <span className="badge badge-neutral">{getCategoryLabel(n.category)}</span>
                    <span className={`badge ${priority.className}`}>{priority.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// BROADCAST TAB - Paramètres de diffusion
// ============================================================
function BroadcastTab() {
  const { t } = useTranslation('home/support/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [marketingPrefs, setMarketingPrefs] = useState<communicationService.MarketingPreferences>({
    email: false,
    phone: false,
    sms: false,
    fax: false,
  });
  const [routingRules, setRoutingRules] = useState<communicationService.NotificationRouting[]>([]);
  const [reference, setReference] = useState<communicationService.NotificationReference | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prefs, rules, ref] = await Promise.all([
        communicationService.getMarketingPreferences(),
        communicationService.getRoutingRules(),
        communicationService.getNotificationReference(),
      ]);
      setMarketingPrefs(prefs);
      setRoutingRules(rules);
      setReference(ref);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarketingToggle = async (key: keyof communicationService.MarketingPreferences) => {
    const newPrefs = { ...marketingPrefs, [key]: !marketingPrefs[key] };
    setMarketingPrefs(newPrefs);
    setSaving(true);
    try {
      await communicationService.updateMarketingPreferences(newPrefs);
    } catch (err) {
      setMarketingPrefs(marketingPrefs);
      setError(err instanceof Error ? err.message : t('errors.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="broadcast-tab"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  }

  if (error) {
    return (
      <div className="broadcast-tab">
        <div className="error-banner">
          {error}
          <button onClick={loadData} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="broadcast-tab">
      <div className="section-header">
        <h2>{t('broadcast.title')}</h2>
        <p>{t('broadcast.subtitle')}</p>
      </div>

      <div className="preferences-section" style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          {t('broadcast.marketing.title')} {saving && <span style={{ fontSize: "0.75rem", color: "var(--color-primary)" }}>({t('broadcast.saving')})</span>}
        </h3>
        <div className="preferences-list">
          <div className="preference-item">
            <div className="preference-info">
              <h4>{t('broadcast.marketing.email.title')}</h4>
              <p>{t('broadcast.marketing.email.description')}</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={marketingPrefs.email} onChange={() => handleMarketingToggle("email")} disabled={saving} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <h4>{t('broadcast.marketing.phone.title')}</h4>
              <p>{t('broadcast.marketing.phone.description')}</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={marketingPrefs.phone} onChange={() => handleMarketingToggle("phone")} disabled={saving} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <h4>{t('broadcast.marketing.sms.title')}</h4>
              <p>{t('broadcast.marketing.sms.description')}</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={marketingPrefs.sms} onChange={() => handleMarketingToggle("sms")} disabled={saving} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="routing-section" style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          {t('broadcast.routing.title')} ({routingRules.length})
        </h3>
        
        {routingRules.length === 0 ? (
          <div className="empty-routing" style={{ 
            padding: "1.5rem", 
            background: "var(--color-background-subtle)", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
              {t('broadcast.routing.empty')}
            </p>
            <a 
              href="https://www.ovh.com/manager/#/dedicated/communication/settings" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              {t('broadcast.routing.configure')}
            </a>
          </div>
        ) : (
          <div className="routing-list">
            {routingRules.map((rule) => (
              <div key={rule.id} className="routing-item" style={{
                padding: "1rem",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                marginBottom: "0.75rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0 }}>{rule.name}</h4>
                  <span className={`badge ${rule.active ? "badge-success" : "badge-neutral"}`}>
                    {rule.active ? t('broadcast.routing.active') : t('broadcast.routing.inactive')}
                  </span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0 }}>
                  {t('broadcast.routing.rulesCount', { count: rule.rules.length })} • {t('broadcast.routing.createdAt')} {new Date(rule.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
            <a 
              href="https://www.ovh.com/manager/#/dedicated/communication/settings" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--color-primary)" }}
            >
              {t('broadcast.routing.manage')} →
            </a>
          </div>
        )}
      </div>

      {reference && (reference.categories.length > 0 || reference.priorities.length > 0) && (
        <div className="reference-section">
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
            {t('broadcast.reference.title')}
          </h3>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {reference.categories.length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t('broadcast.reference.categories')}</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {reference.categories.map((c) => (
                    <span key={c.id} className="badge badge-neutral">{c.name}</span>
                  ))}
                </div>
              </div>
            )}
            {reference.priorities.length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t('broadcast.reference.priorities')}</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {reference.priorities.map((p) => (
                    <span key={p.id} className="badge badge-neutral">{p.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="preferences-footer" style={{ marginTop: "2rem" }}>
        <p className="preferences-note">{t('broadcast.securityNote')}</p>
      </div>
    </div>
  );
}

// ============================================================
// ICONS
// ============================================================
function TicketIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>;
}

function MailIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
}
