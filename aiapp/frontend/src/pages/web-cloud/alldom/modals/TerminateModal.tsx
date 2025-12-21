// ============================================================
// MODAL: Terminate AllDom - Résiliation avec sélection domaines
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AllDomDomain } from "../../../../services/web-cloud.alldom";

interface Props {
  serviceName: string;
  domains: AllDomDomain[];
  onConfirm: (selectedDomains: string[]) => Promise<void>;
  onClose: () => void;
}

/** Modal de résiliation d'un pack AllDom avec sélection des domaines à résilier. */
export function TerminateModal({ serviceName, domains, onConfirm, onClose }: Props) {
  const { t } = useTranslation("web-cloud/alldom/index");

  // ---------- STATE ----------
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // ---------- FILTERED DOMAINS ----------
  const registeredDomains = useMemo(
    () => domains.filter((d) => d.registrationStatus === "REGISTERED"),
    [domains]
  );

  // ---------- HANDLERS ----------
  const toggleDomain = (name: string) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedDomains.size === registeredDomains.length) {
      setSelectedDomains(new Set());
    } else {
      setSelectedDomains(new Set(registeredDomains.map((d) => d.name)));
    }
  };

  const handleConfirm = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    try {
      setLoading(true);
      await onConfirm(Array.from(selectedDomains));
      onClose();
    } catch (err) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  const isAllSelected = selectedDomains.size === registeredDomains.length;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("terminate.title", { serviceName })}</h2>
          <p>{t("terminate.subtitle")}</p>
        </div>

        <div className="modal-body">
          {step === 1 ? (
            <>
              <div className="warning-banner" style={{ marginBottom: "var(--space-4)" }}>
                <span>{t("terminate.warning")}</span>
              </div>

              <p style={{ marginBottom: "var(--space-3)", fontWeight: 500 }}>{t("terminate.selectDomains")}</p>

              <div className="select-all-row">
                <input type="checkbox" id="select-all" checked={isAllSelected} onChange={toggleAll} />
                <label htmlFor="select-all">{t("terminate.selectAll")}</label>
              </div>

              <div className="checkbox-list">
                {registeredDomains.map((domain) => (
                  <div key={domain.name} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={domain.name}
                      checked={selectedDomains.has(domain.name)}
                      onChange={() => toggleDomain(domain.name)}
                    />
                    <label htmlFor={domain.name}>{domain.name}</label>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="warning-banner" style={{ marginBottom: "var(--space-4)", background: "var(--color-error-100)", borderColor: "var(--color-error-300)", color: "var(--color-error-700)" }}>
                <span>{t("terminate.confirmWarning")}</span>
              </div>

              {selectedDomains.size > 0 ? (
                <>
                  <p style={{ marginBottom: "var(--space-3)", fontWeight: 500 }}>{t("terminate.domainsToTerminate")}</p>
                  <ul style={{ margin: 0, paddingLeft: "var(--space-5)" }}>
                    {Array.from(selectedDomains).map((name) => (
                      <li key={name} style={{ fontFamily: "var(--font-family-mono)", fontSize: "var(--font-size-sm)" }}>{name}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{t("terminate.noDomainsSelected", { serviceName })}</p>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          {step === 2 && (
            <button className="btn-secondary" onClick={() => setStep(1)} disabled={loading}>
              {t("terminate.back")}
            </button>
          )}
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            {t("terminate.cancel")}
          </button>
          <button className="btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? "..." : step === 1 ? t("terminate.next") : t("terminate.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
