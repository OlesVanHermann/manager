// ============================================================
// MODEM OVH TAB - Container avec NAV4 (Dashboard, WiFi, DHCP, NAT, Routeur)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { connectionsService } from "../connections.service";
import type { Modem, ModemWifi, ModemDhcp, ModemNatRule, ModemRouter as ModemRouterType, ModemDns, ModemMtu, DhcpLease } from "../connections.types";
import { ModemDashboard } from "./ModemDashboard";
import { ModemWifi as ModemWifiComponent } from "./ModemWifi";
import { ModemDhcp as ModemDhcpComponent } from "./ModemDhcp";
import { ModemNat } from "./ModemNat";
import { ModemRouter as ModemRouterComponent } from "./ModemRouter";
import "./ModemOvhTab.css";

interface ModemOvhTabProps {
  connectionId: string;
}

type SubTabId = "dashboard" | "wifi" | "dhcp" | "nat" | "router";

// Types locaux pour les configs non exportées
interface UpnpConfig {
  enabled: boolean;
  openPorts: number;
  lastDevice?: string;
}

interface DmzConfig {
  enabled: boolean;
  ipAddress?: string;
}

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

export function ModemOvhTab({ connectionId }: ModemOvhTabProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("dashboard");

  // Core data
  const [modem, setModem] = useState<Modem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sub-tab data
  const [wifi, setWifi] = useState<ModemWifi | null>(null);
  const [dhcp, setDhcp] = useState<ModemDhcp | null>(null);
  const [dns, setDns] = useState<ModemDns | null>(null);
  const [leases, setLeases] = useState<DhcpLease[]>([]);
  const [natRules, setNatRules] = useState<ModemNatRule[]>([]);
  const [router, setRouter] = useState<ModemRouterType | null>(null);
  const [mtu, setMtu] = useState<ModemMtu | null>(null);

  // Extended data
  const [upnp, setUpnp] = useState<UpnpConfig | null>({ enabled: false, openPorts: 0 });
  const [dmz, setDmz] = useState<DmzConfig | null>({ enabled: false });
  const [firewall, setFirewall] = useState<FirewallConfig | null>({
    enabled: true,
    level: "medium",
    rulesCount: 0,
    dosProtection: true,
    pingWan: false,
  });
  const [routes, setRoutes] = useState<StaticRoute[]>([]);

  // Loading states for sub-tabs
  const [wifiLoading, setWifiLoading] = useState(false);
  const [dhcpLoading, setDhcpLoading] = useState(false);
  const [natLoading, setNatLoading] = useState(false);
  const [routerLoading, setRouterLoading] = useState(false);

  // Load modem data on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const modemData = await connectionsService.getModem(connectionId);
        setModem(modemData);

        // Pre-load some data for dashboard
        const [wifiData, routerData] = await Promise.all([
          connectionsService.getModemWifi(connectionId).catch(() => null),
          connectionsService.getModemRouter(connectionId).catch(() => null),
        ]);
        setWifi(wifiData);
        setRouter(routerData);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  // Load sub-tab data on demand
  useEffect(() => {
    if (activeSubTab === "wifi" && !wifi) {
      setWifiLoading(true);
      connectionsService.getModemWifi(connectionId)
        .then(setWifi)
        .catch(() => {})
        .finally(() => setWifiLoading(false));
    }
    if (activeSubTab === "dhcp" && !dhcp) {
      setDhcpLoading(true);
      Promise.all([
        connectionsService.getModemDhcp(connectionId),
        connectionsService.getModemDns(connectionId),
        connectionsService.getModemLeases(connectionId).catch(() => []),
      ])
        .then(([dhcpData, dnsData, leasesData]) => {
          setDhcp(dhcpData);
          setDns(dnsData);
          setLeases(leasesData);
        })
        .catch(() => {})
        .finally(() => setDhcpLoading(false));
    }
    if (activeSubTab === "nat" && natRules.length === 0) {
      setNatLoading(true);
      connectionsService.getModemNat(connectionId)
        .then(setNatRules)
        .catch(() => {})
        .finally(() => setNatLoading(false));
    }
    if (activeSubTab === "router" && !mtu) {
      setRouterLoading(true);
      Promise.all([
        connectionsService.getModemRouter(connectionId),
        connectionsService.getModemMtu(connectionId),
      ])
        .then(([routerData, mtuData]) => {
          setRouter(routerData);
          setMtu(mtuData);
        })
        .catch(() => {})
        .finally(() => setRouterLoading(false));
    }
  }, [activeSubTab, connectionId, wifi, dhcp, natRules.length, mtu]);

  const subTabs: { id: SubTabId; labelKey: string }[] = [
    { id: "dashboard", labelKey: "modem.tabs.dashboard" },
    { id: "wifi", labelKey: "modem.tabs.wifi" },
    { id: "dhcp", labelKey: "modem.tabs.dhcp" },
    { id: "nat", labelKey: "modem.tabs.nat" },
    { id: "router", labelKey: "modem.tabs.router" },
  ];

  // Handlers - Dashboard
  const handleReboot = useCallback(async () => {
    try {
      await connectionsService.rebootModem(connectionId);
      const modemData = await connectionsService.getModem(connectionId);
      setModem(modemData);
    } catch (err) {
      console.error("Reboot failed:", err);
    }
  }, [connectionId]);

  const handleResetFactory = useCallback(async () => {
    if (!confirm(t("modem.confirmReset"))) return;
    try {
      await connectionsService.resetModemFactory(connectionId);
    } catch (err) {
      console.error("Reset failed:", err);
    }
  }, [connectionId, t]);

  const handleNavigate = useCallback((tab: string) => {
    setActiveSubTab(tab as SubTabId);
  }, []);

  // Handlers - WiFi
  const handleSaveWifi = useCallback(async (data: Partial<ModemWifi>) => {
    const updated = await connectionsService.updateModemWifi(connectionId, data);
    setWifi(updated);
  }, [connectionId]);

  const handleGeneratePassword = useCallback((band: "24" | "5") => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (band === "24") {
      setWifi(prev => prev ? { ...prev, password24: password } : null);
    } else {
      setWifi(prev => prev ? { ...prev, password5: password } : null);
    }
  }, []);

  // Handlers - DHCP
  const handleSaveDhcp = useCallback(async (data: Partial<ModemDhcp>) => {
    const updated = await connectionsService.updateModemDhcp(connectionId, data);
    setDhcp(updated);
  }, [connectionId]);

  const handleSaveDns = useCallback(async (data: ModemDns) => {
    // TODO: API call to save DNS
    setDns(data);
  }, []);

  const handleReserveLease = useCallback((lease: DhcpLease) => {
    // TODO: Open modal for reservation
    console.log("Reserve lease:", lease);
  }, []);

  const handleDeleteReservation = useCallback((mac: string) => {
    // TODO: API call to delete reservation
    setLeases(prev => prev.filter(l => l.mac !== mac));
  }, []);

  const handleAddReservation = useCallback(() => {
    // TODO: Open modal for new reservation
    console.log("Add reservation");
  }, []);

  // Handlers - NAT
  const handleAddNatRule = useCallback(() => {
    // TODO: Open modal
    console.log("Add NAT rule");
  }, []);

  const handleEditNatRule = useCallback((rule: ModemNatRule) => {
    // TODO: Open modal
    console.log("Edit NAT rule:", rule);
  }, []);

  const handleDeleteNatRule = useCallback(async (ruleId: string) => {
    try {
      await connectionsService.deleteModemNatRule(connectionId, ruleId);
      setNatRules(prev => prev.filter(r => r.id !== ruleId));
    } catch (err) {
      console.error("Delete NAT rule failed:", err);
    }
  }, [connectionId]);

  const handleToggleNatRule = useCallback((ruleId: string, enabled: boolean) => {
    setNatRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, enabled } : r
    ));
  }, []);

  const handleToggleUpnp = useCallback((enabled: boolean) => {
    setUpnp(prev => prev ? { ...prev, enabled } : null);
  }, []);

  const handleConfigureDmz = useCallback(() => {
    // TODO: Open modal
    console.log("Configure DMZ");
  }, []);

  // Handlers - Router
  const handleChangeMode = useCallback(async (mode: "router" | "bridge") => {
    // TODO: API call and confirmation
    setRouter(prev => prev ? { ...prev, mode } : null);
  }, []);

  const handleSaveFirewall = useCallback(async (config: Partial<FirewallConfig>) => {
    setFirewall(prev => prev ? { ...prev, ...config } : null);
  }, []);

  const handleSaveMtu = useCallback(async (size: number) => {
    setMtu({ size });
  }, []);

  const handleAddRoute = useCallback(() => {
    // TODO: Open modal
    console.log("Add route");
  }, []);

  const handleEditRoute = useCallback((route: StaticRoute) => {
    // TODO: Open modal
    console.log("Edit route:", route);
  }, []);

  const handleDeleteRoute = useCallback((routeId: string) => {
    setRoutes(prev => prev.filter(r => r.id !== routeId));
  }, []);

  if (loading) {
    return (
      <div className="modem-ovh-tab">
        <div className="modem-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !modem) {
    return (
      <div className="modem-ovh-tab">
        <div className="modem-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modem-ovh-tab">
      {/* NAV4 */}
      <div className="modem-nav4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`modem-nav4-btn ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="modem-content">
        {activeSubTab === "dashboard" && (
          <ModemDashboard
            connectionId={connectionId}
            modem={modem}
            wifi={wifi}
            router={router}
            natRulesCount={natRules.length}
            onReboot={handleReboot}
            onResetFactory={handleResetFactory}
            onNavigate={handleNavigate}
          />
        )}

        {activeSubTab === "wifi" && (
          <ModemWifiComponent
            connectionId={connectionId}
            wifi={wifi}
            loading={wifiLoading}
            onSave={handleSaveWifi}
            onGeneratePassword={handleGeneratePassword}
          />
        )}

        {activeSubTab === "dhcp" && (
          <ModemDhcpComponent
            connectionId={connectionId}
            dhcp={dhcp}
            dns={dns}
            leases={leases}
            loading={dhcpLoading}
            onSaveDhcp={handleSaveDhcp}
            onSaveDns={handleSaveDns}
            onReserveLease={handleReserveLease}
            onDeleteReservation={handleDeleteReservation}
            onAddReservation={handleAddReservation}
          />
        )}

        {activeSubTab === "nat" && (
          <ModemNat
            connectionId={connectionId}
            natRules={natRules}
            upnp={upnp}
            dmz={dmz}
            loading={natLoading}
            onAddRule={handleAddNatRule}
            onEditRule={handleEditNatRule}
            onDeleteRule={handleDeleteNatRule}
            onToggleRule={handleToggleNatRule}
            onToggleUpnp={handleToggleUpnp}
            onConfigureDmz={handleConfigureDmz}
          />
        )}

        {activeSubTab === "router" && (
          <ModemRouterComponent
            connectionId={connectionId}
            router={router}
            mtu={mtu}
            firewall={firewall}
            routes={routes}
            loading={routerLoading}
            onChangeMode={handleChangeMode}
            onSaveFirewall={handleSaveFirewall}
            onSaveMtu={handleSaveMtu}
            onAddRoute={handleAddRoute}
            onEditRoute={handleEditRoute}
            onDeleteRoute={handleDeleteRoute}
          />
        )}
      </div>
    </div>
  );
}
