// ============================================================
// MODAL: DnsChangeModal - Modifier les serveurs DNS
// Basé sur target SVG modal-dns-change.svg
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dnsServersService } from "./dnsservers/DnsServersTab.service";

interface Props {
  domain: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface NameServer {
  id?: number;
  host: string;
  ip?: string;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ COMPOSANT ============

export function DnsChangeModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dnsservers");
  const [mode, setMode] = useState<"ovh" | "custom">("ovh");
  const [servers, setServers] = useState<NameServer[]>([]);
  const [customServers, setCustomServers] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OVH default DNS servers
  const ovhServers = [
    "dns101.ovh.net",
    "ns101.ovh.net",
  ];

  useEffect(() => {
    const loadServers = async () => {
      try {
        const data = await dnsServersService.getNameServers(domain);
        setServers(data);
        // Detect if using OVH or custom
        const isOvh = data.every((s: NameServer) => s.host.includes("ovh.net"));
        setMode(isOvh ? "ovh" : "custom");
        if (!isOvh) {
          setCustomServers(data.map((s: NameServer) => s.host));
        }
      } catch {
        setServers([]);
      } finally {
        setLoading(false);
      }
    };
    loadServers();
  }, [domain]);

  const addCustomServer = () => {
    if (customServers.length < 5) {
      setCustomServers([...customServers, ""]);
    }
  };

  const removeCustomServer = (index: number) => {
    if (customServers.length > 2) {
      setCustomServers(customServers.filter((_, i) => i !== index));
    }
  };

  const updateCustomServer = (index: number, value: string) => {
    const updated = [...customServers];
    updated[index] = value;
    setCustomServers(updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const newServers = mode === "ovh" ? ovhServers : customServers.filter((s) => s.trim());
      await dnsServersService.updateNameServers(domain, newServers);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal dom-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.change.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{domain}</div>

          {/* Warning banner */}
          <div className="dom-modal-warning-banner">
            <WarningIcon />
            <span>{t("modals.change.propagationWarning")}</span>
          </div>

          {loading ? (
            <div className="dom-modal-loading">{t("common.loading")}</div>
          ) : (
            <>
              {/* Mode selection */}
              <div className="dom-modal-options">
                <div
                  className={`dom-modal-option ${mode === "ovh" ? "selected" : ""}`}
                  onClick={() => setMode("ovh")}
                >
                  <input type="radio" checked={mode === "ovh"} onChange={() => setMode("ovh")} />
                  <div className="dom-modal-option-content">
                    <strong>{t("modals.change.modeOvh")}</strong>
                    <span>{t("modals.change.modeOvhDesc")}</span>
                  </div>
                </div>

                <div
                  className={`dom-modal-option ${mode === "custom" ? "selected" : ""}`}
                  onClick={() => setMode("custom")}
                >
                  <input type="radio" checked={mode === "custom"} onChange={() => setMode("custom")} />
                  <div className="dom-modal-option-content">
                    <strong>{t("modals.change.modeCustom")}</strong>
                    <span>{t("modals.change.modeCustomDesc")}</span>
                  </div>
                </div>
              </div>

              {/* OVH servers list */}
              {mode === "ovh" && (
                <div className="dom-modal-servers-list">
                  <label>{t("modals.change.ovhServers")}</label>
                  {ovhServers.map((server, i) => (
                    <div key={i} className="dom-modal-server-item">
                      <span>{server}</span>
                    </div>
                  ))}
                  <div className="dom-modal-info-banner">
                    {t("modals.change.ovhOptimized")}
                  </div>
                </div>
              )}

              {/* Custom servers inputs */}
              {mode === "custom" && (
                <div className="dom-modal-servers-list">
                  <label>{t("modals.change.customServers")}</label>
                  {customServers.map((server, i) => (
                    <div key={i} className="dom-modal-server-input">
                      <input
                        type="text"
                        value={server}
                        onChange={(e) => updateCustomServer(i, e.target.value)}
                        placeholder={`ns${i + 1}.example.com`}
                      />
                      {customServers.length > 2 && (
                        <button className="dom-btn-icon" onClick={() => removeCustomServer(i)}>
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  ))}
                  {customServers.length < 5 && (
                    <button className="dom-btn-secondary dom-btn-sm" onClick={addCustomServer}>
                      <PlusIcon /> {t("modals.change.addServer")}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={saving}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={saving || loading}>
            {saving ? "..." : t("actions.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DnsChangeModal;
