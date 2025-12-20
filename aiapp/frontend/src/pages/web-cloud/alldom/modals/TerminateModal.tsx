// ============================================================
// MODAL: TerminateModal - Résiliation du pack AllDom
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AllDomDomain, allDomService } from "../../../../services/web-cloud.alldom";

interface Props {
  serviceName: string;
  serviceId: number;
  domains: AllDomDomain[];
  onClose: () => void;
  onSuccess: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export function TerminateModal({ serviceName, serviceId, domains, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/alldom/index");
  const { t: tCommon } = useTranslation("common");

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registeredDomains = domains.filter(d => d.registrationStatus === "REGISTERED");

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedDomains(checked ? registeredDomains.map(d => d.name) : []);
  };

  const handleSelectDomain = (domain: string, checked: boolean) => {
    if (checked) {
      setSelectedDomains([...selectedDomains, domain]);
    } else {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
      setSelectAll(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await allDomService.updateTermination(serviceId, "terminateAtExpirationDate");
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("terminate.title", { serviceName })}</h3>
          <button className="btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <p className="modal-subtitle">{t("terminate.subtitle")}</p>

          {step === 1 ? (
            <>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <span>{t("terminate.selectAll")}</span>
                </label>
              </div>

              <p className="form-label">{t("terminate.selectDomains")}</p>

              <div className="domains-checkbox-list">
                {registeredDomains.map((domain) => (
                  <label key={domain.name} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes(domain.name)}
                      onChange={(e) => handleSelectDomain(domain.name, e.target.checked)}
                    />
                    <span className="font-mono">{domain.name}</span>
                  </label>
                ))}
              </div>

              <div className="info-box info-box-warning">
                <p>{t("terminate.keepDomainsInfo")}</p>
              </div>
            </>
          ) : (
            <>
              <div className="warning-box">
                <strong>⚠️ {t("terminate.warningTitle")}</strong>
              </div>

              {selectedDomains.length > 0 ? (
                <div className="terminate-summary">
                  <p>{t("terminate.willTerminate")}</p>
                  <ul>
                    {selectedDomains.map((d) => (
                      <li key={d} className="font-mono">{d}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>{t("terminate.noDomainsSelected", { serviceName })}</p>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          {step === 1 ? (
            <>
              <button className="btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
              <button className="btn-danger" onClick={() => setStep(2)}>{t("terminate.next")}</button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setStep(1)}>{t("terminate.back")}</button>
              <button className="btn-danger" onClick={handleConfirm} disabled={loading}>
                {loading ? tCommon("loading") : t("terminate.confirm")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
