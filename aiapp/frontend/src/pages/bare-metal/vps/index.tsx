// ############################################################
// #  VPS/PAGE - COMPOSANT PAGE STRICTEMENT ISOLÉ             #
// #  CSS LOCAL : ./index.css                                 #
// #  I18N LOCAL : bare-metal/vps/page                        #
// #  SERVICE LOCAL : Intégré dans ce fichier                 #
// #  CLASSES CSS : .vps-page-*                               #
// ############################################################

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../../services/api";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import IpsTab from "./tabs/ips/IpsTab.tsx";
import DisksTab from "./tabs/disks/DisksTab.tsx";
import SnapshotTab from "./tabs/snapshot/SnapshotTab.tsx";
import BackupsTab from "./tabs/backups/BackupsTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type { Vps, VpsServiceInfos, VpsTask } from "./vps.types";
import "./VpsPage.css";

// ============================================================
// SERVICE LOCAL - Intégré dans la page (pas de fichier séparé)
// ============================================================
const pageService = {
  listVps: (): Promise<string[]> => ovhApi.get<string[]>("/vps"),
  getVps: (serviceName: string): Promise<Vps> => ovhApi.get<Vps>(`/vps/${serviceName}`),
  getServiceInfos: (serviceName: string): Promise<VpsServiceInfos> =>
    ovhApi.get<VpsServiceInfos>(`/vps/${serviceName}/serviceInfos`),
  reboot: (serviceName: string): Promise<VpsTask> =>
    ovhApi.post<VpsTask>(`/vps/${serviceName}/reboot`, {}),
  start: (serviceName: string): Promise<VpsTask> =>
    ovhApi.post<VpsTask>(`/vps/${serviceName}/start`, {}),
  stop: (serviceName: string): Promise<VpsTask> =>
    ovhApi.post<VpsTask>(`/vps/${serviceName}/stop`, {}),
  setRescueMode: (serviceName: string, rescue: boolean): Promise<VpsTask> =>
    ovhApi.post<VpsTask>(`/vps/${serviceName}/setNetbootMode`, {
      netBootMode: rescue ? "rescue" : "local",
    }),
};

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Tab {
  id: string;
  labelKey: string;
}

