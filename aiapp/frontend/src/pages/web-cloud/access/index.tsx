// ============================================================
// ACCESS - Page combinée xDSL + OverTheBox
// NAV3: Pack xDSL | OverTheBox
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { packXdslService } from "../../../services/web-cloud.pack-xdsl";
import { overtheboxService } from "../../../services/web-cloud.overthebox";
import { GeneralTab as XdslGeneralTab, AccessTab, ServicesTab, VoipTab as XdslVoipTab, TasksTab as XdslTasksTab } from "../pack-xdsl/tabs";
import { GeneralTab as OtbGeneralTab, RemotesTab, TasksTab as OtbTasksTab } from "../overthebox/tabs";
import "../styles.css";

// ============================================================
// TYPES
// ============================================================

type ProductType = "xdsl" | "overthebox";

interface AccessService {
  name: string;
  type: ProductType;
  loading: boolean;
  error?: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page Acces Internet - Combine Pack xDSL et OverTheBox avec navigation NAV3. */
export default function AccessPage() {
  const { t } = useTranslation("web-cloud/access/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- NAV3 STATE ----------
  const [activeProduct, setActiveProduct] = useState<ProductType>("xdsl");

  // ---------- SERVICES STATE ----------
  const [xdslPacks, setXdslPacks] = useState<AccessService[]>([]);
  const [otbServices, setOtbServices] = useState<AccessService[]>([]);

  // ---------- SELECTION STATE ----------
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------- TABS BY PRODUCT ----------
  const tabsByProduct: Record<ProductType, { id: string; labelKey: string }[]> = {
    xdsl: [
      { id: "general", labelKey: "tabs.general" },
      { id: "access", labelKey: "tabs.access" },
      { id: "services", labelKey: "tabs.services" },
      { id: "voip", labelKey: "tabs.voip" },
      { id: "tasks", labelKey: "tabs.tasks" },
    ],
    overthebox: [
      { id: "general", labelKey: "tabs.general" },
      { id: "remotes", labelKey: "tabs.remotes" },
      { id: "tasks", labelKey: "tabs.tasks" },
    ],
  };

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const [xdslList, otbList] = await Promise.all([
        packXdslService.listPacks().catch(() => []),
        overtheboxService.listServices().catch(() => []),
      ]);
      setXdslPacks(xdslList.map((name: string) => ({ name, type: "xdsl" as ProductType, loading: false })));
      setOtbServices(otbList.map((name: string) => ({ name, type: "overthebox" as ProductType, loading: false })));
    } catch (err) {
      console.error("Error loading access services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  // ---------- GET CURRENT LIST ----------
  const getCurrentList = (): AccessService[] => {
    return activeProduct === "xdsl" ? xdslPacks : otbServices;
  };

  const currentList = getCurrentList();
  const filteredList = currentList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // ---------- RENDER TAB CONTENT ----------
  const renderTabContent = () => {
    if (!selectedService) return null;
    if (activeProduct === "xdsl") {
      switch (activeTab) {
        case "general": return <XdslGeneralTab packName={selectedService} />;
        case "access": return <AccessTab packName={selectedService} />;
        case "services": return <ServicesTab packName={selectedService} />;
        case "voip": return <XdslVoipTab packName={selectedService} />;
        case "tasks": return <XdslTasksTab packName={selectedService} />;
      }
    } else {
      switch (activeTab) {
        case "general": return <OtbGeneralTab serviceName={selectedService} />;
        case "remotes": return <RemotesTab serviceName={selectedService} />;
        case "tasks": return <OtbTasksTab serviceName={selectedService} />;
      }
    }
    return null;
  };

  const handleProductChange = (product: ProductType) => {
    setActiveProduct(product);
    setSelectedService(null);
    setActiveTab("general");
    setSearchQuery("");
  };

  return (
    <div className="domains-page">
      {/* NAV3 - Product Selector */}
      <div className="nav3-bar">
        <button className={`nav3-btn ${activeProduct === "xdsl" ? "active" : ""}`} onClick={() => handleProductChange("xdsl")}>
          {t("nav.xdsl")} <span className="count">{xdslPacks.length}</span>
        </button>
        <button className={`nav3-btn ${activeProduct === "overthebox" ? "active" : ""}`} onClick={() => handleProductChange("overthebox")}>
          {t("nav.overthebox")} <span className="count">{otbServices.length}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className="domains-sidebar">
        <div className="sidebar-header">
          <h2>{activeProduct === "xdsl" ? t("products.xdsl") : t("products.overthebox")}</h2>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="domains-list">
          {loading ? (
            <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /><div className="skeleton-item" /></div>
          ) : filteredList.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filteredList.map((service) => (
              <button key={service.name} className={`domain-item ${selectedService === service.name ? "active" : ""}`} onClick={() => { setSelectedService(service.name); setActiveTab("general"); }}>
                <div className="domain-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>
                </div>
                <div className="domain-info">
                  <span className="domain-name">{service.name}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="domains-main">
        {selectedService ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selectedService}</h1>
                <p className="page-description">{activeProduct === "xdsl" ? t("products.xdsl") : t("products.overthebox")}</p>
              </div>
              <button className="btn-refresh" onClick={loadServices}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                {tCommon("actions.refresh")}
              </button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabsByProduct[activeProduct].map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTabContent()}</div>
          </>
        ) : (
          <div className="no-selection">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>
            <p>{t("selectService")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
