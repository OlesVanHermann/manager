// ============================================================
// ACCÈS INTERNET - Page unifiée Connexions + OverTheBox
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { accessService } from "./access.service";
import ConnectionsPage from "./connections";
import OverTheBoxPage from "./overthebox";
import "./index.css";

type ServiceType = "connection" | "overthebox";

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

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <button onClick={load}>{t("retry")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="access-page">
      {/* LEFT PANEL */}
      <div className="access-left-panel">
        {/* Recherche */}
        <div className="access-search">
          <input
            type="text"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Compteur */}
        <div className="access-counter">
          {connectionCount} {t("counter.connections")} · {otbCount} {t("counter.overthebox")}
        </div>

        {/* Liste des services */}
        <div className="access-list">
          {filteredServices.map((service) => (
            <div
              key={`${service.type}-${service.id}`}
              className={`access-item ${selected?.id === service.id && selected?.type === service.type ? "selected" : ""}`}
              onClick={() => setSelected(service)}
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
              <p>{t("empty.noResults")}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="access-right-panel">
        {selected ? (
          selected.type === "connection" ? (
            <ConnectionsPage connectionId={selected.id} />
          ) : (
            <OverTheBoxPage serviceName={selected.id} />
          )
        ) : (
          <div className="access-no-selection">
            <p>{t("noSelection")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
