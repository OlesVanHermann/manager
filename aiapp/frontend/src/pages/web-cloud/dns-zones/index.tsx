// ============================================================
// DNS ZONES PAGE - Zones DNS (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../shared";
import { dnsZonesService } from "../../../services/web-cloud.dns-zones";
import { RecordsTab, TasksTab, HistoryTab } from "./tabs";
import "../styles.css";

// ============ ICONS ============

const DnsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Zones DNS avec liste à gauche et détails à droite. */
export default function DnsZonesPage() {
  const { t } = useTranslation("web-cloud/dns-zones/index");

  // ---------- STATE ----------
  const [zones, setZones] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("records");

  // ---------- LOAD ZONES ----------
  const loadZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const zoneNames = await dnsZonesService.listZones();
      const items: ServiceItem[] = zoneNames.map((name) => ({
        id: name,
        name: name,
      }));
      setZones(items);
      if (items.length > 0 && !selectedZone) {
        setSelectedZone(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "records", label: t("tabs.records") },
    { id: "history", label: t("tabs.history") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-dns-zone"
      i18nNamespace="web-cloud/dns-zones/index"
      services={zones}
      loading={loading}
      error={error}
      selectedService={selectedZone}
      onSelectService={setSelectedZone}
      emptyIcon={<DnsIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedZone && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedZone}</h2>
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
            {activeTab === "records" && <RecordsTab zoneName={selectedZone} />}
            {activeTab === "history" && <HistoryTab zoneName={selectedZone} />}
            {activeTab === "tasks" && <TasksTab zoneName={selectedZone} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
