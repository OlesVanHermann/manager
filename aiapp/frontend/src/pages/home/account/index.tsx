// ============================================================
// ACCOUNT PAGE - Mon compte
// Tabs: Infos générales, Éditer, Sécurité, GDPR, Avancé, Contacts
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhUser } from "../../../types/auth.types";
import ProfileTile from "./components/ProfileTile";
import ShortcutsTile from "./components/ShortcutsTile";
import LastBillTile from "./components/LastBillTile";
import EditTab from "./EditTab";
import SecurityTab from "./SecurityTab";
import PrivacyTab from "./PrivacyTab";
import AdvancedTab from "./AdvancedTab";
import { getCredentials } from "../../../services/api";
import * as contactsService from "../../../services/contacts.service";
import * as proceduresService from "../../../services/procedures.service";
import "./styles.css";

interface AccountPageProps {
  user: OvhUser | null;
  isActive?: boolean;
  onNavigate?: (section: string, options?: { tab?: string }) => void;
  initialTab?: string;
}

const tabIdMap: Record<string, string> = {
  "account-info": "info",
  "account-edit": "edit",
  "account-security": "security",
  "account-gdpr": "gdpr",
  "account-advanced": "advanced",
  "account-contacts-services": "contacts-services",
  "account-contacts-requests": "contacts-requests",
  "account-kyc": "kyc",
};

export default function AccountPage({ user, isActive, onNavigate, initialTab }: AccountPageProps) {
  const { t } = useTranslation('home/account/index');
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: t('tabs.info') },
    { id: "edit", label: t('tabs.edit') },
    { id: "security", label: t('tabs.security') },
    { id: "gdpr", label: t('tabs.gdpr') },
    { id: "advanced", label: t('tabs.advanced') },
    { id: "contacts-services", label: t('tabs.contactsServices') },
    { id: "contacts-requests", label: t('tabs.contactsRequests') },
    { id: "kyc", label: t('tabs.kyc') },
  ];

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(tab => tab.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  if (isActive === false) return null;

  const handleShortcutClick = (_shortcutId: string, section?: string, tab?: string) => {
    if (onNavigate && section) {
      onNavigate(section, { tab });
    }
  };

  const handleEditProfile = () => setActiveTab("edit");
  const handleViewBill = () => onNavigate?.("home-billing", { tab: "billing-invoices" });

  return (
    <div className="account-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://help.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="guides-link">{t('guides')}</a>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button key={tab.id} className={"tab-btn" + (activeTab === tab.id ? " active" : "")} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
      </div>

      {activeTab === "info" && (
        <div className="account-tiles">
          <ProfileTile user={user} onEditProfile={handleEditProfile} />
          <ShortcutsTile onShortcutClick={handleShortcutClick} />
          <LastBillTile onViewBill={handleViewBill} />
        </div>
      )}

      {activeTab === "edit" && <EditTab user={user} />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "gdpr" && <PrivacyTab />}
      {activeTab === "advanced" && <AdvancedTab />}
      {activeTab === "contacts-services" && <ContactsServicesTab />}
      {activeTab === "contacts-requests" && <ContactsRequestsTab />}
      {activeTab === "kyc" && <KycTab />}
    </div>
  );
}

