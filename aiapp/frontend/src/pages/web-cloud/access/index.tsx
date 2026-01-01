// ============================================================
// ACCÈS INTERNET - Page unifiée Connexions + OverTheBox
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { log } from "../../../services/logger";
import { accessService } from "./access.service";
import ConnectionsPage from "./general";
import OverTheBoxPage from "./overthebox";
import "./index.css";

type ServiceType = "connection" | "overthebox";
type CategoryFilter = "connection" | "overthebox";  // Pas de "all" - NAV3 = choix explicite

interface ServiceItem {
  id: string;
  type: ServiceType;
  name: string;
  techType?: string;
  offerLabel?: string;
  status?: string;
  downSpeed?: number;
  upSpeed?: number;
  modemName?: string;
  modemType?: "ovh" | "custom";
  otbModel?: string;
  remoteCount?: number;
}

export default function AccessPage() {
  const { t } = useTranslation("web-cloud/access/index");

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("connection");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [connectionIds, otbIds] = await Promise.all([
        accessService.listConnections(),
        accessService.listOvertheboxServices(),
      ]);

      const items: ServiceItem[] = [];

      // Charger les connexions
      for (const id of connectionIds) {
        try {
          const conn = await accessService.getConnection(id);
          items.push({
            id: conn.id,
            type: "connection",
            name: conn.name,
            techType: conn.techType,
            offerLabel: conn.offerLabel,
            status: conn.status,
            downSpeed: conn.downSpeed,
            upSpeed: conn.upSpeed,
            modemName: conn.modem?.name,
            modemType: conn.modem?.type,
          });
        } catch {
          items.push({ id, type: "connection", name: id });
        }
      }

      // Ajouter les OTB
      for (const id of otbIds) {
        items.push({
          id,
          type: "overthebox",
          name: id,
          otbModel: "OverTheBox",
          status: "active",
        });
      }

      setServices(items);
      if (items.length > 0 && !selected) {
        setSelected(items[0]);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = s.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const connectionCount = services.filter(s => s.type === "connection").length;
  const otbCount = services.filter(s => s.type === "overthebox").length;

  const formatSpeed = (speed: number | undefined): string => {
    if (!speed) return "-";
    if (speed >= 1000) return `${(speed / 1000).toFixed(0)} Gbps`;
    return `${speed} Mbps`;
  };

  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case "connected":
      case "active":
        return "#10B981";
      case "disconnected":
      case "suspended":
        return "#EF4444";
      case "syncing":
      case "pending":
        return "#F59E0B";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusLabel = (status: string | undefined): string => {
    switch (status) {
      case "connected":
        return t("status.connected");
      case "disconnected":
        return t("status.disconnected");
      case "active":
        return t("status.active");
      case "syncing":
        return t("status.syncing");
      default:
        return status || "-";
    }
  };

  if (loading) {
    return (
      <div className="access-page">
        <div className="access-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="access-page">
        <div className="access-error">
          <p>{t("error")}: {error}</p>
          <button onClick={() => {
            load();
          }}>{t("retry")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="access-page">
      <div className="access-content">
      {/* LEFT PANEL */}
      <div className="access-left-panel">
        {/* NAV3 Selector - Général / OTB (pas de "Tout") */}
        <div className="access-nav3-selector">
          <button
            className={`access-nav3-btn ${categoryFilter === "connection" ? "active" : ""}`}
            onClick={() => {
              setCategoryFilter("connection");
              setSelected(null);  // Reset sélection au changement de catégorie
            }}
          >
            {t("categories.general")}
          </button>
          <button
            className={`access-nav3-btn ${categoryFilter === "overthebox" ? "active" : ""}`}
            onClick={() => {
              setCategoryFilter("overthebox");
              setSelected(null);  // Reset sélection au changement de catégorie
            }}
          >
            {t("categories.overthebox")}
          </button>
        </div>

        {/* Recherche */}
        <div className="access-search">
          <input
            type="text"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        {/* Filter + Compteur */}
        <div className="access-filter-row">
          {filteredServices.length} {t("counter.results")}
        </div>

        {/* Liste des services */}
        <div className="access-list">
          {filteredServices.map((service) => (
            <div
              key={`${service.type}-${service.id}`}
              className={`access-item ${selected?.id === service.id && selected?.type === service.type ? "selected" : ""}`}
              onClick={() => {
                log.action('AccessPage', 'SELECT_SERVICE', { id: service.id, type: service.type });
                setSelected(service);
              }}
            >
              {service.type === "connection" ? (
                <>
                  {/* Item Connexion */}
                  <div className="access-item-header">
                    <span className="access-item-icon">🌐</span>
                    <span className="access-item-name">{service.name}</span>
                  </div>
                  <div className="access-item-type">
                    {service.techType} · {service.offerLabel}
                  </div>
                  <div className="access-item-status">
                    <span
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(service.status) }}
                    />
                    <span>{getStatusLabel(service.status)}</span>
                  </div>
                  <div className="access-item-speed">
                    ↓ {formatSpeed(service.downSpeed)} ↑ {formatSpeed(service.upSpeed)}
                  </div>
                  {service.modemName && (
                    <div className="access-item-modem">
                      {service.modemType === "ovh" ? "📦" : "🔧"} {service.modemName}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Item OverTheBox */}
                  <div className="access-item-header">
                    <span className="access-item-icon">📦</span>
                    <span className="access-item-name">{service.name}</span>
                  </div>
                  <div className="access-item-type">{service.otbModel}</div>
                  <div className="access-item-status">
                    <span
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(service.status) }}
                    />
                    <span>{getStatusLabel(service.status)}</span>
                    {service.remoteCount !== undefined && (
                      <span className="remote-count"> · {service.remoteCount} WAN</span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="access-empty">
              {categoryFilter === "connection" && connectionCount === 0 ? (
                <>
                  <p>{t("empty.noConnections")}</p>
                  <a href="https://www.ovh.com/fr/offre-internet/" target="_blank" rel="noopener noreferrer" className="access-order-link">
                    {t("empty.orderConnection")}
                  </a>
                </>
              ) : categoryFilter === "overthebox" && otbCount === 0 ? (
                <>
                  <p>{t("empty.noOverthebox")}</p>
                  <a href="https://www.ovhtelecom.fr/overthebox/" target="_blank" rel="noopener noreferrer" className="access-order-link">
                    {t("empty.orderOverthebox")}
                  </a>
                </>
              ) : (
                <p>{t("empty.noResults")}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Toujours afficher selon categoryFilter */}
      <div className="access-right-panel">
        {categoryFilter === "connection" ? (
          <ConnectionsPage connectionId={selected?.type === "connection" ? selected.id : undefined} />
        ) : (
          <OverTheBoxPage serviceName={selected?.type === "overthebox" ? selected.id : undefined} />
        )}
      </div>
      </div>
    </div>
  );
}
