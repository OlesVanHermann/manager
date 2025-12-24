// ============================================================
import "./DnsServersTab.css";
// TAB: DNS SERVERS - Affichage et modification des serveurs DNS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dnsServersService } from "./DnsServersTab";
import type { DnsServer, DnsServerInput } from "../../domains.types";

interface Props {
  domain: string;
}

interface ServerFormItem {
  host: string;
  ip: string;
}

// ============ ICONS ============

const ServerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

/** Onglet serveurs DNS avec modification. */
export function DnsServersTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [servers, setServers] = useState<DnsServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- MODAL STATE ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [formServers, setFormServers] = useState<ServerFormItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ---------- LOAD DATA ----------
  const loadServers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await dnsServersService.listDnsServers(domain);
      if (ids.length === 0) {
        setServers([]);
        return;
      }
      const details = await Promise.all(ids.map((id) => dnsServersService.getDnsServer(domain, id)));
      setServers(details);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadServers();
  }, [loadServers]);

  // ---------- MODAL HANDLERS ----------
  const openEditModal = () => {
    // Initialize form with current servers
    const initialServers = servers.map((s) => ({
      host: s.host,
      ip: s.ip || '',
    }));
    // Ensure at least 2 servers (minimum for DNS)
    while (initialServers.length < 2) {
      initialServers.push({ host: '', ip: '' });
    }
    setFormServers(initialServers);
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError(null);
  };

  const handleServerChange = (index: number, field: 'host' | 'ip', value: string) => {
    setFormServers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setFormError(null);
  };

  const addServerRow = () => {
    if (formServers.length >= 6) return; // Max 6 servers
    setFormServers((prev) => [...prev, { host: '', ip: '' }]);
  };

  const removeServerRow = (index: number) => {
    if (formServers.length <= 2) return; // Min 2 servers
    setFormServers((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    // Validate: at least 2 non-empty hosts
    const validServers = formServers.filter((s) => s.host.trim());
    if (validServers.length < 2) {
      setFormError(t("dnsServers.errorMinServers"));
      return;
    }

    // Validate hostname format
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    for (const server of validServers) {
      if (!hostnameRegex.test(server.host)) {
        setFormError(t("dnsServers.errorInvalidHostname", { host: server.host }));
        return;
      }
    }

    try {
      setSaving(true);
      setFormError(null);

      const nameServers: DnsServerInput[] = validServers.map((s) => ({
        host: s.host.trim(),
        ip: s.ip.trim() || undefined,
      }));

      await dnsServersService.updateDnsServers(domain, nameServers);
      closeModal();
      // Reload after a short delay (task is async)
      setTimeout(() => loadServers(), 2000);
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="dns-servers-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("dnsServers.title")}</h3>
          <p className="tab-description">{t("dnsServers.description")}</p>
        </div>
        <div className="tab-header-actions">
          <button className="btn-secondary" onClick={openEditModal}>
            <EditIcon /> {t("dnsServers.modify")}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-banner">{error}</div>}

      {/* Empty state */}
      {servers.length === 0 && !error ? (
        <div className="empty-state">
          <ServerIcon />
          <h3>{t("dnsServers.empty")}</h3>
        </div>
      ) : (
        /* Cards list */
        <div className="dns-server-cards">
          {servers.map((server) => (
            <div key={server.id} className="dns-server-card">
              <div className="dns-server-icon">
                <ServerIcon />
              </div>
              <div className="dns-server-info">
                <h4>{server.host}</h4>
                {server.ip && <p>IP: {server.ip}</p>}
                {!server.isUsed && <span className="badge badge-warning">{t("dnsServers.notUsed")}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="info-box">
        <h4>{t("dnsServers.info")}</h4>
        <p>{t("dnsServers.infoDesc")}</p>
      </div>

      {/* Modal Edit */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t("dnsServers.modalTitle")}</h3>
              <button className="btn-icon" onClick={closeModal}><CloseIcon /></button>
            </div>
            <div className="modal-body">
              {/* Warning */}
              <div className="warning-box">
                <WarningIcon />
                <p>{t("dnsServers.warning")}</p>
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="dns-servers-form">
                <div className="form-header-row">
                  <span className="col-number">#</span>
                  <span className="col-host">{t("dnsServers.hostname")} *</span>
                  <span className="col-ip">{t("dnsServers.ip")} ({t("dnsServers.optional")})</span>
                  <span className="col-action"></span>
                </div>
                {formServers.map((server, index) => (
                  <div key={index} className="form-server-row">
                    <span className="col-number">{index + 1}</span>
                    <input
                      type="text"
                      value={server.host}
                      onChange={(e) => handleServerChange(index, 'host', e.target.value)}
                      placeholder="ns1.example.com"
                      className="form-input col-host"
                    />
                    <input
                      type="text"
                      value={server.ip}
                      onChange={(e) => handleServerChange(index, 'ip', e.target.value)}
                      placeholder="192.0.2.1"
                      className="form-input col-ip"
                    />
                    <button
                      type="button"
                      className="btn-icon btn-icon-danger col-action"
                      onClick={() => removeServerRow(index)}
                      disabled={formServers.length <= 2}
                      title={t("dnsServers.removeServer")}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
                {formServers.length < 6 && (
                  <button type="button" className="btn-link" onClick={addServerRow}>
                    <PlusIcon /> {t("dnsServers.addServer")}
                  </button>
                )}
              </div>

              <div className="info-box info-box-small">
                <p>{t("dnsServers.formHint")}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>{tCommon("actions.cancel")}</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? tCommon("loading") : tCommon("actions.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DnsServersTab;
