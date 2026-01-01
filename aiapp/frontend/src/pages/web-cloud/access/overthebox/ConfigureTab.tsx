// ============================================================
// CONFIGURE TAB - Configuration OverTheBox
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../../../services/api";
import type { OtbConfig, AggregationMode, FailoverBehavior } from "./overthebox.types";
import "./ConfigureTab.css";

interface Props {
  serviceName: string;
}

// Mock configuration data
const mockConfig: OtbConfig = {
  network: {
    dhcpStart: "192.168.100.10",
    dhcpEnd: "192.168.100.254",
    routerIp: "192.168.100.1",
    netmask: "255.255.255.0",
    primaryDns: "213.186.33.99",
    secondaryDns: "213.186.33.98",
  },
  aggregation: {
    mode: "load-balancing",
    failover: "automatic",
    encrypted: true,
    mtu: 1500,
  },
  qos: {
    enabled: true,
    download: 850,
    upload: 350,
  },
  backup: {
    lastBackup: "2024-12-25T10:30:00Z",
    available: true,
  },
};

export function ConfigureTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/access/overthebox/configure");

  const [config, setConfig] = useState<OtbConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Network form state
  const [dhcpStart, setDhcpStart] = useState("");
  const [dhcpEnd, setDhcpEnd] = useState("");
  const [routerIp, setRouterIp] = useState("");
  const [netmask, setNetmask] = useState("");
  const [primaryDns, setPrimaryDns] = useState("");
  const [secondaryDns, setSecondaryDns] = useState("");

  // Aggregation form state
  const [aggMode, setAggMode] = useState<AggregationMode>("load-balancing");
  const [failover, setFailover] = useState<FailoverBehavior>("automatic");
  const [encrypted, setEncrypted] = useState(true);
  const [mtu, setMtu] = useState(1500);

  // QoS form state
  const [qosEnabled, setQosEnabled] = useState(true);
  const [qosDownload, setQosDownload] = useState(0);
  const [qosUpload, setQosUpload] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // In production: const cfg = await ovhApi.get(`/overthebox/${serviceName}/config`);
        await new Promise(r => setTimeout(r, 300));
        const cfg = mockConfig;
        setConfig(cfg);

        // Initialize form state
        setDhcpStart(cfg.network.dhcpStart);
        setDhcpEnd(cfg.network.dhcpEnd);
        setRouterIp(cfg.network.routerIp);
        setNetmask(cfg.network.netmask);
        setPrimaryDns(cfg.network.primaryDns);
        setSecondaryDns(cfg.network.secondaryDns);
        setAggMode(cfg.aggregation.mode);
        setFailover(cfg.aggregation.failover);
        setEncrypted(cfg.aggregation.encrypted);
        setMtu(cfg.aggregation.mtu);
        setQosEnabled(cfg.qos.enabled);
        setQosDownload(cfg.qos.download);
        setQosUpload(cfg.qos.upload);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const handleSaveNetwork = useCallback(async () => {
    setSaving(true);
    try {
      // await ovhApi.put(`/overthebox/${serviceName}/config`, { network: {...} });
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setSaving(false);
    }
  }, [serviceName, dhcpStart, dhcpEnd, routerIp, netmask, primaryDns, secondaryDns]);

  const handleSaveAggregation = useCallback(async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setSaving(false);
    }
  }, [serviceName, aggMode, failover, encrypted, mtu]);

  const handleBackup = useCallback(async () => {
    // POST /overthebox/{id}/config/backup
  }, [serviceName]);

  const handleDownload = useCallback(async () => {
    // GET /overthebox/{id}/config/backup
  }, [serviceName]);

  const handleRestore = useCallback(async () => {
    // PUT /overthebox/{id}/config/backup
  }, [serviceName]);

  const handleReset = useCallback(async () => {
    if (window.confirm(t("backup.confirmReset"))) {
      // POST /overthebox/{id}/config/reset
    }
  }, [serviceName, t]);

  if (loading) {
    return (
      <div className="otb-config-loading">
        <div className="otb-config-skeleton" />
      </div>
    );
  }

  return (
    <div className="otb-config-container">
      {/* Network Configuration */}
      <section className="otb-config-section">
        <h3>{t("network.title")}</h3>
        <div className="otb-config-grid">
          <div className="otb-config-row">
            <div className="otb-config-field">
              <label>{t("network.dhcpStart")}</label>
              <input
                type="text"
                className="otb-config-input"
                value={dhcpStart}
                onChange={(e) => setDhcpStart(e.target.value)}
              />
            </div>
            <div className="otb-config-field">
              <label>{t("network.dhcpEnd")}</label>
              <input
                type="text"
                className="otb-config-input"
                value={dhcpEnd}
                onChange={(e) => setDhcpEnd(e.target.value)}
              />
            </div>
          </div>
          <div className="otb-config-row">
            <div className="otb-config-field">
              <label>{t("network.routerIp")}</label>
              <input
                type="text"
                className="otb-config-input"
                value={routerIp}
                onChange={(e) => setRouterIp(e.target.value)}
              />
            </div>
            <div className="otb-config-field">
              <label>{t("network.netmask")}</label>
              <input
                type="text"
                className="otb-config-input"
                value={netmask}
                onChange={(e) => setNetmask(e.target.value)}
              />
            </div>
          </div>
          <div className="otb-config-row">
            <div className="otb-config-field">
              <label>{t("network.primaryDns")}</label>
              <input
                type="text"
                className="otb-config-input"
                value={primaryDns}
                onChange={(e) => setPrimaryDns(e.target.value)}
              />
            </div>
            <div className="otb-config-field">
              <label>{t("network.secondaryDns")}</label>
              <input
                type="text"
                className="otb-config-input"
                value={secondaryDns}
                onChange={(e) => setSecondaryDns(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="otb-config-actions">
          <button
            className="otb-config-btn-primary"
            onClick={handleSaveNetwork}
            disabled={saving}
          >
            {saving ? t("saving") : t("apply")}
          </button>
        </div>
      </section>

      {/* Aggregation Configuration */}
      <section className="otb-config-section">
        <h3>{t("aggregation.title")}</h3>
        <div className="otb-config-grid">
          <div className="otb-config-row">
            <div className="otb-config-field">
              <label>{t("aggregation.mode")}</label>
              <select
                className="otb-config-select"
                value={aggMode}
                onChange={(e) => setAggMode(e.target.value as AggregationMode)}
              >
                <option value="load-balancing">{t("aggregation.modes.loadBalancing")}</option>
                <option value="failover">{t("aggregation.modes.failover")}</option>
                <option value="bandwidth">{t("aggregation.modes.bandwidth")}</option>
                <option value="manual">{t("aggregation.modes.manual")}</option>
              </select>
            </div>
            <div className="otb-config-field">
              <label>{t("aggregation.failover")}</label>
              <select
                className="otb-config-select"
                value={failover}
                onChange={(e) => setFailover(e.target.value as FailoverBehavior)}
              >
                <option value="automatic">{t("aggregation.failovers.automatic")}</option>
                <option value="manual">{t("aggregation.failovers.manual")}</option>
                <option value="degraded">{t("aggregation.failovers.degraded")}</option>
              </select>
            </div>
          </div>
          <div className="otb-config-row">
            <div className="otb-config-field otb-config-toggle-field">
              <label>{t("aggregation.encrypted")}</label>
              <label className="otb-config-toggle">
                <input
                  type="checkbox"
                  checked={encrypted}
                  onChange={(e) => setEncrypted(e.target.checked)}
                />
                <span className="otb-config-toggle-slider"></span>
              </label>
            </div>
            <div className="otb-config-field">
              <label>{t("aggregation.mtu")}</label>
              <input
                type="number"
                className="otb-config-input"
                value={mtu}
                onChange={(e) => setMtu(Number(e.target.value))}
                min={1280}
                max={1500}
              />
            </div>
          </div>
        </div>
        <div className="otb-config-actions">
          <button
            className="otb-config-btn-primary"
            onClick={handleSaveAggregation}
            disabled={saving}
          >
            {saving ? t("saving") : t("apply")}
          </button>
        </div>
      </section>

      {/* QoS Configuration */}
      <section className="otb-config-section">
        <div className="otb-config-section-header">
          <h3>{t("qos.title")}</h3>
          <label className="otb-config-toggle">
            <input
              type="checkbox"
              checked={qosEnabled}
              onChange={(e) => setQosEnabled(e.target.checked)}
            />
            <span className="otb-config-toggle-slider"></span>
          </label>
        </div>
        {qosEnabled && (
          <div className="otb-config-grid">
            <div className="otb-config-row">
              <div className="otb-config-field">
                <label>{t("qos.download")}</label>
                <div className="otb-config-input-suffix">
                  <input
                    type="number"
                    className="otb-config-input"
                    value={qosDownload}
                    onChange={(e) => setQosDownload(Number(e.target.value))}
                  />
                  <span className="otb-config-suffix">Mbps</span>
                </div>
              </div>
              <div className="otb-config-field">
                <label>{t("qos.upload")}</label>
                <div className="otb-config-input-suffix">
                  <input
                    type="number"
                    className="otb-config-input"
                    value={qosUpload}
                    onChange={(e) => setQosUpload(Number(e.target.value))}
                  />
                  <span className="otb-config-suffix">Mbps</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="otb-config-qos-link">
          <a href="#">{t("qos.rules")}</a>
        </div>
      </section>

      {/* Backup & Restore */}
      <section className="otb-config-section">
        <h3>{t("backup.title")}</h3>
        <div className="otb-config-backup-info">
          <span>{t("backup.lastBackup")}:</span>
          <span className="otb-config-backup-date">
            {config?.backup.lastBackup
              ? new Date(config.backup.lastBackup).toLocaleString("fr-FR")
              : t("backup.never")}
          </span>
        </div>
        <div className="otb-config-backup-actions">
          <button className="otb-config-btn-secondary" onClick={handleBackup}>
            {t("backup.create")}
          </button>
          <button
            className="otb-config-btn-secondary"
            onClick={handleDownload}
            disabled={!config?.backup.available}
          >
            {t("backup.download")}
          </button>
          <button className="otb-config-btn-secondary" onClick={handleRestore}>
            {t("backup.restore")}
          </button>
          <button className="otb-config-btn-danger" onClick={handleReset}>
            {t("backup.reset")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfigureTab;
