// ============================================================
// SUB-TAB - Devices (Appareils connectés / ActiveSync)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface DevicesTabProps {
  domain?: string;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: "phone" | "tablet" | "desktop" | "other";
  os: string;
  osVersion: string;
  account: string;
  lastSync: string;
  status: "allowed" | "blocked" | "pending";
  activeSyncVersion: string;
}

/** Sous-onglet Appareils - Gestion des appareils connectés (ActiveSync). */
export default function DevicesTab({ domain }: DevicesTabProps) {
  const { t } = useTranslation("web-cloud/emails/advanced");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "allowed" | "blocked" | "pending">("all");

  // Mock data - remplacer par appel API
  const devices: ConnectedDevice[] = useMemo(() => [
    {
      id: "1",
      name: "iPhone de Jean",
      type: "phone",
      os: "iOS",
      osVersion: "17.2",
      account: "jean@example.com",
      lastSync: "2024-01-15T14:30:00Z",
      status: "allowed",
      activeSyncVersion: "16.1",
    },
    {
      id: "2",
      name: "Samsung Galaxy S23",
      type: "phone",
      os: "Android",
      osVersion: "14",
      account: "marie@example.com",
      lastSync: "2024-01-15T12:00:00Z",
      status: "allowed",
      activeSyncVersion: "16.0",
    },
    {
      id: "3",
      name: "iPad Pro",
      type: "tablet",
      os: "iPadOS",
      osVersion: "17.2",
      account: "admin@example.com",
      lastSync: "2024-01-14T09:00:00Z",
      status: "allowed",
      activeSyncVersion: "16.1",
    },
    {
      id: "4",
      name: "Appareil inconnu",
      type: "other",
      os: "Unknown",
      osVersion: "-",
      account: "support@example.com",
      lastSync: "2024-01-10T08:00:00Z",
      status: "pending",
      activeSyncVersion: "14.0",
    },
    {
      id: "5",
      name: "Ancien téléphone",
      type: "phone",
      os: "Android",
      osVersion: "10",
      account: "jean@example.com",
      lastSync: "2023-12-01T10:00:00Z",
      status: "blocked",
      activeSyncVersion: "14.1",
    },
  ], []);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      if (search) {
        const searchLower = search.toLowerCase();
        if (
          !d.name.toLowerCase().includes(searchLower) &&
          !d.account.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      if (filterStatus !== "all" && d.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [devices, search, filterStatus]);

  const handleAllow = (device: ConnectedDevice) => {
  };

  const handleBlock = (device: ConnectedDevice) => {
  };

  const handleWipe = (device: ConnectedDevice) => {
    if (window.confirm(t("devices.confirmWipe"))) {
    }
  };

  const handleDelete = (device: ConnectedDevice) => {
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (type: string) => {
    const icons: Record<string, string> = {
      phone: "📱",
      tablet: "📱",
      desktop: "💻",
      other: "❓",
    };
    return icons[type] || "📱";
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      allowed: "ok",
      blocked: "suspended",
      pending: "pending",
    };
    return classes[status] || "";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      allowed: "Autorisé",
      blocked: "Bloqué",
      pending: "En attente",
    };
    return labels[status] || status;
  };

  return (
    <div className="devices-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <div className="filter-chips">
            <button
              className={`filter-chip ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              {t("devices.filters.all")}
            </button>
            <button
              className={`filter-chip ${filterStatus === "allowed" ? "active" : ""}`}
              onClick={() => setFilterStatus("allowed")}
            >
              ✓ {t("devices.filters.allowed")}
            </button>
            <button
              className={`filter-chip ${filterStatus === "pending" ? "active" : ""}`}
              onClick={() => setFilterStatus("pending")}
            >
              ⏳ {t("devices.filters.pending")}
            </button>
            <button
              className={`filter-chip ${filterStatus === "blocked" ? "active" : ""}`}
              onClick={() => setFilterStatus("blocked")}
            >
              ✗ {t("devices.filters.blocked")}
            </button>
          </div>
        </div>
        <div className="emails-toolbar-right">
          <input
            type="text"
            className="filter-input"
            placeholder={t("devices.filters.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Info banner */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <p>{t("devices.info")}</p>
      </div>

      {/* Devices table */}
      {filteredDevices.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📱</div>
          <h3 className="emails-empty-title">{t("devices.empty.title")}</h3>
          <p className="emails-empty-text">{t("devices.empty.description")}</p>
        </div>
      ) : (
        <table className="emails-table devices-table">
          <thead>
            <tr>
              <th>{t("devices.table.device")}</th>
              <th>{t("devices.table.account")}</th>
              <th>{t("devices.table.os")}</th>
              <th>{t("devices.table.lastSync")}</th>
              <th>{t("devices.table.status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device.id} className={`device-row ${device.status}`}>
                <td>
                  <div className="device-info">
                    <span className="device-icon">{getDeviceIcon(device.type)}</span>
                    <span className="device-name">{device.name}</span>
                  </div>
                </td>
                <td>
                  <span className="device-account">{device.account}</span>
                </td>
                <td>
                  <span className="device-os">
                    {device.os} {device.osVersion}
                  </span>
                </td>
                <td>
                  <span className="device-sync">{formatDate(device.lastSync)}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(device.status)}`}>
                    {getStatusLabel(device.status)}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    {device.status !== "allowed" && (
                      <button
                        className="action-btn"
                        title={t("devices.actions.allow")}
                        onClick={() => handleAllow(device)}
                      >
                        ✓
                      </button>
                    )}
                    {device.status !== "blocked" && (
                      <button
                        className="action-btn"
                        title={t("devices.actions.block")}
                        onClick={() => handleBlock(device)}
                      >
                        ⊘
                      </button>
                    )}
                    <button
                      className="action-btn danger"
                      title={t("devices.actions.wipe")}
                      onClick={() => handleWipe(device)}
                    >
                      🗑
                    </button>
                    <button
                      className="action-btn danger"
                      title={t("devices.actions.delete")}
                      onClick={() => handleDelete(device)}
                    >
                      ✗
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
