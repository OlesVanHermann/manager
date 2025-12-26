// ============================================================
// MODAL: Order CloudDB - Private Database
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type DbType = "mysql" | "mariadb" | "postgresql" | "redis";

interface Offer {
  planCode: string;
  name: string;
  ram: number;
  storage: number;
  price: number;
}

const DB_TYPES: { type: DbType; icon: string; label: string }[] = [
  { type: "mysql", icon: "🐬", label: "MySQL" },
  { type: "mariadb", icon: "🦭", label: "MariaDB" },
  { type: "postgresql", icon: "🐘", label: "PostgreSQL" },
  { type: "redis", icon: "🔴", label: "Redis" },
];

export function OrderCloudDbModal({ isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [dbType, setDbType] = useState<DbType>("mysql");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadOffers();
    }
  }, [isOpen]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const catalog = await apiClient.get("/order/catalog/public/webCloudDatabases");
      // Parser le catalogue pour extraire les offres
      const parsed: Offer[] = catalog?.plans?.slice(0, 4).map((p: any) => ({
        planCode: p.planCode,
        name: p.planCode.replace("clouddb-", "").toUpperCase(),
        ram: 512,
        storage: 1,
        price: p.pricings?.[0]?.price || 9.99,
      })) || [];
      setOffers(parsed);
      if (parsed.length > 0) setSelectedOffer(parsed[0].planCode);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedOffer) return;
    
    try {
      setOrdering(true);
      setError(null);
      // Simuler la commande (l'API réelle serait différente)
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(t("order.success"));
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setOrdering(false);
    }
  };

  if (!isOpen) return null;

  const selectedOfferData = offers.find(o => o.planCode === selectedOffer);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("order.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Type de base */}
          <div className="form-group">
            <label>{t("order.dbType")}</label>
            <div className="db-type-selector">
              {DB_TYPES.map(dt => (
                <button
                  key={dt.type}
                  type="button"
                  className={`db-type-btn ${dbType === dt.type ? "active" : ""}`}
                  onClick={() => setDbType(dt.type)}
                >
                  <span className="db-icon">{dt.icon}</span>
                  <span>{dt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Offres */}
          <div className="form-group">
            <label>{t("order.selectOffer")}</label>
            {loading ? (
              <div className="loading-spinner">{t("common.loading")}</div>
            ) : (
              <div className="offers-grid">
                {offers.map(offer => (
                  <div
                    key={offer.planCode}
                    className={`offer-card ${selectedOffer === offer.planCode ? "selected" : ""}`}
                    onClick={() => setSelectedOffer(offer.planCode)}
                  >
                    <div className="offer-name">{offer.name}</div>
                    <div className="offer-specs">
                      <span>{offer.ram} MB RAM</span>
                      <span>{offer.storage} GB Storage</span>
                    </div>
                    <div className="offer-price">
                      {offer.price.toFixed(2)}€<span>/mois</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Résumé */}
          {selectedOfferData && (
            <div className="order-summary">
              <h4>{t("order.summary")}</h4>
              <div className="summary-row">
                <span>Type</span>
                <span>{DB_TYPES.find(d => d.type === dbType)?.label}</span>
              </div>
              <div className="summary-row">
                <span>Offre</span>
                <span>{selectedOfferData.name}</span>
              </div>
              <div className="summary-row total">
                <span>Total mensuel</span>
                <span>{selectedOfferData.price.toFixed(2)}€ HT/mois</span>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t("common.cancel")}
          </button>
          <button 
            type="button" 
            className="privdb-modal-btn-primary" 
            onClick={handleOrder}
            disabled={ordering || !selectedOffer}
          >
            {ordering ? t("order.ordering") : t("order.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderCloudDbModal;
