// ============================================================
// EMAIL DOMAIN PAGE - MX Plan (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../shared";
import { emailDomainService, EmailDomain } from "../../../../services/web-cloud.email-domain";
import { AccountsTab, RedirectionsTab, MailingListsTab, TasksTab } from "./tabs";
import "../../styles.css";
import "./styles.css";

// ============ ICONS ============

const MailIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Email Domain (MX Plan) avec liste a gauche et details a droite. */
export default function EmailDomainPage() {
  const { t } = useTranslation("web-cloud/email-domain/index");

  // ---------- STATE ----------
  const [domains, setDomains] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [domainDetails, setDomainDetails] = useState<EmailDomain | null>(null);

  // ---------- LOAD DOMAINS ----------
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const domainNames = await emailDomainService.listDomains();
      const items: ServiceItem[] = domainNames.map((name) => ({ id: name, name: name }));
      setDomains(items);
      if (items.length > 0 && !selectedDomain) {
        setSelectedDomain(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDomains(); }, [loadDomains]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedDomain) return;
    emailDomainService.getDomain(selectedDomain).then(setDomainDetails).catch(() => setDomainDetails(null));
  }, [selectedDomain]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "accounts", label: t("tabs.accounts") },
    { id: "redirections", label: t("tabs.redirections") },
    { id: "mailinglists", label: t("tabs.mailinglists") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-mx-plan"
      i18nNamespace="web-cloud/email-domain/index"
      services={domains}
      loading={loading}
      error={error}
      selectedService={selectedDomain}
      onSelectService={setSelectedDomain}
      emptyIcon={<MailIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedDomain && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedDomain}</h2>
            {domainDetails && (
              <span className={`badge ${domainDetails.status === 'ok' ? 'success' : 'warning'}`}>
                {domainDetails.status === 'ok' ? '✓ Actif' : '⚠ ' + domainDetails.status}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "accounts" && <AccountsTab domain={selectedDomain} />}
            {activeTab === "redirections" && <RedirectionsTab domain={selectedDomain} />}
            {activeTab === "mailinglists" && <MailingListsTab domain={selectedDomain} />}
            {activeTab === "tasks" && <TasksTab domain={selectedDomain} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
