// ============================================================
// MODEM PARAMS - Paramètres administration, firmware, backup, maintenance
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connectionsService } from "./connections.service";
import "./ModemOvhTab.css";

interface ModemParamsProps {
  connectionId: string;
}

interface AdminConfig {
  url: string;
  port: number;
  username: string;
  password: string;
}

interface FirmwareConfig {
  version: string;
  upToDate: boolean;
  lastUpdate: string;
  autoUpdate: {
    enabled: boolean;
    window: string;
  };
}

interface BackupInfo {
  lastBackup: {
    date: string;
    size: string;
  } | null;
}

interface MaintenanceInfo {
  uptime: string;
  lastReboot: string;
}

const UPDATE_WINDOWS = [
  { value: "00:00-03:00", label: "00:00 - 03:00" },
  { value: "03:00-06:00", label: "03:00 - 06:00 (recommandé)" },
  { value: "06:00-09:00", label: "06:00 - 09:00" },
  { value: "disabled", label: "Désactivé" },
];

/** Paramètres modem OVH: admin, firmware, backup, maintenance */
export function ModemParams({ connectionId }: ModemParamsProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  // ---------- STATE ----------
  const [admin, setAdmin] = useState<AdminConfig | null>(null);
  const [firmware, setFirmware] = useState<FirmwareConfig | null>(null);
  const [backup, setBackup] = useState<BackupInfo | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data - replace with real API calls
        setAdmin({
          url: "http://192.168.1.1",
          port: 80,
          username: "admin",
          password: "secretpassword123",
        });

        setFirmware({
          version: "4.12.0",
          upToDate: true,
          lastUpdate: "15/12/2024",
          autoUpdate: {
            enabled: true,
            window: "03:00-06:00",
          },
        });

        setBackup({
          lastBackup: {
            date: "10/12/2024 14:30",
            size: "2.3 KB",
          },
        });

        setMaintenance({
          uptime: "127j 08:45:12",
          lastReboot: "25/08/2024 03:15",
        });
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  // ---------- HANDLERS ----------
  const handleOpenAdmin = () => {
    if (admin) {
      window.open(admin.url, "_blank");
    }
  };

  const handleChangePassword = async () => {
    setActionLoading("password");
    try {
      // TODO: Implement modal for password change
      alert(t("modemParams.changePasswordModal"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAutoUpdate = async () => {
    if (!firmware) return;
    setActionLoading("autoUpdate");
    try {
      // TODO: API call to toggle auto update
      setFirmware({
        ...firmware,
        autoUpdate: {
          ...firmware.autoUpdate,
          enabled: !firmware.autoUpdate.enabled,
        },
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeUpdateWindow = async (window: string) => {
    if (!firmware) return;
    setFirmware({
      ...firmware,
      autoUpdate: {
        ...firmware.autoUpdate,
        window,
      },
    });
  };

  const handleForceUpdate = async () => {
    if (!confirm(t("modemParams.confirmForceUpdate"))) return;
    setActionLoading("forceUpdate");
    try {
      await connectionsService.updateModemFirmware(connectionId);
      alert(t("modemParams.updateStarted"));
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleBackup = async () => {
    setActionLoading("backup");
    try {
      // TODO: API call to create backup
      alert(t("modemParams.backupCreated"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadBackup = () => {
    // TODO: Download backup file
    alert(t("modemParams.downloadStarted"));
  };

  const handleRestore = async () => {
    // TODO: Implement file upload modal for restore
    alert(t("modemParams.restoreModal"));
  };

  const handleReset = async () => {
    if (!confirm(t("modemParams.confirmReset"))) return;
    setActionLoading("reset");
    try {
      await connectionsService.resetModem(connectionId);
      alert(t("modemParams.resetStarted"));
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReboot = async () => {
    if (!confirm(t("modemParams.confirmReboot"))) return;
    setActionLoading("reboot");
    try {
      await connectionsService.rebootModem(connectionId);
      alert(t("modemParams.rebootStarted"));
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="modem-loading">{t("loading")}</div>;
  }

  if (error) {
    return <div className="modem-error">{error}</div>;
  }

  return (
    <div className="modem-params">
      {/* SECTION: Accès administration */}
      <div className="modem-section">
        <h3 className="section-title">{t("modemParams.admin.title")}</h3>
        <div className="section-content">
          <div className="params-grid">
            <div className="param-row">
              <span className="param-label">{t("modemParams.admin.url")}</span>
              <div className="param-value-group">
                <span className="param-value param-code">{admin?.url}</span>
                <button className="btn-link" onClick={handleOpenAdmin}>
                  {t("modemParams.admin.open")} ↗
                </button>
              </div>
            </div>
            <div className="param-row">
              <span className="param-label">{t("modemParams.admin.port")}</span>
              <span className="param-value param-code">{admin?.port}</span>
            </div>
            <div className="param-row">
              <span className="param-label">{t("modemParams.admin.username")}</span>
              <span className="param-value param-code">{admin?.username}</span>
            </div>
            <div className="param-row">
              <span className="param-label">{t("modemParams.admin.password")}</span>
              <div className="param-value-group">
                <span className="param-value param-code">
                  {showPassword ? admin?.password : "••••••••"}
                </span>
                <button
                  className="btn-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? t("modemParams.hide") : t("modemParams.show")}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
                <button
                  className="btn-outline btn-sm"
                  onClick={handleChangePassword}
                  disabled={actionLoading === "password"}
                >
                  🔑 {t("modemParams.admin.changePassword")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Firmware */}
      <div className="modem-section">
        <h3 className="section-title">{t("modemParams.firmware.title")}</h3>
        <div className="section-content">
          <div className="params-grid">
            <div className="param-row">
              <span className="param-label">{t("modemParams.firmware.version")}</span>
              <div className="param-value-group">
                <span className="param-value">{firmware?.version}</span>
                {firmware?.upToDate && (
                  <span className="badge badge-success">{t("modemParams.firmware.upToDate")}</span>
                )}
              </div>
            </div>
            <div className="param-row">
              <span className="param-label">{t("modemParams.firmware.lastUpdate")}</span>
              <span className="param-value">{firmware?.lastUpdate}</span>
            </div>
            <div className="param-row">
              <span className="param-label">{t("modemParams.firmware.autoUpdate")}</span>
              <div className="param-value-group">
                <button
                  className={`toggle-switch ${firmware?.autoUpdate.enabled ? "active" : ""}`}
                  onClick={handleToggleAutoUpdate}
                  disabled={actionLoading === "autoUpdate"}
                >
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">
                    {firmware?.autoUpdate.enabled ? "ON" : "OFF"}
                  </span>
                </button>
              </div>
            </div>
            {firmware?.autoUpdate.enabled && (
              <div className="param-row">
                <span className="param-label">{t("modemParams.firmware.window")}</span>
                <select
                  className="param-select"
                  value={firmware?.autoUpdate.window}
                  onChange={(e) => handleChangeUpdateWindow(e.target.value)}
                >
                  {UPDATE_WINDOWS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="section-actions">
            <button
              className="btn-outline"
              onClick={handleForceUpdate}
              disabled={actionLoading === "forceUpdate"}
            >
              ⬆ {t("modemParams.firmware.forceUpdate")}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: Sauvegarde configuration */}
      <div className="modem-section">
        <h3 className="section-title">{t("modemParams.backup.title")}</h3>
        <div className="section-content">
          <div className="params-grid">
            <div className="param-row">
              <span className="param-label">{t("modemParams.backup.lastBackup")}</span>
              <div className="param-value-group">
                <span className="param-value">
                  {backup?.lastBackup?.date || t("modemParams.backup.noBackup")}
                </span>
                {backup?.lastBackup && (
                  <button className="btn-link" onClick={handleDownloadBackup}>
                    📥 {t("modemParams.backup.download")}
                  </button>
                )}
              </div>
            </div>
            {backup?.lastBackup && (
              <div className="param-row">
                <span className="param-label">{t("modemParams.backup.size")}</span>
                <span className="param-value">{backup.lastBackup.size}</span>
              </div>
            )}
          </div>
          <div className="section-actions">
            <button
              className="btn-primary"
              onClick={handleBackup}
              disabled={actionLoading === "backup"}
            >
              💾 {t("modemParams.backup.create")}
            </button>
            <button className="btn-outline" onClick={handleRestore}>
              📤 {t("modemParams.backup.restore")}
            </button>
            <button
              className="btn-danger-outline"
              onClick={handleReset}
              disabled={actionLoading === "reset"}
            >
              🔄 {t("modemParams.backup.reset")}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: Maintenance */}
      <div className="modem-section">
        <h3 className="section-title">{t("modemParams.maintenance.title")}</h3>
        <div className="section-content">
          <div className="params-grid">
            <div className="param-row">
              <span className="param-label">{t("modemParams.maintenance.uptime")}</span>
              <span className="param-value">{maintenance?.uptime}</span>
            </div>
            <div className="param-row">
              <span className="param-label">{t("modemParams.maintenance.lastReboot")}</span>
              <span className="param-value">{maintenance?.lastReboot}</span>
            </div>
          </div>
          <div className="section-actions">
            <button
              className="btn-danger-outline"
              onClick={handleReboot}
              disabled={actionLoading === "reboot"}
            >
              🔄 {t("modemParams.maintenance.reboot")}
            </button>
          </div>
        </div>
      </div>

      {/* INFO BANNER */}
      <div className="info-banner">
        <span className="info-icon">ℹ️</span>
        <span>{t("modemParams.resetWarning")}</span>
      </div>
    </div>
  );
}
