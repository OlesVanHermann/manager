// ============================================================
// CONNEXIONS PAGE - Container avec 7 tabs NAV3
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab.service";
import type { Connection } from "./connections.types";
import { GeneralTab } from "./GeneralTab";
import { LineTab } from "./line/LineTab";
import { ModemOvhTab } from "./modem/ModemOvhTab";
import { ModemPersoTab } from "./modem/ModemPersoTab";
import { ServicesTab } from "./ServicesTab";
import { VoipTab } from "./voip/VoipTab";
import { OptionsTab } from "./OptionsTab";
import { TasksTab } from "./TasksTab";
import "./connections.css";

interface ConnectionsPageProps {
  connectionId?: string;  // Optionnel: affiche tabs + empty state si undefined
}

type TabId = "general" | "line" | "modem" | "services" | "voip" | "options" | "tasks";

interface Tab {
  id: TabId;
  labelKey: string;
  visible: boolean;
}

export default function ConnectionsPage({ connectionId }: ConnectionsPageProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  useEffect(() => {
    // Si pas de connectionId, reset et ne pas charger
    if (!connectionId) {
      setConnection(null);
      setLoading(false);
      setError(null);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await generalService.getConnection(connectionId);
        setConnection(data);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  // Tabs par défaut (sans connexion sélectionnée, on affiche les tabs de base)
  const defaultTabs: Tab[] = [
    { id: "general", labelKey: "tabs.general", visible: true },
    { id: "line", labelKey: "tabs.line", visible: true },
    { id: "modem", labelKey: "tabs.modem", visible: false },
    { id: "services", labelKey: "tabs.services", visible: false },
    { id: "voip", labelKey: "tabs.voip", visible: false },
    { id: "options", labelKey: "tabs.options", visible: true },
    { id: "tasks", labelKey: "tabs.tasks", visible: true },
  ];

  // Tabs dynamiques selon la configuration (si connexion chargée)
  const tabs: Tab[] = connection ? [
    { id: "general", labelKey: "tabs.general", visible: true },
    { id: "line", labelKey: "tabs.line", visible: true },
    { id: "modem", labelKey: "tabs.modem", visible: connection.modem !== null },
    { id: "services", labelKey: "tabs.services", visible: (connection.services?.length || 0) > 0 },
    { id: "voip", labelKey: "tabs.voip", visible: connection.services?.some(s => s.type === "voip") || false },
    { id: "options", labelKey: "tabs.options", visible: true },
    { id: "tasks", labelKey: "tabs.tasks", visible: true },
  ] : defaultTabs;

  const visibleTabs = tabs.filter(t => t.visible);

  // État loading
  if (loading) {
    return (
      <div className="connections-page">
        <div className="connections-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // État erreur (seulement si on a essayé de charger)
  if (error && connectionId) {
    return (
      <div className="connections-page">
        <div className="connections-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  // État: pas de connexion sélectionnée - afficher tabs + empty state
  if (!connection) {
    return (
      <div className="connections-page">
        {/* Header vide */}
        <div className="connections-header">
          <div className="connections-header-left">
            <h1 className="connections-title">{t("noSelection.title", "Connexions")}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="connections-tabs">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              className={`connections-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="connections-content">
          <div className="connections-empty-state">
            <p>{t("noSelection.message", "Sélectionnez une connexion dans la liste")}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatAddress = (conn: Connection): string => {
    if (!conn.address.street) return "";
    return `${conn.address.street}, ${conn.address.zipCode} ${conn.address.city}`;
  };

  return (
    <div className="connections-page">
      {/* Header */}
      <div className="connections-header">
        <div className="connections-header-left">
          <h1 className="connections-title">{connection.name}</h1>
          <div className="connections-subtitle">
            <span className="tech-badge">{connection.techType}</span>
            <span className="separator">·</span>
            <span>{connection.offerLabel}</span>
            {connection.address.street && (
              <>
                <span className="separator">·</span>
                <span className="address">{formatAddress(connection)}</span>
              </>
            )}
          </div>
        </div>
        <div className="connections-header-actions">
          <button className="btn-secondary" onClick={() => console.log("[ConnectionsPage] Action clicked: move", connectionId)}>{t("actions.move")}</button>
          <button className="btn-secondary" onClick={() => console.log("[ConnectionsPage] Action clicked: migrate", connectionId)}>{t("actions.migrate")}</button>
        </div>
      </div>

      {/* NAV3 Tabs */}
      <div className="connections-tabs">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            className={`connections-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
            }}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="connections-content">
        {activeTab === "general" && (
          <GeneralTab connectionId={connectionId} connection={connection} />
        )}
        {activeTab === "line" && (
          <LineTab connectionId={connectionId} />
        )}
        {activeTab === "modem" && connection.modem?.type === "ovh" && (
          <ModemOvhTab connectionId={connectionId} />
        )}
        {activeTab === "modem" && connection.modem?.type === "custom" && (
          <ModemPersoTab connectionId={connectionId} />
        )}
        {activeTab === "modem" && !connection.modem && (
          <ModemPersoTab connectionId={connectionId} />
        )}
        {activeTab === "services" && (
          <ServicesTab connectionId={connectionId} />
        )}
        {activeTab === "voip" && (
          <VoipTab connectionId={connectionId} />
        )}
        {activeTab === "options" && (
          <OptionsTab connectionId={connectionId} />
        )}
        {activeTab === "tasks" && (
          <TasksTab connectionId={connectionId} />
        )}
      </div>
    </div>
  );
}
