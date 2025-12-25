// ============================================================
// VOIP PAGE - Telephonie (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { voipService, TelephonyBillingAccount } from "../../../../services/web-cloud.voip";
import { LinesTab, NumbersTab, VoicemailsTab } from "./tabs";
import "./styles.css";

const PhoneIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function VoipPage() {
  const { t } = useTranslation("web-cloud/voip/index");
  const [accounts, setAccounts] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("lines");
  const [accountDetails, setAccountDetails] = useState<TelephonyBillingAccount | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const names = await voipService.listBillingAccounts();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setAccounts(items);
      if (items.length > 0 && !selectedAccount) setSelectedAccount(items[0].id);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  useEffect(() => {
    if (!selectedAccount) return;
    voipService.getBillingAccount(selectedAccount).then(setAccountDetails).catch(() => setAccountDetails(null));
  }, [selectedAccount]);

  const detailTabs = [
    { id: "lines", label: t("tabs.lines") },
    { id: "numbers", label: t("tabs.numbers") },
    { id: "voicemails", label: t("tabs.voicemails") },
  ];

  return (
    <ServiceListPage titleKey="title" descriptionKey="description" guidesUrl="https://help.ovhcloud.com/csm/fr-voip" i18nNamespace="web-cloud/voip/index" services={accounts} loading={loading} error={error} selectedService={selectedAccount} onSelectService={setSelectedAccount} emptyIcon={<PhoneIcon />} emptyTitleKey="empty.title" emptyDescriptionKey="empty.description">
      {selectedAccount && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedAccount}</h2>
            {accountDetails && <span className={`badge ${accountDetails.status === 'enabled' ? 'success' : 'warning'}`}>{accountDetails.status}</span>}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (<button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "lines" && <LinesTab billingAccount={selectedAccount} />}
            {activeTab === "numbers" && <NumbersTab billingAccount={selectedAccount} />}
            {activeTab === "voicemails" && <VoicemailsTab billingAccount={selectedAccount} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
