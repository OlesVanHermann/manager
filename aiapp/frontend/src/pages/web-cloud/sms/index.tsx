// ============================================================
// SMS PAGE - SMS (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../shared";
import { smsService } from "../../../services/web-cloud.sms";
import { OutgoingTab, IncomingTab, SendersTab } from "./tabs";
import "../styles.css";

// ============ ICONS ============

const SmsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page SMS avec liste à gauche et détails à droite. */
export default function SmsPage() {
  const { t } = useTranslation("web-cloud/sms/index");

  // ---------- STATE ----------
  const [accounts, setAccounts] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("outgoing");

  // ---------- LOAD ACCOUNTS ----------
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const accountNames = await smsService.listSmsAccounts();
      const items: ServiceItem[] = accountNames.map((name) => ({
        id: name,
        name: name,
        type: "SMS",
      }));
      setAccounts(items);
      if (items.length > 0 && !selectedAccount) {
        setSelectedAccount(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "outgoing", label: t("tabs.outgoing") },
    { id: "incoming", label: t("tabs.incoming") },
    { id: "senders", label: t("tabs.senders") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-sms"
      i18nNamespace="web-cloud/sms/index"
      services={accounts}
      loading={loading}
      error={error}
      selectedService={selectedAccount}
      onSelectService={setSelectedAccount}
      emptyIcon={<SmsIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedAccount && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedAccount}</h2>
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button
                key={tab.id}
                className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "outgoing" && <OutgoingTab serviceName={selectedAccount} />}
            {activeTab === "incoming" && <IncomingTab serviceName={selectedAccount} />}
            {activeTab === "senders" && <SendersTab serviceName={selectedAccount} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
