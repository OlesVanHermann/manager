// ============================================================
// VPS - Page principale (défactorisée)
// Imports DIRECTS - pas de barrel file
// Service page ISOLÉ - pas d'import depuis les tabs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { vpsPageService } from "./vps.service";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import IpsTab from "./tabs/ips/IpsTab.tsx";
import DisksTab from "./tabs/disks/DisksTab.tsx";
import SnapshotTab from "./tabs/snapshot/SnapshotTab.tsx";
import BackupsTab from "./tabs/backups/BackupsTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type { Vps, VpsServiceInfos } from "./vps.types";
import "./styles.css";

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

// Helper LOCAL - dupliqué volontairement (défactorisation)
const getStateClass = (state?: string): string => {
  const map: Record<string, string> = {
    running: "running",
    stopped: "stopped",
    rebooting: "warning",
    rescued: "rescue",
  };
  return map[state || ""] || "";
};

export default function VpsPage() {
  const { t } = useTranslation("bare-metal/vps/index");
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
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadVps = useCallback(async () => {
    try {
      setLoading(true);
      const names = await vpsPageService.listVps();
      const list: VpsWithDetails[] = names.map((name) => ({ name, loading: true }));
      setVpsList(list);
      if (names.length > 0 && !selected) setSelected(names[0]);

      for (let i = 0; i < names.length; i += 5) {
        const batch = names.slice(i, i + 5);
        await Promise.all(
          batch.map(async (name) => {
            try {
              const [details, serviceInfos] = await Promise.all([
                vpsPageService.getVps(name),
                vpsPageService.getServiceInfos(name),
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
      if (action === "reboot") await vpsPageService.reboot(selected);
      else if (action === "start") await vpsPageService.start(selected);
      else if (action === "stop") await vpsPageService.stop(selected);
      else if (action === "rescue")
        await vpsPageService.setRescueMode(
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
    <div className="vps-page">
      <aside className="vps-sidebar">
        <div className="sidebar-header">
          <h2>{t("title")}</h2>
          <span className="count-badge">{vpsList.length}</span>
        </div>
        <div className="sidebar-search">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="vps-list">
          {loading && vpsList.length === 0 ? (
            <div className="loading-state">
              <div className="skeleton-item" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filtered.map((v) => (
              <button
                key={v.name}
                className={`vps-item ${selected === v.name ? "active" : ""}`}
                onClick={() => setSelected(v.name)}
              >
                <div className={`vps-status-dot ${getStateClass(v.details?.state)}`} />
                <div className="vps-info">
                  <span className="vps-name">{v.details?.displayName || v.name}</span>
                  {v.details && (
                    <span className="vps-meta">
                      {v.details.model?.name} | {v.details.zone}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="vps-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{current.details?.displayName || selected}</h1>
                {current.details && (
                  <p className="page-description">
                    {current.details.model?.name} | {current.details.zone} |{" "}
                    <span className={`state-text ${getStateClass(current.details.state)}`}>
                      {current.details.state}
                    </span>
                  </p>
                )}
              </div>
              <div className="header-actions">
                <button
                  className="btn-action"
                  onClick={() => handleAction("reboot")}
                  disabled={acting || current.details?.state === "stopped"}
                >
                  {t("actions.reboot")}
                </button>
                {current.details?.state === "stopped" ? (
                  <button
                    className="btn-action success"
                    onClick={() => handleAction("start")}
                    disabled={acting}
                  >
                    {t("actions.start")}
                  </button>
                ) : (
                  <button
                    className="btn-action danger"
                    onClick={() => handleAction("stop")}
                    disabled={acting}
                  >
                    {t("actions.stop")}
                  </button>
                )}
                <button
                  className={`btn-action ${current.details?.netbootMode === "rescue" ? "warning" : ""}`}
                  onClick={() => handleAction("rescue")}
                  disabled={acting}
                >
                  {current.details?.netbootMode === "rescue"
                    ? t("actions.exitRescue")
                    : t("actions.rescue")}
                </button>
                <button className="btn-refresh" onClick={loadVps}>
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
            <p>{t("selectVps")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
