// ============================================================
// MODAL: Batch Lock - Verrouillage transfert en masse
// Ref: target_.web-cloud.domain.modal-batch-lock.svg
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { alldomService } from "./alldom/AlldomTab.service";

interface DomainLockStatus {
  domain: string;
  locked: boolean;
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

export function BatchLockModal({ domains, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [action, setAction] = useState<"lock" | "unlock">("lock");
  const [statuses, setStatuses] = useState<DomainLockStatus[]>([]);
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
              const status = await alldomService.getLockStatus(domain);
              return { domain, locked: status.locked, supported: status.supported };
            } catch {
              return { domain, locked: false, supported: false };
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
      await alldomService.batchLock(domainsToProcess, action);
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
          <h3>{t("batch.lockTitle")}</h3>
          <button className="alldom-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="alldom-modal-body">
          <div className="batch-info-banner">
            <p>{t("batch.lockDescription")}</p>
          </div>
          <div className="batch-action-selector">
            <label className={action === "lock" ? "active" : ""}>
              <input type="radio" name="action" value="lock" checked={action === "lock"} onChange={() => setAction("lock")} />
              {t("batch.actionLock")}
            </label>
            <label className={action === "unlock" ? "active" : ""}>
              <input type="radio" name="action" value="unlock" checked={action === "unlock"} onChange={() => setAction("unlock")} />
              {t("batch.actionUnlock")}
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
                      ) : status.locked ? (
                        <span className="batch-badge success">{t("batch.locked")}</span>
                      ) : (
                        <span className="batch-badge warning">{t("batch.unlocked")}</span>
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

export default BatchLockModal;
