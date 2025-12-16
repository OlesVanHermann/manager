// ============================================================
// METHODS TAB - Moyens de paiement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/home.billing";
import { TabProps, formatDateMonth } from "../utils";
import { CardIcon, VisaIcon, MastercardIcon, AmexIcon, BankIcon, PaypalIcon, TrashIcon, StarIcon } from "../icons";

// ============ TYPES ============

interface ModalState {
  type: "add" | "delete" | "setDefault" | null;
  method: billingService.PaymentMethod | null;
}

// ============ COMPOSANT ============

/** Affiche et gère les moyens de paiement du compte. */
export function MethodsTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [methods, setMethods] = useState<billingService.PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: null, method: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [addType, setAddType] = useState("CREDIT_CARD");

  // ---------- EFFECTS ----------
  useEffect(() => { loadMethods(); }, []);

  // ---------- LOADERS ----------
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

  // ---------- ACTIONS ----------
  const handleDelete = async () => {
    if (!modal.method) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await billingService.deletePaymentMethod(modal.method.paymentMethodId);
      closeModal();
      await loadMethods();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('errors.deleteError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetDefault = async () => {
    if (!modal.method) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await billingService.setDefaultPaymentMethod(modal.method.paymentMethodId);
      closeModal();
      await loadMethods();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('errors.setDefaultError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddMethod = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const callbackUrl = window.location.href;
      const result = await billingService.createPaymentMethod({
        paymentType: addType,
        callbackUrl,
        default: methods.length === 0,
      });
      if (result.validationUrl) {
        window.location.href = result.validationUrl;
      } else {
        closeModal();
        await loadMethods();
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('errors.addError'));
      setActionLoading(false);
    }
  };

  const openModal = (type: "add" | "delete" | "setDefault", method?: billingService.PaymentMethod) => {
    setModal({ type, method: method || null });
    setActionError(null);
  };

  const closeModal = () => {
    if (!actionLoading) {
      setModal({ type: null, method: null });
      setActionError(null);
    }
  };

  // ---------- HELPERS ----------
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

  const getAddTypeLabel = (type: string) => {
    switch (type) {
      case "CREDIT_CARD": return t('methods.addTypes.creditCard');
      case "SEPA_DIRECT_DEBIT": return t('methods.addTypes.sepa');
      case "PAYPAL": return "PayPal";
      case "BANK_ACCOUNT": return t('methods.addTypes.bankTransfer');
      default: return type;
    }
  };

  // ---------- RENDER ----------
  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadMethods} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;

  return (
    <div className="tab-panel">
      <div className="section-description" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--color-background-subtle, #f8f9fa)", borderRadius: "8px" }}>
        <p style={{ margin: 0, color: "var(--color-text-secondary, #6c757d)" }}>{t('methods.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('methods.count', { count: methods.length })}</span>
        <button onClick={() => openModal("add")} className="btn btn-primary btn-sm">{t('methods.addButton')}</button>
      </div>

      {methods.length === 0 ? (
        <div className="empty-state">
          <CardIcon />
          <h3>{t('methods.empty.title')}</h3>
          <p>{t('methods.empty.description')}</p>
          <button onClick={() => openModal("add")} className="btn btn-primary" style={{ marginTop: "1rem" }}>{t('methods.addButton')}</button>
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
                {!m.default && m.status === "VALID" && (
                  <button onClick={() => openModal("setDefault", m)} className="action-btn" title={t('methods.actions.setDefault')}><StarIcon /></button>
                )}
                {!m.default && (
                  <button onClick={() => openModal("delete", m)} className="action-btn action-btn-danger" title={t('methods.actions.delete')}><TrashIcon /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale Ajouter */}
      {modal.type === "add" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('methods.modal.addTitle')}</h3>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>{t('methods.modal.addDescription')}</p>
            
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label>{t('methods.modal.typeLabel')}</label>
              <select className="input" value={addType} onChange={(e) => setAddType(e.target.value)} disabled={actionLoading}>
                <option value="CREDIT_CARD">{getAddTypeLabel("CREDIT_CARD")}</option>
                <option value="SEPA_DIRECT_DEBIT">{getAddTypeLabel("SEPA_DIRECT_DEBIT")}</option>
                <option value="PAYPAL">{getAddTypeLabel("PAYPAL")}</option>
                <option value="BANK_ACCOUNT">{getAddTypeLabel("BANK_ACCOUNT")}</option>
              </select>
            </div>

            <div className="info-box" style={{ padding: "1rem", background: "var(--color-background-subtle)", borderRadius: "8px", marginBottom: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>{t('methods.modal.redirectNotice')}</p>
            </div>

            {actionError && <div className="error-banner" style={{ marginBottom: "1rem" }}>{actionError}</div>}

            <div className="modal-actions">
              <button onClick={closeModal} className="btn btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button onClick={handleAddMethod} className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? tCommon('loading') : t('methods.modal.continueButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Supprimer */}
      {modal.type === "delete" && modal.method && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('methods.modal.deleteTitle')}</h3>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>{t('methods.modal.deleteMessage')}</p>
            <div className="modal-detail" style={{ padding: "1rem", background: "var(--color-background-subtle)", borderRadius: "8px", marginBottom: "1rem" }}>
              <strong>{getPaymentTypeName(modal.method.paymentType, modal.method.paymentSubType)}</strong>
              {modal.method.label && <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>{modal.method.label}</p>}
            </div>
            {actionError && <div className="error-banner" style={{ marginBottom: "1rem" }}>{actionError}</div>}
            <div className="modal-actions">
              <button onClick={closeModal} className="btn btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button onClick={handleDelete} className="btn btn-danger" disabled={actionLoading}>
                {actionLoading ? tCommon('loading') : t('methods.actions.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Définir par défaut */}
      {modal.type === "setDefault" && modal.method && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('methods.modal.setDefaultTitle')}</h3>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>{t('methods.modal.setDefaultMessage')}</p>
            <div className="modal-detail" style={{ padding: "1rem", background: "var(--color-background-subtle)", borderRadius: "8px", marginBottom: "1rem" }}>
              <strong>{getPaymentTypeName(modal.method.paymentType, modal.method.paymentSubType)}</strong>
              {modal.method.label && <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>{modal.method.label}</p>}
            </div>
            {actionError && <div className="error-banner" style={{ marginBottom: "1rem" }}>{actionError}</div>}
            <div className="modal-actions">
              <button onClick={closeModal} className="btn btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button onClick={handleSetDefault} className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? tCommon('loading') : t('methods.actions.setDefault')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
