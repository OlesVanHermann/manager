// ============================================================
// SMS PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { smsService, SmsAccount } from "../../../../services/web-cloud.sms";
import { OutgoingTab, IncomingTab, SendersTab } from "./tabs";
import "./styles.css";

const SmsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>
  </svg>
);

export default function SmsPage() {
  const { t } = useTranslation("web-cloud/sms/index");
  const [accounts, setAccounts] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("outgoing");
  const [accountDetails, setAccountDetails] = useState<SmsAccount | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const names = await smsService.listAccounts();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setAccounts(items);
      if (items.length > 0 && !selectedAccount) setSelectedAccount(items[0].id);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  useEffect(() => {
    if (!selectedAccount) return;
    smsService.getAccount(selectedAccount).then(setAccountDetails).catch(() => setAccountDetails(null));
  }, [selectedAccount]);

  const detailTabs = [
    { id: "outgoing", label: t("tabs.outgoing") },
    { id: "incoming", label: t("tabs.incoming") },
    { id: "senders", label: t("tabs.senders") },
  ];

  return (
    <ServiceListPage titleKey="title" descriptionKey="description" guidesUrl="https://help.ovhcloud.com/csm/fr-sms" i18nNamespace="web-cloud/sms/index" services={accounts} loading={loading} error={error} selectedService={selectedAccount} onSelectService={setSelectedAccount} emptyIcon={<SmsIcon />} emptyTitleKey="empty.title" emptyDescriptionKey="empty.description">
      {selectedAccount && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedAccount}</h2>
            {accountDetails && <span className="badge success">{accountDetails.creditsLeft} crédits</span>}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (<button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "outgoing" && <OutgoingTab accountName={selectedAccount} />}
            {activeTab === "incoming" && <IncomingTab accountName={selectedAccount} />}
            {activeTab === "senders" && <SendersTab accountName={selectedAccount} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
