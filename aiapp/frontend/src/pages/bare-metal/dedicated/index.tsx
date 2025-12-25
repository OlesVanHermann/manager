// ============================================================
// DEDICATED SERVER - Page principale (défactorisée)
// Imports DIRECTS - pas de barrel file
// Service page ISOLÉ - pas d'import depuis les tabs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dedicatedPageService } from "./dedicated.service";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import NetworkTab from "./tabs/network/NetworkTab.tsx";
import IpmiTab from "./tabs/ipmi/IpmiTab.tsx";
import InterventionsTab from "./tabs/interventions/InterventionsTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type {
  DedicatedServer,
  DedicatedServerServiceInfos,
  DedicatedServerHardware,
} from "./dedicated.types";
import "./styles.css";

interface Tab {
  id: string;
  labelKey: string;
}

interface ServerWithDetails {
  name: string;
  details?: DedicatedServer;
  serviceInfos?: DedicatedServerServiceInfos;
  hardware?: DedicatedServerHardware;
  loading: boolean;
}

// Helper LOCAL - dupliqué volontairement (défactorisation)
const getPowerClass = (state?: string): string => {
  return state === "poweron" ? "running" : "stopped";
};

export default function DedicatedPage() {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const { t: tCommon } = useTranslation("common");
  const [servers, setServers] = useState<ServerWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [acting, setActing] = useState(false);

  const tabs: Tab[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "network", labelKey: "tabs.network" },
    { id: "ipmi", labelKey: "tabs.ipmi" },
    { id: "interventions", labelKey: "tabs.interventions" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadServers = useCallback(async () => {
    try {
      setLoading(true);
      const names = await dedicatedPageService.listServers();
      const list: ServerWithDetails[] = names.map((name) => ({ name, loading: true }));
      setServers(list);
      if (names.length > 0 && !selected) setSelected(names[0]);

      for (let i = 0; i < names.length; i += 3) {
        const batch = names.slice(i, i + 3);
        await Promise.all(
          batch.map(async (name) => {
            try {
              const [details, serviceInfos, hardware] = await Promise.all([
                dedicatedPageService.getServer(name),
                dedicatedPageService.getServiceInfos(name),
                dedicatedPageService.getHardware(name).catch(() => undefined),
              ]);
              setServers((prev) =>
                prev.map((s) =>
                  s.name === name
                    ? { ...s, details, serviceInfos, hardware, loading: false }
                    : s
                )
              );
            } catch {
              setServers((prev) =>
                prev.map((s) => (s.name === name ? { ...s, loading: false } : s))
              );
            }
          })
        );
      }
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    loadServers();
  }, []);

  const filtered = servers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const current = servers.find((s) => s.name === selected);

  const handleReboot = async () => {
    if (!selected || !confirm(t("actions.confirmReboot"))) return;
    try {
      setActing(true);
      await dedicatedPageService.reboot(selected);
      setTimeout(loadServers, 2000);
    } finally {
      setActing(false);
    }
  };

  const renderTab = () => {
    if (!selected || !current) return null;
    switch (activeTab) {
      case "general":
        return (
          <GeneralTab
            serviceName={selected}
            details={current.details}
            serviceInfos={current.serviceInfos}
            hardware={current.hardware}
            loading={current.loading}
          />
        );
      case "network":
        return <NetworkTab serviceName={selected} />;
      case "ipmi":
        return <IpmiTab serviceName={selected} />;
      case "interventions":
        return <InterventionsTab serviceName={selected} />;
      case "tasks":
        return <TasksTab serviceName={selected} />;
      default:
        return null;
    }
  };

  return (
    <div className="dedicated-page">
      <aside className="dedicated-sidebar">
        <div className="sidebar-header">
          <h2>{t("title")}</h2>
          <span className="count-badge">{servers.length}</span>
        </div>
        <div className="sidebar-search">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="server-list">
          {loading && servers.length === 0 ? (
            <div className="loading-state">
              <div className="skeleton-item" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filtered.map((s) => (
              <button
                key={s.name}
                className={`server-item ${selected === s.name ? "active" : ""}`}
                onClick={() => setSelected(s.name)}
              >
                <div className={`server-status-dot ${getPowerClass(s.details?.powerState)}`} />
                <div className="server-info">
                  <span className="server-name">{s.name}</span>
                  {s.details && (
                    <span className="server-meta">
                      {s.details.commercialRange} | {s.details.datacenter}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="dedicated-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && (
                  <p className="page-description">
                    {current.details.commercialRange} | {current.details.datacenter} |{" "}
                    <span className={`state-text ${getPowerClass(current.details.powerState)}`}>
                      {current.details.powerState}
                    </span>
                  </p>
                )}
              </div>
              <div className="header-actions">
                <button className="btn-action" onClick={handleReboot} disabled={acting}>
                  {t("actions.reboot")}
                </button>
                <button className="btn-refresh" onClick={loadServers}>
                  ↻
                </button>
              </div>
            </header>
            <div className="tabs-container">
              <div className="tabs-list">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>
            </div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (
          <div className="no-selection">
            <p>{t("selectServer")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
