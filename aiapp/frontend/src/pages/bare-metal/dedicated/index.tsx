// ############################################################
// #  DEDICATED/PAGE - COMPOSANT PAGE STRICTEMENT ISOLÉ       #
// #  CSS LOCAL : ./DedicatedPage.css                         #
// #  I18N LOCAL : bare-metal/dedicated/page                  #
// #  SERVICE LOCAL : Intégré dans ce fichier                 #
// ############################################################

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../../services/api";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import NetworkTab from "./tabs/network/NetworkTab.tsx";
import IpmiTab from "./tabs/ipmi/IpmiTab.tsx";
import InterventionsTab from "./tabs/interventions/InterventionsTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type {
  DedicatedServer,
  DedicatedServerServiceInfos,
  DedicatedServerHardware,
  DedicatedServerTask,
} from "./dedicated.types";
import "./index.css";

// ============================================================
// SERVICE LOCAL - Intégré dans la page (pas de fichier séparé)
// ============================================================
const pageService = {
  listServers: (): Promise<string[]> =>
    ovhApi.get<string[]>("/dedicated/server"),
  getServer: (serviceName: string): Promise<DedicatedServer> =>
    ovhApi.get<DedicatedServer>(`/dedicated/server/${serviceName}`),
  getServiceInfos: (serviceName: string): Promise<DedicatedServerServiceInfos> =>
    ovhApi.get<DedicatedServerServiceInfos>(`/dedicated/server/${serviceName}/serviceInfos`),
  getHardware: (serviceName: string): Promise<DedicatedServerHardware> =>
    ovhApi.get<DedicatedServerHardware>(`/dedicated/server/${serviceName}/specifications/hardware`),
  reboot: (serviceName: string): Promise<DedicatedServerTask> =>
    ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/reboot`, {}),
};

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
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

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// ============================================================
const getPowerClass = (state?: string): string => {
  return state === "poweron" ? "dedicated-page-running" : "dedicated-page-stopped";
};

// ============================================================
// Composant Principal
// ============================================================
export default function DedicatedPage() {
  const { t } = useTranslation("bare-metal/dedicated/page");
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
      const names = await pageService.listServers();
      const list: ServerWithDetails[] = names.map((name) => ({ name, loading: true }));
      setServers(list);
      if (names.length > 0 && !selected) setSelected(names[0]);

      for (let i = 0; i < names.length; i += 3) {
        const batch = names.slice(i, i + 3);
        await Promise.all(
          batch.map(async (name) => {
            try {
              const [details, serviceInfos, hardware] = await Promise.all([
                pageService.getServer(name),
                pageService.getServiceInfos(name),
                pageService.getHardware(name).catch(() => undefined),
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
      await pageService.reboot(selected);
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
    <div className="dedicated-page-container">
      <aside className="dedicated-page-sidebar">
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
        <div className="dedicated-page-list">
          {loading && servers.length === 0 ? (
            <div className="dedicated-page-loading-state">
              <div className="dedicated-page-skeleton-item" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="dedicated-page-empty-state">{tCommon("empty.title")}</div>
          ) : (
            filtered.map((s) => (
              <button
                key={s.name}
                className={`dedicated-page-item ${selected === s.name ? "dedicated-page-item-active" : ""}`}
                onClick={() => setSelected(s.name)}
              >
                <div className={`dedicated-page-status-dot ${getPowerClass(s.details?.powerState)}`} />
                <div className="dedicated-page-item-info">
                  <span className="dedicated-page-item-name">{s.name}</span>
                  {s.details && (
                    <span className="dedicated-page-item-meta">
                      {s.details.commercialRange} | {s.details.datacenter}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="dedicated-page-main">
        {selected && current ? (
          <>
            <header className="dedicated-page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && (
                  <p className="dedicated-page-description">
                    {current.details.commercialRange} | {current.details.datacenter} |{" "}
                    <span className={`dedicated-page-state-text ${getPowerClass(current.details.powerState)}`}>
                      {current.details.powerState}
                    </span>
                  </p>
                )}
              </div>
              <div className="dedicated-page-actions">
                <button
                  className="dedicated-page-btn-action"
                  onClick={handleReboot}
                  disabled={acting}
                >
                  {t("actions.reboot")}
                </button>
                <button className="dedicated-page-btn-refresh" onClick={loadServers}>
                  ↻
                </button>
              </div>
            </header>
            <div className="dedicated-page-tabs-container">
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
            <div className="dedicated-page-tab-content">{renderTab()}</div>
          </>
        ) : (
          <div className="dedicated-page-no-selection">
            <p>{t("selectServer")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
