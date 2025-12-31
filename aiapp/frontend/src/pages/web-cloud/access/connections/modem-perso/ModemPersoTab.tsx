// ============================================================
// MODEM PERSO TAB - Container avec NAV4 (Infos, Credentials, VLAN, Guides)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { connectionsService } from "../connections.service";
import type { ModemCredentials, ModemGuide } from "../connections.types";
import "./ModemPersoTab.css";

interface ModemPersoTabProps {
  connectionId: string;
}

type SubTabId = "infos" | "credentials" | "vlan" | "guides";

interface ModemCustomInfo {
  brand: string;
  model: string;
  mac: string;
  serial?: string;
  declarationDate?: string;
}

interface VlanConfig {
  internet: number;
  tv: number;
  voip: number;
  cosInternet: number;
  cosTv: number;
  cosVoip: number;
}

export function ModemPersoTab({ connectionId }: ModemPersoTabProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("infos");
  const [modemInfo, setModemInfo] = useState<ModemCustomInfo | null>(null);
  const [credentials, setCredentials] = useState<ModemCredentials | null>(null);
  const [vlanConfig, setVlanConfig] = useState<VlanConfig | null>(null);
  const [guides, setGuides] = useState<ModemGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const custom = await connectionsService.getModemCustom(connectionId);
        if (custom) {
          setModemInfo({
            brand: custom.brand,
            model: custom.model,
            mac: custom.mac,
            serial: (custom as any).serial,
            declarationDate: (custom as any).declarationDate,
          });
        }
        const creds = await connectionsService.getModemCredentials(connectionId);
        setCredentials(creds);

        // Default VLAN config for French FTTH
        setVlanConfig({
          internet: creds.vlan || 835,
          tv: 838,
          voip: 851,
          cosInternet: 6,
          cosTv: 5,
          cosVoip: 6,
        });
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  useEffect(() => {
    if (activeSubTab === "guides" && guides.length === 0) {
      const brandGuides: ModemGuide[] = [
        { brand: "Ubiquiti", model: "UniFi Dream Machine", url: "https://docs.ovh.com/xdsl/ubiquiti-udm" },
        { brand: "Zyxel", model: "VMG8825", url: "https://docs.ovh.com/xdsl/zyxel-vmg8825" },
        { brand: "TP-Link", model: "Archer VR2100", url: "https://docs.ovh.com/xdsl/tplink-vr2100" },
        { brand: "Netgear", model: "D7000", url: "https://docs.ovh.com/xdsl/netgear-d7000" },
        { brand: "Fritz!Box", model: "7590 AX", url: "https://docs.ovh.com/xdsl/fritzbox-7590" },
        { brand: "Asus", model: "DSL-AC88U", url: "https://docs.ovh.com/xdsl/asus-dsl-ac88u" },
        { brand: "Synology", model: "RT6600ax", url: "https://docs.ovh.com/xdsl/synology-rt6600" },
        { brand: "MikroTik", model: "RB5009", url: "https://docs.ovh.com/xdsl/mikrotik-rb5009" },
      ];
      setGuides(brandGuides);
    }
  }, [activeSubTab, guides.length]);

  const subTabs: { id: SubTabId; labelKey: string }[] = [
    { id: "infos", labelKey: "modemPerso.tabs.infos" },
    { id: "credentials", labelKey: "modemPerso.tabs.credentials" },
    { id: "vlan", labelKey: "modemPerso.tabs.vlan" },
    { id: "guides", labelKey: "modemPerso.tabs.guides" },
  ];

  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const handleRegeneratePassword = useCallback(async () => {
    if (!confirm(t("modemPerso.credentials.confirmRegenerate"))) return;
    setRegenerating(true);
    try {
      // TODO: API call to regenerate password
      // const newCreds = await connectionsService.regeneratePppoePassword(connectionId);
      // setCredentials(newCreds);
      console.log("Regenerate password");
    } finally {
      setRegenerating(false);
    }
  }, [connectionId, t]);

  const handleEditModem = useCallback(() => {
    // TODO: Open modal
    console.log("Edit modem");
  }, []);

  const handleDeleteModem = useCallback(async () => {
    if (!confirm(t("modemPerso.infos.confirmDelete"))) return;
    try {
      // TODO: API call to delete custom modem
      console.log("Delete modem");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [t]);

  const handleDeclareModem = useCallback(() => {
    // TODO: Open modal
    console.log("Declare modem");
  }, []);

  if (loading) {
    return (
      <div className="modem-perso-tab">
        <div className="modem-perso-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modem-perso-tab">
        <div className="modem-perso-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modem-perso-tab">
      {/* Warning Banner */}
      <div className="modem-perso-warning-banner">
        <span className="warning-icon">⚠️</span>
        <div className="warning-content">
          <strong>{t("modemPerso.warning.title")}</strong>
          <p>{t("modemPerso.warning.description")}</p>
        </div>
      </div>

      {/* NAV4 */}
      <div className="modem-perso-nav4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`modem-perso-nav4-btn ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="modem-perso-content">
        {/* Infos Tab */}
        {activeSubTab === "infos" && (
          <div className="modem-perso-infos">
            {/* Modem Déclaré */}
            <div className="info-card">
              <div className="info-card-header">
                <h4>📡 {t("modemPerso.infos.declaredModem")}</h4>
                {modemInfo && (
                  <div className="header-actions">
                    <button className="btn-action" onClick={handleEditModem}>
                      ✎ {t("modemPerso.infos.edit")}
                    </button>
                    <button className="btn-action btn-danger" onClick={handleDeleteModem}>
                      × {t("modemPerso.infos.delete")}
                    </button>
                  </div>
                )}
              </div>
              <div className="info-card-content">
                {modemInfo ? (
                  <div className="modem-declared">
                    <div className="modem-display">
                      <div className="modem-icon-large">📡</div>
                      <div className="modem-details-large">
                        <span className="modem-brand">{modemInfo.brand}</span>
                        <span className="modem-model">{modemInfo.model}</span>
                      </div>
                    </div>
                    <div className="modem-info-grid">
                      <div className="info-item">
                        <span className="info-label">{t("modemPerso.infos.macAddress")}</span>
                        <div className="info-value-row">
                          <span className="mono">{modemInfo.mac}</span>
                          <button
                            className="btn-copy"
                            onClick={() => handleCopy(modemInfo.mac, "mac")}
                          >
                            {copiedField === "mac" ? "✓" : "📋"}
                          </button>
                        </div>
                      </div>
                      {modemInfo.serial && (
                        <div className="info-item">
                          <span className="info-label">{t("modemPerso.infos.serialNumber")}</span>
                          <span className="mono">{modemInfo.serial}</span>
                        </div>
                      )}
                      {modemInfo.declarationDate && (
                        <div className="info-item">
                          <span className="info-label">{t("modemPerso.infos.declarationDate")}</span>
                          <span>{modemInfo.declarationDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="modem-empty">
                    <span className="empty-icon">📡</span>
                    <p>{t("modemPerso.infos.noModem")}</p>
                    <p className="empty-hint">{t("modemPerso.infos.noModemHint")}</p>
                    <button className="btn-primary" onClick={handleDeclareModem}>
                      + {t("modemPerso.infos.declareModem")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="info-card">
              <div className="info-card-header">
                <h4>📋 {t("modemPerso.infos.requirements")}</h4>
              </div>
              <div className="info-card-content">
                <ul className="requirements-list">
                  <li>
                    <span className="req-icon">✓</span>
                    <span>{t("modemPerso.infos.req1")}</span>
                  </li>
                  <li>
                    <span className="req-icon">✓</span>
                    <span>{t("modemPerso.infos.req2")}</span>
                  </li>
                  <li>
                    <span className="req-icon">✓</span>
                    <span>{t("modemPerso.infos.req3")}</span>
                  </li>
                  <li>
                    <span className="req-icon">✓</span>
                    <span>{t("modemPerso.infos.req4")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Credentials Tab */}
        {activeSubTab === "credentials" && (
          <div className="modem-perso-credentials">
            {/* PPPoE */}
            <div className="credentials-card">
              <div className="credentials-card-header">
                <h4>🔐 {t("modemPerso.credentials.pppoe")}</h4>
              </div>
              {credentials && (
                <div className="credentials-content">
                  <div className="credential-row">
                    <span className="credential-label">{t("modemPerso.credentials.mode")}</span>
                    <span className="credential-value badge-mode">{credentials.mode}</span>
                  </div>
                  <div className="credential-row">
                    <span className="credential-label">{t("modemPerso.credentials.username")}</span>
                    <div className="credential-value-row">
                      <span className="mono">{credentials.username}</span>
                      <button
                        className="btn-copy"
                        onClick={() => handleCopy(credentials.username, "username")}
                      >
                        {copiedField === "username" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>
                  <div className="credential-row">
                    <span className="credential-label">{t("modemPerso.credentials.password")}</span>
                    <div className="credential-value-row">
                      <span className="mono">
                        {showPassword ? credentials.password : "••••••••••••"}
                      </span>
                      <button
                        className="btn-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁"}
                      </button>
                      <button
                        className="btn-copy"
                        onClick={() => handleCopy(credentials.password, "password")}
                      >
                        {copiedField === "password" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>
                  <div className="credential-actions">
                    <button
                      className="btn-secondary"
                      onClick={handleRegeneratePassword}
                      disabled={regenerating}
                    >
                      🔄 {regenerating ? t("modemPerso.credentials.regenerating") : t("modemPerso.credentials.regenerate")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DNS Servers */}
            <div className="credentials-card">
              <div className="credentials-card-header">
                <h4>🌐 {t("modemPerso.credentials.dnsServers")}</h4>
              </div>
              <div className="credentials-content">
                <div className="credential-row">
                  <span className="credential-label">{t("modemPerso.credentials.primaryDns")}</span>
                  <div className="credential-value-row">
                    <span className="mono">91.134.0.1</span>
                    <button
                      className="btn-copy"
                      onClick={() => handleCopy("91.134.0.1", "dns1")}
                    >
                      {copiedField === "dns1" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="credential-row">
                  <span className="credential-label">{t("modemPerso.credentials.secondaryDns")}</span>
                  <div className="credential-value-row">
                    <span className="mono">91.134.0.2</span>
                    <button
                      className="btn-copy"
                      onClick={() => handleCopy("91.134.0.2", "dns2")}
                    >
                      {copiedField === "dns2" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VLAN Tab */}
        {activeSubTab === "vlan" && (
          <div className="modem-perso-vlan">
            <div className="vlan-card">
              <div className="vlan-card-header">
                <h4>🔗 {t("modemPerso.vlan.configuration")}</h4>
              </div>
              {vlanConfig && (
                <div className="vlan-content">
                  <div className="vlan-info-banner">
                    <span className="info-icon">ℹ️</span>
                    <p>{t("modemPerso.vlan.infoBanner")}</p>
                  </div>

                  <div className="vlan-table">
                    <div className="vlan-header">
                      <span>{t("modemPerso.vlan.service")}</span>
                      <span>VLAN ID</span>
                      <span>CoS</span>
                      <span></span>
                    </div>
                    <div className="vlan-row">
                      <span className="vlan-service">
                        <span className="service-icon">🌐</span>
                        Internet
                      </span>
                      <span className="mono vlan-id">{vlanConfig.internet}</span>
                      <span className="mono vlan-cos">{vlanConfig.cosInternet}</span>
                      <button
                        className="btn-copy"
                        onClick={() => handleCopy(String(vlanConfig.internet), "vlan-internet")}
                      >
                        {copiedField === "vlan-internet" ? "✓" : "📋"}
                      </button>
                    </div>
                    <div className="vlan-row">
                      <span className="vlan-service">
                        <span className="service-icon">📺</span>
                        TV
                      </span>
                      <span className="mono vlan-id">{vlanConfig.tv}</span>
                      <span className="mono vlan-cos">{vlanConfig.cosTv}</span>
                      <button
                        className="btn-copy"
                        onClick={() => handleCopy(String(vlanConfig.tv), "vlan-tv")}
                      >
                        {copiedField === "vlan-tv" ? "✓" : "📋"}
                      </button>
                    </div>
                    <div className="vlan-row">
                      <span className="vlan-service">
                        <span className="service-icon">📞</span>
                        VoIP
                      </span>
                      <span className="mono vlan-id">{vlanConfig.voip}</span>
                      <span className="mono vlan-cos">{vlanConfig.cosVoip}</span>
                      <button
                        className="btn-copy"
                        onClick={() => handleCopy(String(vlanConfig.voip), "vlan-voip")}
                      >
                        {copiedField === "vlan-voip" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>

                  <div className="vlan-help">
                    <h5>{t("modemPerso.vlan.help.title")}</h5>
                    <ul>
                      <li><strong>VLAN ID:</strong> {t("modemPerso.vlan.help.vlanId")}</li>
                      <li><strong>CoS (Class of Service):</strong> {t("modemPerso.vlan.help.cos")}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guides Tab */}
        {activeSubTab === "guides" && (
          <div className="modem-perso-guides">
            <div className="guides-header">
              <h4>📚 {t("modemPerso.guides.title")}</h4>
              <p>{t("modemPerso.guides.description")}</p>
            </div>
            <div className="guides-grid">
              {guides.map((guide, i) => (
                <a
                  key={i}
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="guide-card"
                >
                  <div className="guide-icon">📖</div>
                  <div className="guide-info">
                    <span className="guide-brand">{guide.brand}</span>
                    <span className="guide-model">{guide.model}</span>
                  </div>
                  <span className="guide-arrow">→</span>
                </a>
              ))}
            </div>
            <div className="guides-footer">
              <div className="footer-card">
                <span className="footer-icon">❓</span>
                <div className="footer-content">
                  <p>{t("modemPerso.guides.notListed")}</p>
                  <a
                    href="https://docs.ovh.com/xdsl/custom-modem"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-link"
                  >
                    {t("modemPerso.guides.genericGuide")} →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
