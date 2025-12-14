import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDateMonth } from "../utils";
import { ExternalIcon, CardIcon, VisaIcon, MastercardIcon, AmexIcon, BankIcon, PaypalIcon } from "../icons";

export function MethodsTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  const [methods, setMethods] = useState<billingService.PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadMethods(); }, []);

  const loadMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getPaymentMethods(credentials);
      setMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, isDefault: boolean) => {
    if (isDefault) return <span className="status-badge badge-primary">{t('methods.default')}</span>;
    switch (status) {
      case "VALID": return <span className="status-badge badge-success">{t('methods.status.active')}</span>;
      case "EXPIRED": return <span className="status-badge badge-error">{t('methods.status.expired')}</span>;
      case "PENDING": return <span className="status-badge badge-warning">{t('methods.status.pending')}</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const getPaymentIcon = (type: string, subType?: string) => {
    const typ = (subType || type || "").toLowerCase();
    if (typ.includes("visa")) return <VisaIcon />;
    if (typ.includes("mastercard") || typ.includes("mc")) return <MastercardIcon />;
    if (typ.includes("amex") || typ.includes("american")) return <AmexIcon />;
    if (typ.includes("sepa") || typ.includes("bank") || typ.includes("prelevement")) return <BankIcon />;
    if (typ.includes("paypal")) return <PaypalIcon />;
    return <CardIcon />;
  };

  const getPaymentTypeName = (type: string, subType?: string) => {
    const typ = (subType || type || "").toLowerCase();
    if (typ.includes("visa")) return "Visa";
    if (typ.includes("mastercard") || typ.includes("mc")) return "Mastercard";
    if (typ.includes("amex") || typ.includes("american")) return "American Express";
    if (typ.includes("sepa") || typ.includes("prelevement")) return t('methods.types.sepa');
    if (typ.includes("bank")) return t('methods.types.bankTransfer');
    if (typ.includes("paypal")) return "PayPal";
    if (typ.includes("credit") || typ.includes("card")) return t('methods.types.creditCard');
    return type || t('methods.types.other');
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadMethods} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;

  return (
    <div className="tab-panel">
      <div className="section-description" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--color-background-subtle, #f8f9fa)", borderRadius: "8px" }}>
        <p style={{ margin: 0, color: "var(--color-text-secondary, #6c757d)" }}>{t('methods.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('methods.count', { count: methods.length })}</span>
        <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">{t('methods.addButton')}</a>
      </div>
      {methods.length === 0 ? (
        <div className="empty-state">
          <CardIcon />
          <h3>{t('methods.empty.title')}</h3>
          <p>{t('methods.empty.description')}</p>
          <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: "1rem" }}>{t('methods.addButton')}</a>
        </div>
      ) : (
        <div className="methods-grid">
          {methods.map((m) => (
            <div key={m.paymentMethodId} className={`method-card ${m.default ? "default" : ""}`}>
              <div className="method-icon-wrapper">{getPaymentIcon(m.paymentType, m.paymentSubType)}</div>
              <div className="method-content">
                <div className="method-header">
                  <h4 className="method-name">{getPaymentTypeName(m.paymentType, m.paymentSubType)}</h4>
                  <div className="method-badges">
                    {m.default && <span className="status-badge badge-primary">{t('methods.default')}</span>}
                    {getStatusBadge(m.status, false)}
                  </div>
                </div>
                <div className="method-details">
                  {m.label && <p className="method-label">{m.label}</p>}
                  {m.description && <p className="method-description">{m.description}</p>}
                </div>
                <div className="method-meta">
                  {m.expirationDate && formatDateMonth(m.expirationDate) && (
                    <span className="method-expiry">{new Date(m.expirationDate) < new Date() ? t('methods.expired') : t('methods.expires')} : {formatDateMonth(m.expirationDate)}</span>
                  )}
                  {m.creationDate && <span className="method-created">{t('methods.addedOn')} {new Date(m.creationDate).toLocaleDateString("fr-FR")}</span>}
                </div>
              </div>
              <div className="method-actions">
                <a href={`https://www.ovh.com/manager/#/dedicated/billing/payment/method/${m.paymentMethodId}`} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.manage')}><ExternalIcon /></a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
