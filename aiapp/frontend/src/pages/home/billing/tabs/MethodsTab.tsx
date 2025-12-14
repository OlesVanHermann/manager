import { useState, useEffect } from "react";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDateMonth } from "../utils";
import { ExternalIcon, CardIcon, VisaIcon, MastercardIcon, AmexIcon, BankIcon, PaypalIcon } from "../icons";

export function MethodsTab({ credentials }: TabProps) {
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
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, isDefault: boolean) => {
    if (isDefault) return <span className="status-badge badge-primary">Par défaut</span>;
    switch (status) {
      case "VALID": return <span className="status-badge badge-success">Actif</span>;
      case "EXPIRED": return <span className="status-badge badge-error">Expiré</span>;
      case "PENDING": return <span className="status-badge badge-warning">En attente</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const getPaymentIcon = (type: string, subType?: string) => {
    const t = (subType || type || "").toLowerCase();
    if (t.includes("visa")) return <VisaIcon />;
    if (t.includes("mastercard") || t.includes("mc")) return <MastercardIcon />;
    if (t.includes("amex") || t.includes("american")) return <AmexIcon />;
    if (t.includes("sepa") || t.includes("bank") || t.includes("prelevement")) return <BankIcon />;
    if (t.includes("paypal")) return <PaypalIcon />;
    return <CardIcon />;
  };

  const getPaymentTypeName = (type: string, subType?: string) => {
    const t = (subType || type || "").toLowerCase();
    if (t.includes("visa")) return "Visa";
    if (t.includes("mastercard") || t.includes("mc")) return "Mastercard";
    if (t.includes("amex") || t.includes("american")) return "American Express";
    if (t.includes("sepa") || t.includes("prelevement")) return "Prélèvement SEPA";
    if (t.includes("bank")) return "Virement bancaire";
    if (t.includes("paypal")) return "PayPal";
    if (t.includes("credit") || t.includes("card")) return "Carte bancaire";
    return type || "Autre";
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadMethods} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;

  return (
    <div className="tab-panel">
      <div className="section-description" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--color-background-subtle, #f8f9fa)", borderRadius: "8px" }}>
        <p style={{ margin: 0, color: "var(--color-text-secondary, #6c757d)" }}>
          Gérez vos moyens de paiement pour le règlement automatique de vos factures OVHcloud.
        </p>
      </div>

      <div className="toolbar">
        <span className="result-count">{methods.length} moyen(s) de paiement</span>
        <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Ajouter un moyen de paiement</a>
      </div>
      {methods.length === 0 ? (
        <div className="empty-state">
          <CardIcon />
          <h3>Aucun moyen de paiement</h3>
          <p>Ajoutez un moyen de paiement pour régler automatiquement vos factures.</p>
          <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: "1rem" }}>Ajouter un moyen de paiement</a>
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
                    {m.default && <span className="status-badge badge-primary">Par défaut</span>}
                    {getStatusBadge(m.status, false)}
                  </div>
                </div>
                <div className="method-details">
                  {m.label && <p className="method-label">{m.label}</p>}
                  {m.description && <p className="method-description">{m.description}</p>}
                </div>
                <div className="method-meta">
                  {m.expirationDate && formatDateMonth(m.expirationDate) && (
                    <span className="method-expiry">{new Date(m.expirationDate) < new Date() ? "Expiré" : "Expire"} : {formatDateMonth(m.expirationDate)}</span>
                  )}
                  {m.creationDate && <span className="method-created">Ajouté le {new Date(m.creationDate).toLocaleDateString("fr-FR")}</span>}
                </div>
              </div>
              <div className="method-actions">
                <a href={`https://www.ovh.com/manager/#/dedicated/billing/payment/method/${m.paymentMethodId}`} target="_blank" rel="noopener noreferrer" className="action-btn" title="Gérer"><ExternalIcon /></a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
