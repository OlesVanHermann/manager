// ============================================================
// CARRIER SIP PAGE - Trunk SIP (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../shared";
import { carrierSipService, CarrierSip } from "../../../../services/web-cloud.carrier-sip";
import { GeneralTab, EndpointsTab, CdrTab } from "./tabs";
import "../../styles.css";
import "./styles.css";

const TrunkIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export default function CarrierSipPage() {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [serviceDetails, setServiceDetails] = useState<CarrierSip | null>(null);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const billingAccounts = await carrierSipService.listServices();
      const items: ServiceItem[] = [];
      for (const ba of billingAccounts) {
        const carriers = await carrierSipService.listCarrierSip(ba);
        for (const c of carriers) {
          items.push({ id: `${ba}/${c}`, name: c, type: ba });
        }
      }
      setServices(items);
      if (items.length > 0 && !selectedService) setSelectedService(items[0].id);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  const [billingAccount, serviceName] = selectedService?.split('/') || [null, null];

  useEffect(() => {
    if (!billingAccount || !serviceName) return;
    carrierSipService.getCarrierSip(billingAccount, serviceName).then(setServiceDetails).catch(() => setServiceDetails(null));
  }, [billingAccount, serviceName]);

  const detailTabs = [
    { id: "general", label: t("tabs.general") },
    { id: "endpoints", label: t("tabs.endpoints") },
    { id: "cdr", label: t("tabs.cdr") },
  ];

  return (
    <ServiceListPage titleKey="title" descriptionKey="description" guidesUrl="https://help.ovhcloud.com/csm/fr-carrier-sip" i18nNamespace="web-cloud/carrier-sip/index" services={services} loading={loading} error={error} selectedService={selectedService} onSelectService={setSelectedService} emptyIcon={<TrunkIcon />} emptyTitleKey="empty.title" emptyDescriptionKey="empty.description">
      {selectedService && billingAccount && serviceName && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{serviceName}</h2>
            {serviceDetails && <span className={`badge ${serviceDetails.status === 'enabled' ? 'success' : 'warning'}`}>{serviceDetails.currentCalls}/{serviceDetails.maxCalls} appels</span>}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (<button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "general" && <GeneralTab billingAccount={billingAccount} serviceName={serviceName} details={serviceDetails} />}
            {activeTab === "endpoints" && <EndpointsTab billingAccount={billingAccount} serviceName={serviceName} />}
            {activeTab === "cdr" && <CdrTab billingAccount={billingAccount} serviceName={serviceName} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
