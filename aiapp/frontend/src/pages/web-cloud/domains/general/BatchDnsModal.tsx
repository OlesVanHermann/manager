// ============================================================
// MODAL: Batch DNS - Modifier serveurs DNS en masse
// Ref: target_.web-cloud.domain.modal-batch-dns.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { alldomService } from "./alldom/AlldomTab.service";

interface Props {
  domains: string[];
  onClose: () => void;
  onSuccess?: () => void;
}

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

interface DnsServer {
  host: string;
  ip: string;
}

export function BatchDnsModal({ domains, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [servers, setServers] = useState<DnsServer[]>([
    { host: "", ip: "" },
    { host: "", ip: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleServerChange = (index: number, field: keyof DnsServer, value: string) => {
    setServers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addServer = () => {
    if (servers.length >= 6) return;
    setServers((prev) => [...prev, { host: "", ip: "" }]);
  };

  const removeServer = (index: number) => {
    if (servers.length <= 2) return;
    setServers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = async () => {
    const validServers = servers.filter((s) => s.host.trim());
    if (validServers.length < 2) {
      setError(t("batch.dnsMinServers"));
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await alldomService.batchDns(domains, validServers);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="alldom-modal-overlay" onClick={onClose}>
      <div className="alldom-modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="alldom-modal-header">
          <h3>{t("batch.dnsTitle")}</h3>
          <button className="alldom-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="alldom-modal-body">
          <div className="batch-info-banner">
            <p>{t("batch.dnsDescription")}</p>
          </div>
          <div className="batch-domains-summary">
            <strong>{domains.length}</strong> {t("batch.domainsSelected")}
          </div>
          <div className="batch-dns-form">
            <div className="batch-dns-header">
              <span className="col-number">#</span>
              <span className="col-host">{t("batch.dnsHostname")} *</span>
              <span className="col-ip">{t("batch.dnsIp")}</span>
              <span className="col-action"></span>
            </div>
            {servers.map((server, index) => (
              <div key={index} className="batch-dns-row">
                <span className="col-number">{index + 1}</span>
                <input
                  type="text"
                  value={server.host}
                  onChange={(e) => handleServerChange(index, "host", e.target.value)}
                  placeholder="ns1.example.com"
                  className="batch-input col-host"
                />
                <input
                  type="text"
                  value={server.ip}
                  onChange={(e) => handleServerChange(index, "ip", e.target.value)}
                  placeholder="192.0.2.1"
                  className="batch-input col-ip"
                />
                <button
                  className="alldom-btn-icon danger col-action"
                  onClick={() => removeServer(index)}
                  disabled={servers.length <= 2}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
            {servers.length < 6 && (
              <button className="batch-btn-link" onClick={addServer}>
                <PlusIcon /> {t("batch.addServer")}
              </button>
            )}
          </div>
          {error && <div className="alldom-form-error">{error}</div>}
        </div>
        <div className="alldom-modal-footer">
          <button className="alldom-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="alldom-btn-primary" onClick={handleApply} disabled={saving}>
            {saving ? tCommon("loading") : t("batch.apply", { count: domains.length })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatchDnsModal;
