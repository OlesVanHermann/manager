// ============================================================
// METHODS TAB - Moyens de paiement (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as methodsService from "./MethodsTab.service";
import { formatDateMonth } from "./MethodsTab.helpers";
import { CardIcon, VisaIcon, MastercardIcon, AmexIcon, BankIcon, PaypalIcon, TrashIcon, StarIcon } from "./MethodsTab.icons";
import type { TabProps } from "../../billing.types";
import "./MethodsTab.css";

// ============ TYPES ============

interface ModalState {
  type: "add" | "delete" | "setDefault" | null;
  method: methodsService.PaymentMethod | null;
}

// ============ COMPOSANT ============

export function MethodsTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/methods");
  const { t: tCommon } = useTranslation('common');

  const [methods, setMethods] = useState<methodsService.PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: null, method: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [addType, setAddType] = useState("CREDIT_CARD");

  useEffect(() => { loadMethods(); }, []);

  const loadMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await methodsService.getPaymentMethods(credentials);
      setMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!modal.method) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await methodsService.deletePaymentMethod(modal.method.paymentMethodId);
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
      await methodsService.setDefaultPaymentMethod(modal.method.paymentMethodId);
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
      const result = await methodsService.createPaymentMethod({
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

  const openModal = (type: "add" | "delete" | "setDefault", method?: methodsService.PaymentMethod) => {
    setModal({ type, method: method || null });
    setActionError(null);
  };

  const closeModal = () => {
    if (!actionLoading) {
      setModal({ type: null, method: null });
      setActionError(null);
    }
  };

  const getStatusBadge = (status: string, isDefault: boolean) => {
    if (isDefault) return <span className="billing-methods-status-badge methods-badge-primary">{t('methods.default')}</span>;
    switch (status) {
      case "VALID": return <span className="billing-methods-status-badge methods-badge-success">{t('methods.status.active')}</span>;
      case "EXPIRED": return <span className="billing-methods-status-badge methods-badge-error">{t('methods.status.expired')}</span>;
      case "PENDING": return <span className="billing-methods-status-badge methods-badge-warning">{t('methods.status.pending')}</span>;
      default: return <span className="billing-methods-status-badge">{status}</span>;
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

  if (loading) {
    return (
      <div className="billing-methods-tab-panel">
        <div className="billing-methods-loading-state">
          <div className="billing-methods-spinner"></div>
          <p>{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-methods-tab-panel">
        <div className="billing-methods-error-banner">
          {error}
          <button onClick={loadMethods} className="billing-methods-btn methods-btn-sm methods-btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon('actions.refresh')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-methods-tab-panel">
      <div className="billing-methods-section-description">
        <p>{t('methods.description')}</p>
      </div>

      <div className="billing-methods-toolbar">
        <span className="billing-methods-result-count">{t('methods.count', { count: methods.length })}</span>
        <button onClick={() => openModal("add")} className="billing-methods-btn methods-btn-primary methods-btn-sm">{t('methods.addButton')}</button>
      </div>

      {methods.length === 0 ? (
        <div className="billing-methods-empty-state">
          <CardIcon />
          <h3>{t('methods.empty.title')}</h3>
          <p>{t('methods.empty.description')}</p>
          <button onClick={() => openModal("add")} className="billing-methods-btn methods-btn-primary" style={{ marginTop: "1rem" }}>{t('methods.addButton')}</button>
        </div>
      ) : (
        <div className="billing-methods-grid">
          {methods.map((m) => (
            <div key={m.paymentMethodId} className={`methods-method-card ${m.default ? "billing-methods-default" : ""}`}>
              <div className="billing-methods-method-icon-wrapper">{getPaymentIcon(m.paymentType, m.paymentSubType)}</div>
              <div className="billing-methods-method-content">
                <div className="billing-methods-method-header">
                  <h4 className="billing-methods-method-name">{getPaymentTypeName(m.paymentType, m.paymentSubType)}</h4>
                  <div className="billing-methods-method-badges">
                    {m.default && <span className="billing-methods-status-badge methods-badge-primary">{t('methods.default')}</span>}
                    {getStatusBadge(m.status, false)}
                  </div>
                </div>
                <div className="billing-methods-method-details">
                  {m.label && <p className="billing-methods-method-label">{m.label}</p>}
                  {m.description && <p className="billing-methods-method-description">{m.description}</p>}
                </div>
                <div className="billing-methods-method-meta">
                  {m.expirationDate && formatDateMonth(m.expirationDate) && (
                    <span className="billing-methods-method-expiry">{new Date(m.expirationDate) < new Date() ? t('methods.expired') : t('methods.expires')} : {formatDateMonth(m.expirationDate)}</span>
                  )}
                  {m.creationDate && <span className="billing-methods-method-created">{t('methods.addedOn')} {new Date(m.creationDate).toLocaleDateString("fr-FR")}</span>}
                </div>
              </div>
              <div className="billing-methods-method-actions">
                {!m.default && m.status === "VALID" && (
                  <button onClick={() => openModal("setDefault", m)} className="billing-methods-action-btn" title={t('methods.actions.setDefault')}><StarIcon /></button>
                )}
                {!m.default && (
                  <button onClick={() => openModal("delete", m)} className="billing-methods-action-btn methods-action-btn-danger" title={t('methods.actions.delete')}><TrashIcon /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale Ajouter */}
      {modal.type === "add" && (
        <div className="billing-methods-modal-overlay" onClick={closeModal}>
          <div className="billing-methods-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('methods.modal.addTitle')}</h3>
            <p className="billing-methods-modal-description">{t('methods.modal.addDescription')}</p>
            
            <div className="billing-methods-form-group">
              <label>{t('methods.modal.typeLabel')}</label>
              <select className="billing-methods-input" value={addType} onChange={(e) => setAddType(e.target.value)} disabled={actionLoading}>
                <option value="CREDIT_CARD">{getAddTypeLabel("CREDIT_CARD")}</option>
                <option value="SEPA_DIRECT_DEBIT">{getAddTypeLabel("SEPA_DIRECT_DEBIT")}</option>
                <option value="PAYPAL">{getAddTypeLabel("PAYPAL")}</option>
                <option value="BANK_ACCOUNT">{getAddTypeLabel("BANK_ACCOUNT")}</option>
              </select>
            </div>

            <div className="billing-methods-info-box">
              <p>{t('methods.modal.redirectNotice')}</p>
            </div>

            {actionError && <div className="billing-methods-error-banner">{actionError}</div>}

            <div className="billing-methods-modal-actions">
              <button onClick={closeModal} className="billing-methods-btn methods-btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button onClick={handleAddMethod} className="billing-methods-btn methods-btn-primary" disabled={actionLoading}>
                {actionLoading ? tCommon('loading') : t('methods.modal.continueButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Supprimer */}
      {modal.type === "delete" && modal.method && (
        <div className="billing-methods-modal-overlay" onClick={closeModal}>
          <div className="billing-methods-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('methods.modal.deleteTitle')}</h3>
            <p className="billing-methods-modal-description">{t('methods.modal.deleteMessage')}</p>
            <div className="billing-methods-modal-detail">
              <strong>{getPaymentTypeName(modal.method.paymentType, modal.method.paymentSubType)}</strong>
              {modal.method.label && <p>{modal.method.label}</p>}
            </div>
            {actionError && <div className="billing-methods-error-banner">{actionError}</div>}
            <div className="billing-methods-modal-actions">
              <button onClick={closeModal} className="billing-methods-btn methods-btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button onClick={handleDelete} className="billing-methods-btn methods-btn-danger" disabled={actionLoading}>
                {actionLoading ? tCommon('loading') : t('methods.actions.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Définir par défaut */}
      {modal.type === "setDefault" && modal.method && (
        <div className="billing-methods-modal-overlay" onClick={closeModal}>
          <div className="billing-methods-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('methods.modal.setDefaultTitle')}</h3>
            <p className="billing-methods-modal-description">{t('methods.modal.setDefaultMessage')}</p>
            <div className="billing-methods-modal-detail">
              <strong>{getPaymentTypeName(modal.method.paymentType, modal.method.paymentSubType)}</strong>
              {modal.method.label && <p>{modal.method.label}</p>}
            </div>
            {actionError && <div className="billing-methods-error-banner">{actionError}</div>}
            <div className="billing-methods-modal-actions">
              <button onClick={closeModal} className="billing-methods-btn methods-btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button onClick={handleSetDefault} className="billing-methods-btn methods-btn-primary" disabled={actionLoading}>
                {actionLoading ? tCommon('loading') : t('methods.actions.setDefault')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
