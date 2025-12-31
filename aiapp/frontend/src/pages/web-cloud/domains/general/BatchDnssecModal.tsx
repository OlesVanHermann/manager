// ============================================================
// MODAL: Batch DNSSEC - Activer/Désactiver DNSSEC en masse
// Ref: target_.web-cloud.domain.modal-batch-dnssec.svg
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { alldomService } from "./alldom/AlldomTab.service";

interface DomainDnssecStatus {
  domain: string;
  enabled: boolean;
  supported: boolean;
}

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

export function BatchDnssecModal({ domains, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [action, setAction] = useState<"enable" | "disable">("enable");
  const [statuses, setStatuses] = useState<DomainDnssecStatus[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(domains));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          domains.map(async (domain) => {
            try {
              const status = await alldomService.getDnssecStatus(domain);
              return { domain, enabled: status.enabled, supported: status.supported };
            } catch {
              return { domain, enabled: false, supported: false };
            }
          })
        );
        setStatuses(results);
      } finally {
        setLoading(false);
      }
    };
    loadStatuses();
  }, [domains]);

  const toggleSelect = (domain: string) => {
    const status = statuses.find((s) => s.domain === domain);
    if (!status?.supported) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  };

  const supportedDomains = statuses.filter((s) => s.supported && selected.has(s.domain));
  const unsupportedCount = statuses.filter((s) => !s.supported).length;

  const handleApply = async () => {
    if (supportedDomains.length === 0) return;
    try {
      setSaving(true);
      setError(null);
      const domainsToProcess = supportedDomains.map((s) => s.domain);
      await alldomService.batchDnssec(domainsToProcess, action);
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
          <h3>{t("batch.dnssecTitle")}</h3>
          <button className="alldom-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="alldom-modal-body">
          <div className="batch-info-banner">
            <p>{t("batch.dnssecDescription")}</p>
          </div>
          <div className="batch-action-selector">
            <label className={action === "enable" ? "active" : ""}>
              <input type="radio" name="action" value="enable" checked={action === "enable"} onChange={() => setAction("enable")} />
              {t("batch.actionEnable")}
            </label>
            <label className={action === "disable" ? "active" : ""}>
              <input type="radio" name="action" value="disable" checked={action === "disable"} onChange={() => setAction("disable")} />
              {t("batch.actionDisable")}
            </label>
          </div>
          {loading ? (
            <div className="batch-loading">{tCommon("loading")}</div>
          ) : (
            <table className="batch-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>{t("batch.domain")}</th>
                  <th>{t("batch.currentStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((status) => (
                  <tr key={status.domain} className={!status.supported ? "disabled" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(status.domain)}
                        onChange={() => toggleSelect(status.domain)}
                        disabled={!status.supported}
                      />
                    </td>
                    <td>{status.domain}</td>
                    <td>
                      {!status.supported ? (
                        <span className="batch-badge muted">{t("batch.notSupported")}</span>
                      ) : status.enabled ? (
                        <span className="batch-badge success">{t("batch.enabled")}</span>
                      ) : (
                        <span className="batch-badge warning">{t("batch.disabled")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {unsupportedCount > 0 && (
            <div className="batch-warning-banner">
              {t("batch.unsupportedWarning", { count: unsupportedCount })}
            </div>
          )}
          {error && <div className="alldom-form-error">{error}</div>}
        </div>
        <div className="alldom-modal-footer">
          <button className="alldom-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="alldom-btn-primary" onClick={handleApply} disabled={saving || supportedDomains.length === 0}>
            {saving ? tCommon("loading") : t("batch.apply", { count: supportedDomains.length })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatchDnssecModal;
