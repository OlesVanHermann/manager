// ============================================================
// MODAL: Batch Renew - Renouveler domaines en masse
// Ref: target_.web-cloud.domain.modal-batch-renew.svg
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { alldomService } from "./alldom/AlldomTab.service";

interface DomainRenewInfo {
  domain: string;
  expiration: string;
  price: string;
  renewable: boolean;
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

export function BatchRenewModal({ domains, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [renewInfos, setRenewInfos] = useState<DomainRenewInfo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(domains));
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRenewInfos = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          domains.map(async (domain) => {
            try {
              const info = await alldomService.getRenewInfo(domain);
              return { domain, expiration: info.expiration, price: info.price, renewable: info.renewable };
            } catch {
              return { domain, expiration: "-", price: "-", renewable: false };
            }
          })
        );
        setRenewInfos(results);
      } finally {
        setLoading(false);
      }
    };
    loadRenewInfos();
  }, [domains]);

  const toggleSelect = (domain: string) => {
    const info = renewInfos.find((i) => i.domain === domain);
    if (!info?.renewable) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  };

  const renewableDomains = renewInfos.filter((i) => i.renewable && selected.has(i.domain));
  const totalPrice = renewableDomains.reduce((sum, d) => {
    const price = parseFloat(d.price.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    return sum + price * duration;
  }, 0);

  const handleApply = async () => {
    if (renewableDomains.length === 0) return;
    try {
      setSaving(true);
      setError(null);
      const domainsToRenew = renewableDomains.map((d) => d.domain);
      await alldomService.batchRenew(domainsToRenew, duration);
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
          <h3>{t("batch.renewTitle")}</h3>
          <button className="alldom-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="alldom-modal-body">
          <div className="batch-info-banner">
            <p>{t("batch.renewDescription")}</p>
          </div>
          <div className="batch-duration-selector">
            <label>{t("batch.renewDuration")}</label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="batch-select">
              <option value={1}>1 {t("batch.year")}</option>
              <option value={2}>2 {t("batch.years")}</option>
              <option value={3}>3 {t("batch.years")}</option>
              <option value={5}>5 {t("batch.years")}</option>
              <option value={10}>10 {t("batch.years")}</option>
            </select>
          </div>
          {loading ? (
            <div className="batch-loading">{tCommon("loading")}</div>
          ) : (
            <table className="batch-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>{t("batch.domain")}</th>
                  <th>{t("batch.expiration")}</th>
                  <th>{t("batch.price")}</th>
                </tr>
              </thead>
              <tbody>
                {renewInfos.map((info) => (
                  <tr key={info.domain} className={!info.renewable ? "disabled" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(info.domain)}
                        onChange={() => toggleSelect(info.domain)}
                        disabled={!info.renewable}
                      />
                    </td>
                    <td>{info.domain}</td>
                    <td>{info.expiration}</td>
                    <td>{info.renewable ? info.price : <span className="batch-badge muted">{t("batch.notRenewable")}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="batch-total-row">
            <span>{t("batch.total")}</span>
            <strong>{totalPrice.toFixed(2)} € HT</strong>
          </div>
          {error && <div className="alldom-form-error">{error}</div>}
        </div>
        <div className="alldom-modal-footer">
          <button className="alldom-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="alldom-btn-primary" onClick={handleApply} disabled={saving || renewableDomains.length === 0}>
            {saving ? tCommon("loading") : t("batch.renew", { count: renewableDomains.length })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatchRenewModal;
