// ============================================================
// MODEM ROUTER - NAV4 Routeur (mode + firewall + routes)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ModemRouter as ModemRouterType, ModemMtu } from "../connections.types";

interface FirewallConfig {
  enabled: boolean;
  level: "low" | "medium" | "high" | "custom";
  rulesCount: number;
  dosProtection: boolean;
  pingWan: boolean;
}

interface StaticRoute {
  id: string;
  destination: string;
  netmask: string;
  gateway: string;
  interface: string;
  metric: number;
}

interface ModemRouterProps {
  connectionId: string;
  router: ModemRouterType | null;
  mtu: ModemMtu | null;
  firewall: FirewallConfig | null;
  routes: StaticRoute[];
  loading: boolean;
  onChangeMode: (mode: "router" | "bridge") => void;
  onSaveFirewall: (config: Partial<FirewallConfig>) => Promise<void>;
  onSaveMtu: (size: number) => Promise<void>;
  onAddRoute: () => void;
  onEditRoute: (route: StaticRoute) => void;
  onDeleteRoute: (routeId: string) => void;
}

export function ModemRouter({
  connectionId,
  router,
  mtu,
  firewall,
  routes,
  loading,
  onChangeMode,
  onSaveFirewall,
  onSaveMtu,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
}: ModemRouterProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [localMtu, setLocalMtu] = useState<number | null>(null);
  const [localFirewall, setLocalFirewall] = useState<Partial<FirewallConfig>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const mergedFirewall = firewall ? { ...firewall, ...localFirewall } : null;
  const currentMtu = localMtu !== null ? localMtu : (mtu?.size || 1500);

  const handleFirewallChange = (field: keyof FirewallConfig, value: any) => {
    setLocalFirewall(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFirewall = async () => {
    if (Object.keys(localFirewall).length === 0) return;
    setSaving(true);
    try {
      await onSaveFirewall(localFirewall);
      setLocalFirewall({});
    } finally {
      setSaving(false);
    }
  };

  const handleApplyMtu = async () => {
    if (localMtu === null || localMtu === mtu?.size) return;
    setSaving(true);
    try {
      await onSaveMtu(localMtu);
      setLocalMtu(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    if (confirmDelete === routeId) {
      onDeleteRoute(routeId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(routeId);
    }
  };

  const firewallLevels = [
    { value: "low", label: t("modem.router.firewallLow") },
    { value: "medium", label: t("modem.router.firewallMedium") },
    { value: "high", label: t("modem.router.firewallHigh") },
    { value: "custom", label: t("modem.router.firewallCustom") },
  ];

  const hasFirewallChanges = Object.keys(localFirewall).length > 0;
  const hasMtuChanges = localMtu !== null && localMtu !== mtu?.size;

  if (loading) {
    return (
      <div className="modem-router">
        <div className="modem-loading-inline">
          <div className="spinner-small" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modem-router">
      {/* Mode Selection */}
      <div className="router-section">
        <div className="section-header">
          <h4>⚙ {t("modem.router.operatingMode")}</h4>
        </div>
        <div className="mode-cards">
          <div
            className={`mode-card ${router?.mode === "router" ? "selected" : ""}`}
            onClick={() => onChangeMode("router")}
          >
            <div className="mode-radio">
              <input
                type="radio"
                name="modem-mode"
                checked={router?.mode === "router"}
                onChange={() => onChangeMode("router")}
              />
            </div>
            <div className="mode-content">
              <h5>{t("modem.router.routerMode")}</h5>
              <p>{t("modem.router.routerModeDesc")}</p>
              <span className="mode-badge recommended">{t("modem.router.recommended")}</span>
            </div>
          </div>
          <div
            className={`mode-card ${router?.mode === "bridge" ? "selected" : ""}`}
            onClick={() => onChangeMode("bridge")}
          >
            <div className="mode-radio">
              <input
                type="radio"
                name="modem-mode"
                checked={router?.mode === "bridge"}
                onChange={() => onChangeMode("bridge")}
              />
            </div>
            <div className="mode-content">
              <h5>{t("modem.router.bridgeMode")}</h5>
              <p>{t("modem.router.bridgeModeDesc")}</p>
            </div>
          </div>
        </div>
        {router?.mode === "bridge" && (
          <div className="mode-warning">
            <span className="warning-icon">⚠️</span>
            <p>{t("modem.router.bridgeWarning")}</p>
          </div>
        )}
      </div>

      {/* Firewall (only in router mode) */}
      {router?.mode !== "bridge" && (
        <div className="router-section">
          <div className="section-header">
            <h4>🛡 {t("modem.router.firewall")}</h4>
            {mergedFirewall && (
              <span className={`badge-status ${mergedFirewall.enabled ? "on" : "off"}`}>
                {mergedFirewall.enabled ? "ON" : "OFF"}
              </span>
            )}
          </div>
          {mergedFirewall ? (
            <div className="firewall-content">
              <div className="firewall-row">
                <div className="firewall-toggle">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={mergedFirewall.enabled}
                      onChange={(e) => handleFirewallChange("enabled", e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                  <span>{t("modem.router.enableFirewall")}</span>
                </div>
              </div>

              {mergedFirewall.enabled && (
                <>
                  <div className="firewall-fields">
                    <div className="field">
                      <label>{t("modem.router.protectionLevel")}</label>
                      <select
                        value={mergedFirewall.level}
                        onChange={(e) => handleFirewallChange("level", e.target.value)}
                      >
                        {firewallLevels.map(lvl => (
                          <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="info-row">
                      <span>{t("modem.router.activeRules")}</span>
                      <span className="value">{mergedFirewall.rulesCount}</span>
                    </div>
                  </div>

                  <div className="firewall-options">
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={mergedFirewall.dosProtection}
                        onChange={(e) => handleFirewallChange("dosProtection", e.target.checked)}
                      />
                      <span>{t("modem.router.dosProtection")}</span>
                    </label>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={mergedFirewall.pingWan}
                        onChange={(e) => handleFirewallChange("pingWan", e.target.checked)}
                      />
                      <span>{t("modem.router.pingWan")}</span>
                    </label>
                  </div>

                  {hasFirewallChanges && (
                    <div className="field-actions">
                      <button className="btn-secondary" onClick={() => setLocalFirewall({})}>
                        {t("cancel")}
                      </button>
                      <button className="btn-primary" onClick={handleApplyFirewall} disabled={saving}>
                        {saving ? t("saving") : t("modem.router.apply")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="router-empty">
              <p>{t("modem.router.firewallUnavailable")}</p>
            </div>
          )}
        </div>
      )}

      {/* Static Routes */}
      <div className="router-section">
        <div className="section-header">
          <h4>🗺 {t("modem.router.staticRoutes")}</h4>
          <button className="btn-primary" onClick={onAddRoute}>
            + {t("modem.router.addRoute")}
          </button>
        </div>
        {routes.length > 0 ? (
          <div className="routes-table-wrapper">
            <table className="routes-table">
              <thead>
                <tr>
                  <th>{t("modem.router.destination")}</th>
                  <th>{t("modem.router.netmask")}</th>
                  <th>{t("modem.router.gateway")}</th>
                  <th>{t("modem.router.interface")}</th>
                  <th>{t("modem.router.metric")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id}>
                    <td className="mono">{route.destination}</td>
                    <td className="mono">{route.netmask}</td>
                    <td className="mono">{route.gateway}</td>
                    <td>{route.interface}</td>
                    <td>{route.metric}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => onEditRoute(route)}
                        title={t("modem.router.edit")}
                      >
                        ✎
                      </button>
                      <button
                        className={`btn-icon ${confirmDelete === route.id ? "btn-danger-active" : "btn-danger"}`}
                        onClick={() => handleDeleteRoute(route.id)}
                        title={confirmDelete === route.id ? t("modem.router.confirmDelete") : t("modem.router.delete")}
                      >
                        {confirmDelete === route.id ? "✓" : "×"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="routes-empty">
            <p>{t("modem.router.noRoutes")}</p>
          </div>
        )}
      </div>

      {/* MTU */}
      <div className="router-section">
        <div className="section-header">
          <h4>📏 MTU</h4>
        </div>
        <div className="mtu-content">
          <div className="field">
            <label>{t("modem.router.mtuSize")}</label>
            <input
              type="number"
              value={currentMtu}
              onChange={(e) => setLocalMtu(Number(e.target.value))}
              min={576}
              max={1500}
            />
          </div>
          <p className="field-hint">{t("modem.router.mtuHint")}</p>
          {hasMtuChanges && (
            <div className="field-actions">
              <button className="btn-secondary" onClick={() => setLocalMtu(null)}>
                {t("cancel")}
              </button>
              <button className="btn-primary" onClick={handleApplyMtu} disabled={saving}>
                {saving ? t("saving") : t("save")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModemRouter;