// ============================================================
// CONTACTS SERVICES TAB
// ============================================================
function ContactsServicesTab() {
  const { t } = useTranslation('home/account/contacts-services');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<contactsService.ServiceContact[]>([]);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      if (!creds) { setError(t('errors.authRequired')); return; }
      const data = await contactsService.getServiceContacts(creds);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-banner">{error}<button onClick={loadServices} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      {services.length === 0 ? (
        <div className="empty-state"><p>{t('empty')}</p></div>
      ) : (
        <div className="contacts-table-container">
          <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>{t('count', { count: services.length })}</p>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>{t('columns.service')}</th>
                <th>{t('columns.type')}</th>
                <th>{t('columns.admin')}</th>
                <th>{t('columns.tech')}</th>
                <th>{t('columns.billing')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, idx) => (
                <tr key={idx}>
                  <td className="service-name">{service.serviceName}</td>
                  <td>{service.serviceType}</td>
                  <td><code className="contact-code">{service.contactAdmin}</code></td>
                  <td><code className="contact-code">{service.contactTech}</code></td>
                  <td><code className="contact-code">{service.contactBilling}</code></td>
                  <td><a href={"https://www.ovh.com/manager/#/dedicated/contacts/services/" + encodeURIComponent(service.serviceName)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{tCommon('actions.edit')}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CONTACTS REQUESTS TAB
// ============================================================
function ContactsRequestsTab() {
  const { t, i18n } = useTranslation('home/account/contacts-requests');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<contactsService.ContactChange[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      if (!creds) { setError(t('errors.authRequired')); return; }
      const data = await contactsService.getContactChanges(creds);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: "numeric", month: "short", year: "numeric" });

  const getStatusBadge = (state: string) => {
    const map: Record<string, { label: string; className: string }> = {
      todo: { label: t('status.todo'), className: "badge-warning" },
      doing: { label: t('status.doing'), className: "badge-info" },
      done: { label: t('status.done'), className: "badge-success" },
      refused: { label: t('status.refused'), className: "badge-error" },
      validatingByCustomers: { label: t('status.validating'), className: "badge-warning" },
    };
    return map[state] || { label: state, className: "badge-neutral" };
  };

  const getContactTypeName = (type: string) => {
    const map: Record<string, string> = {
      contactAdmin: t('contactTypes.admin'),
      contactTech: t('contactTypes.tech'),
      contactBilling: t('contactTypes.billing'),
    };
    return map[type] || type;
  };

  const pendingStates = ["todo", "doing", "validatingByCustomers"];
  const filteredRequests = filter === "pending" ? requests.filter(r => pendingStates.includes(r.state)) : requests;
  const pendingCount = requests.filter(r => pendingStates.includes(r.state)).length;

  if (loading) {
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-banner">{error}<button onClick={loadRequests} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <div className="filter-bar">
        <button className={"filter-btn" + (filter === "pending" ? " active" : "")} onClick={() => setFilter("pending")}>{t('filters.pending')} ({pendingCount})</button>
        <button className={"filter-btn" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>{t('filters.all')} ({requests.length})</button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state"><p>{filter === "pending" ? t('empty.pending') : t('empty.all')}</p></div>
      ) : (
        <div className="contacts-table-container">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>{t('columns.service')}</th>
                <th>{t('columns.contactType')}</th>
                <th>{t('columns.from')}</th>
                <th>{t('columns.to')}</th>
                <th>{t('columns.date')}</th>
                <th>{t('columns.status')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const status = getStatusBadge(req.state);
                return (
                  <tr key={req.id}>
                    <td className="service-name">{req.serviceDomain}</td>
                    <td>{getContactTypeName(req.type)}</td>
                    <td><code className="contact-code">{req.from}</code></td>
                    <td><code className="contact-code">{req.to}</code></td>
                    <td>{formatDate(req.askDate)}</td>
                    <td><span className={"status-badge " + status.className}>{status.label}</span></td>
                    <td>{pendingStates.includes(req.state) && <a href={"https://www.ovh.com/manager/#/dedicated/contacts/requests/" + req.id} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{t('actions.manage')}</a>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KYC TAB
// ============================================================
function KycTab() {
  const { t } = useTranslation('home/account/kyc');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<proceduresService.FraudStatus | null>(null);

  useEffect(() => { loadStatus(); }, []);

  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proceduresService.getFraudStatus();
      setStatus(data);
    } catch (err) {
      setStatus({ status: "none" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (statusVal: string) => {
    const map: Record<string, { label: string; className: string; description: string }> = {
      required: { label: t('status.required.label'), className: "badge-warning", description: t('status.required.description') },
      pending: { label: t('status.pending.label'), className: "badge-info", description: t('status.pending.description') },
      open: { label: t('status.open.label'), className: "badge-info", description: t('status.open.description') },
      closed: { label: t('status.closed.label'), className: "badge-success", description: t('status.closed.description') },
      none: { label: t('status.none.label'), className: "badge-neutral", description: t('status.none.description') },
    };
    return map[statusVal] || map.none;
  };

  if (loading) {
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-banner">{error}<button onClick={loadStatus} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  const statusInfo = getStatusInfo(status?.status || "none");

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <div className="kyc-status-card" style={{ padding: "2rem", background: "var(--color-background-subtle)", borderRadius: "12px", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <span className={"status-badge " + statusInfo.className} style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>{statusInfo.label}</span>
        </div>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>{statusInfo.description}</p>

        {status?.status === "required" && (
          <div className="kyc-required-section">
            <h4 style={{ marginBottom: "1rem" }}>{t('required.documentsTitle')}</h4>
            <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem", color: "var(--color-text-secondary)" }}>
              <li>{t('required.doc1')}</li>
              <li>{t('required.doc2')}</li>
              <li>{t('required.doc3')}</li>
            </ul>
            <a href="https://www.ovh.com/manager/#/dedicated/useraccount/kyc-documents" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('required.submitButton')}</a>
          </div>
        )}

        {status?.status === "pending" && (
          <div className="kyc-pending-section">
            <p style={{ color: "var(--color-text-secondary)" }}>{t('pending.processingTime')}</p>
          </div>
        )}

        {status?.status === "none" && (
          <div className="kyc-none-section">
            <p style={{ color: "var(--color-text-secondary)" }}>{t('none.futureNotice')}</p>
          </div>
        )}
      </div>

      <div className="kyc-info" style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "8px", background: "var(--color-background)" }}>
        <h4 style={{ marginBottom: "0.5rem" }}>{t('info.title')}</h4>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>{t('info.description')}</p>
        <a href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", fontSize: "0.9rem" }}>{t('info.privacyLink')}</a>
      </div>
    </div>
  );
}
