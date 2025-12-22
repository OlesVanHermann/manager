// ============================================================
// MODAL: Commander une nouvelle instance CloudDB
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Offer {
  planCode: string;
  name: string;
  ram: string;
  storage: string;
  price: number;
  currency: string;
}

const DATABASE_TYPES = [
  { value: "mysql", label: "MySQL", icon: "🐬" },
  { value: "mariadb", label: "MariaDB", icon: "🦭" },
  { value: "postgresql", label: "PostgreSQL", icon: "🐘" },
  { value: "redis", label: "Redis", icon: "🔴" },
];

const DATACENTERS = [
  { value: "gra", label: "Gravelines (France)" },
  { value: "sbg", label: "Strasbourg (France)" },
  { value: "rbx", label: "Roubaix (France)" },
  { value: "bhs", label: "Beauharnois (Canada)" },
  { value: "waw", label: "Varsovie (Pologne)" },
];

export function OrderCloudDbModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState({
    type: "mysql",
    version: "",
    datacenter: "gra",
    offer: "",
  });
  const [versions, setVersions] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    loadOffers();
  }, [isOpen]);

  useEffect(() => {
    const versionMap: Record<string, string[]> = {
      mysql: ["5.7", "8.0"],
      mariadb: ["10.4", "10.5", "10.6", "10.11"],
      postgresql: ["12", "13", "14", "15", "16"],
      redis: ["6.0", "7.0"],
    };
    setVersions(versionMap[form.type] || []);
    setForm(f => ({ ...f, version: versionMap[form.type]?.[versionMap[form.type].length - 1] || "" }));
  }, [form.type]);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await privateDatabaseService.getAvailableOffers();
      setOffers(data || []);
      if (data?.length > 0) {
        setForm(f => ({ ...f, offer: data[0].planCode }));
      }
    } catch (err) {
      console.error(err);
      setOffers([
        { planCode: "start", name: "Start", ram: "512 Mo", storage: "5 Go", price: 7.99, currency: "EUR" },
        { planCode: "essential", name: "Essential", ram: "1 Go", storage: "10 Go", price: 14.99, currency: "EUR" },
        { planCode: "business", name: "Business", ram: "2 Go", storage: "25 Go", price: 29.99, currency: "EUR" },
        { planCode: "enterprise", name: "Enterprise", ram: "4 Go", storage: "50 Go", price: 59.99, currency: "EUR" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOrder = () => {
    const url = `https://www.ovhcloud.com/fr/web-cloud/web-cloud-databases/order/?dbType=${form.type}&version=${form.version}&dc=${form.datacenter}`;
    window.open(url, "_blank");
    onClose();
  };

  const selectedOffer = offers.find(o => o.planCode === form.offer);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("order.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="loading-spinner">{t("common.loading")}</div>
          ) : (
            <>
              {/* Type de base */}
              <div className="form-group">
                <label>{t("order.dbType")}</label>
                <div className="db-type-selector">
                  {DATABASE_TYPES.map(db => (
                    <button
                      key={db.value}
                      className={`db-type-btn ${form.type === db.value ? "active" : ""}`}
                      onClick={() => setForm({ ...form, type: db.value })}
                    >
                      <span className="db-icon">{db.icon}</span>
                      <span>{db.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Version */}
              <div className="form-row">
                <div className="form-group">
                  <label>{t("order.version")}</label>
                  <select
                    className="form-select"
                    value={form.version}
                    onChange={e => setForm({ ...form, version: e.target.value })}
                  >
                    {versions.map(v => (
                      <option key={v} value={v}>{form.type} {v}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("order.datacenter")}</label>
                  <select
                    className="form-select"
                    value={form.datacenter}
                    onChange={e => setForm({ ...form, datacenter: e.target.value })}
                  >
                    {DATACENTERS.map(dc => (
                      <option key={dc.value} value={dc.value}>{dc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Offres */}
              <div className="form-group">
                <label>{t("order.offer")}</label>
                <div className="offers-grid">
                  {offers.map(offer => (
                    <div
                      key={offer.planCode}
                      className={`offer-card ${form.offer === offer.planCode ? "selected" : ""}`}
                      onClick={() => setForm({ ...form, offer: offer.planCode })}
                    >
                      <div className="offer-name">{offer.name}</div>
                      <div className="offer-specs">
                        <span>🧠 {offer.ram}</span>
                        <span>💾 {offer.storage}</span>
                      </div>
                      <div className="offer-price">
                        {offer.price.toFixed(2)} €<span>/mois HT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé */}
              {selectedOffer && (
                <div className="order-summary">
                  <h4>{t("order.summary")}</h4>
                  <div className="summary-row">
                    <span>{t("order.dbType")}:</span>
                    <span>{DATABASE_TYPES.find(d => d.value === form.type)?.label} {form.version}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t("order.datacenter")}:</span>
                    <span>{DATACENTERS.find(d => d.value === form.datacenter)?.label}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t("order.offer")}:</span>
                    <span>{selectedOffer.name} ({selectedOffer.ram} RAM, {selectedOffer.storage})</span>
                  </div>
                  <div className="summary-row total">
                    <span>{t("order.total")}:</span>
                    <span>{selectedOffer.price.toFixed(2)} € HT/mois</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" onClick={handleOrder} disabled={!form.offer}>
            {t("order.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderCloudDbModal;