interface VpsWithDetails {
  name: string;
  details?: Vps;
  serviceInfos?: VpsServiceInfos;
  loading: boolean;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// ============================================================
const getStateClass = (state?: string): string => {
  const map: Record<string, string> = {
    running: "vps-page-running",
    stopped: "vps-page-stopped",
    rebooting: "vps-page-warning",
    rescued: "vps-page-rescue",
  };
  return map[state || ""] || "";
};

// ============================================================
// Composant Principal
// ============================================================
export default function VpsPage() {
  const { t } = useTranslation("bare-metal/vps/page");
  const { t: tCommon } = useTranslation("common");
  const [vpsList, setVpsList] = useState<VpsWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [acting, setActing] = useState(false);

  const tabs: Tab[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "ips", labelKey: "tabs.ips" },
    { id: "disks", labelKey: "tabs.disks" },
    { id: "snapshot", labelKey: "tabs.snapshot" },
    { id: "backups", labelKey: "tabs.backups" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadVps = useCallback(async () => {
    try {
      setLoading(true);
      const names = await pageService.listVps();
      const list: VpsWithDetails[] = names.map((name) => ({ name, loading: true }));
      setVpsList(list);
      if (names.length > 0 && !selected) setSelected(names[0]);

      for (let i = 0; i < names.length; i += 5) {
        const batch = names.slice(i, i + 5);
        await Promise.all(
          batch.map(async (name) => {
            try {
              const [details, serviceInfos] = await Promise.all([
                pageService.getVps(name),
                pageService.getServiceInfos(name),
              ]);
              setVpsList((prev) =>
                prev.map((v) =>
                  v.name === name ? { ...v, details, serviceInfos, loading: false } : v
                )
              );
            } catch {
              setVpsList((prev) =>
                prev.map((v) => (v.name === name ? { ...v, loading: false } : v))
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
    loadVps();
  }, []);

  const filtered = vpsList.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const current = vpsList.find((v) => v.name === selected);

  const handleAction = async (action: "reboot" | "start" | "stop" | "rescue") => {
    if (!selected || !current) return;
    const messages: Record<string, string> = {
      reboot: t("actions.confirmReboot"),
      start: t("actions.confirmStart"),
      stop: t("actions.confirmStop"),
      rescue: t("actions.confirmRescue"),
    };
    if (!confirm(messages[action])) return;
    try {
      setActing(true);
      if (action === "reboot") await pageService.reboot(selected);
      else if (action === "start") await pageService.start(selected);
      else if (action === "stop") await pageService.stop(selected);
      else if (action === "rescue")
        await pageService.setRescueMode(
          selected,
          current.details?.netbootMode !== "rescue"
        );
      setTimeout(loadVps, 2000);
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
            loading={current.loading}
          />
        );
      case "ips":
        return <IpsTab serviceName={selected} />;
      case "disks":
        return <DisksTab serviceName={selected} />;
      case "snapshot":
        return <SnapshotTab serviceName={selected} />;
      case "backups":
        return <BackupsTab serviceId={selected} />;
      case "tasks":
        return <TasksTab serviceName={selected} />;
      default:
        return null;
    }
  };

  return (
    <div className="vps-page-container">
      <aside className="vps-page-sidebar">
        <div className="vps-page-sidebar-header">
          <h2>{t("title")}</h2>
          <span className="vps-page-count-badge">{vpsList.length}</span>
        </div>
        <div className="vps-page-sidebar-search">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="vps-page-list">
          {loading && vpsList.length === 0 ? (
            <div className="vps-page-loading-state">
              <div className="vps-page-skeleton-item" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="vps-page-empty-state">{tCommon("empty.title")}</div>
          ) : (
            filtered.map((v) => (
              <button
                key={v.name}
                className={`vps-page-item ${selected === v.name ? "vps-page-item-active" : ""}`}
                onClick={() => setSelected(v.name)}
              >
                <div className={`vps-page-status-dot ${getStateClass(v.details?.state)}`} />
                <div className="vps-page-item-info">
                  <span className="vps-page-item-name">{v.details?.displayName || v.name}</span>
                  {v.details && (
                    <span className="vps-page-item-meta">
                      {v.details.model?.name} | {v.details.zone}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="vps-page-main">
        {selected && current ? (
          <>
            <header className="vps-page-header">
              <div>
                <h1>{current.details?.displayName || selected}</h1>
                {current.details && (
                  <p className="vps-page-description">
                    {current.details.model?.name} | {current.details.zone} |{" "}
                    <span className={`vps-page-state-text ${getStateClass(current.details.state)}`}>
                      {current.details.state}
                    </span>
                  </p>
                )}
              </div>
              <div className="vps-page-actions">
                <button
                  className="vps-page-btn-action"
                  onClick={() => handleAction("reboot")}
                  disabled={acting || current.details?.state === "stopped"}
                >
                  {t("actions.reboot")}
                </button>
                {current.details?.state === "stopped" ? (
                  <button
                    className="vps-page-btn-action vps-page-btn-success"
                    onClick={() => handleAction("start")}
                    disabled={acting}
                  >
                    {t("actions.start")}
                  </button>
                ) : (
                  <button
                    className="vps-page-btn-action vps-page-btn-danger"
                    onClick={() => handleAction("stop")}
                    disabled={acting}
                  >
                    {t("actions.stop")}
                  </button>
                )}
                <button
                  className={`vps-page-btn-action ${current.details?.netbootMode === "rescue" ? "vps-page-btn-warning" : ""}`}
                  onClick={() => handleAction("rescue")}
                  disabled={acting}
                >
                  {current.details?.netbootMode === "rescue"
                    ? t("actions.exitRescue")
                    : t("actions.rescue")}
                </button>
                <button className="vps-page-btn-refresh" onClick={loadVps}>
                  ↻
                </button>
              </div>
            </header>
            <div className="vps-page-tabs-container">
              <div className="vps-page-tabs-list">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`vps-page-tab-btn ${activeTab === tab.id ? "vps-page-tab-active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>
            </div>
            <div className="vps-page-tab-content">{renderTab()}</div>
          </>
        ) : (
          <div className="vps-page-no-selection">
            <p>{t("selectVps")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
