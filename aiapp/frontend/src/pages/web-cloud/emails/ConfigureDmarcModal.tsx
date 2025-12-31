// ============================================================
// MODAL - Configure DMARC (Configuration DMARC)
// ============================================================

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ConfigureDmarcModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  currentConfig?: DmarcConfig;
  onSubmit: (config: DmarcConfig) => Promise<void>;
}

interface DmarcConfig {
  policy: "none" | "quarantine" | "reject";
  percentage: number;
  ruaEmail?: string;
  rufEmail?: string;
}

type DmarcPolicy = "none" | "quarantine" | "reject";

/** Modal de configuration DMARC pour un domaine email. */
export function ConfigureDmarcModal({
  isOpen,
  onClose,
  domain,
  currentConfig,
  onSubmit,
}: ConfigureDmarcModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [policy, setPolicy] = useState<DmarcPolicy>(currentConfig?.policy || "none");
  const [percentage, setPercentage] = useState(currentConfig?.percentage || 100);
  const [ruaEmail, setRuaEmail] = useState(currentConfig?.ruaEmail || "");
  const [rufEmail, setRufEmail] = useState(currentConfig?.rufEmail || "");

  // Reset on open with current config
  useEffect(() => {
    if (isOpen && currentConfig) {
      setPolicy(currentConfig.policy);
      setPercentage(currentConfig.percentage);
      setRuaEmail(currentConfig.ruaEmail || "");
      setRufEmail(currentConfig.rufEmail || "");
    }
  }, [isOpen, currentConfig]);

  // ---------- COMPUTED ----------

  const dnsRecord = useMemo(() => {
    let record = `v=DMARC1; p=${policy}; pct=${percentage}`;
    if (ruaEmail) record += `; rua=mailto:${ruaEmail}`;
    if (rufEmail) record += `; ruf=mailto:${rufEmail}`;
    return record;
  }, [policy, percentage, ruaEmail, rufEmail]);

  const policies: { value: DmarcPolicy; icon: string }[] = [
    { value: "none", icon: "👁" },
    { value: "quarantine", icon: "📁" },
    { value: "reject", icon: "🚫" },
  ];

  // ---------- HANDLERS ----------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (ruaEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ruaEmail)) {
      setError(t("configureDmarc.errors.ruaInvalid"));
      return;
    }

    if (rufEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rufEmail)) {
      setError(t("configureDmarc.errors.rufInvalid"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        policy,
        percentage,
        ruaEmail: ruaEmail || undefined,
        rufEmail: rufEmail || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("configureDmarc.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPolicy("none");
    setPercentage(100);
    setRuaEmail("");
    setRufEmail("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("configureDmarc.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="modal-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            {/* Domain */}
            <div className="domain-badge">
              <span className="domain-icon">🌐</span>
              <span className="domain-name">{domain}</span>
            </div>

            {/* Policy selection */}
            <div className="form-group">
              <label className="form-label">{t("configureDmarc.fields.policy")}</label>
              <div className="policy-options">
                {policies.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`policy-option ${policy === p.value ? "selected" : ""}`}
                    onClick={() => setPolicy(p.value)}
                    disabled={loading}
                  >
                    <span className="policy-icon">{p.icon}</span>
                    <span className="policy-title">{t(`configureDmarc.policies.${p.value}.title`)}</span>
                    <span className="policy-desc">{t(`configureDmarc.policies.${p.value}.desc`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Percentage */}
            <div className="form-group">
              <label className="form-label">{t("configureDmarc.fields.percentage")}</label>
              <div className="percentage-input">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  disabled={loading}
                />
                <span className="percentage-value">{percentage}%</span>
              </div>
              <span className="form-hint">{t("configureDmarc.hints.percentage")}</span>
            </div>

            {/* RUA Email */}
            <div className="form-group">
              <label className="form-label">{t("configureDmarc.fields.ruaEmail")}</label>
              <input
                type="email"
                className="form-input"
                value={ruaEmail}
                onChange={(e) => setRuaEmail(e.target.value)}
                placeholder={t("configureDmarc.placeholders.ruaEmail")}
                disabled={loading}
              />
              <span className="form-hint">{t("configureDmarc.hints.ruaEmail")}</span>
            </div>

            {/* RUF Email */}
            <div className="form-group">
              <label className="form-label">{t("configureDmarc.fields.rufEmail")}</label>
              <input
                type="email"
                className="form-input"
                value={rufEmail}
                onChange={(e) => setRufEmail(e.target.value)}
                placeholder={t("configureDmarc.placeholders.rufEmail")}
                disabled={loading}
              />
              <span className="form-hint">{t("configureDmarc.hints.rufEmail")}</span>
            </div>

            {/* DNS Preview */}
            <div className="dns-preview">
              <label className="form-label">{t("configureDmarc.preview.title")}</label>
              <div className="dns-record-box">
                <div className="dns-host">_dmarc.{domain}</div>
                <div className="dns-type">TXT</div>
                <div className="dns-value">{dnsRecord}</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations">
              <label className="form-label">{t("configureDmarc.recommendations.title")}</label>
              <ol className="recommendations-list">
                <li>{t("configureDmarc.recommendations.step1")}</li>
                <li>{t("configureDmarc.recommendations.step2")}</li>
                <li>{t("configureDmarc.recommendations.step3")}</li>
                <li>{t("configureDmarc.recommendations.step4")}</li>
              </ol>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.saving") : t("configureDmarc.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
