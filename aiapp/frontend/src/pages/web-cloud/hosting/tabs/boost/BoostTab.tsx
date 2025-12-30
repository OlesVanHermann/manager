// ============================================================
import "./BoostTab.css";
// HOSTING TAB: BOOST - Booster mon offre
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { boostService } from "./BoostTab.service";
import type { Hosting } from "../../hosting.types";

interface Props { 
  serviceName: string;
  details?: Hosting;
}

interface BoostHistory {
  offer: string;
  boostOffer: string;
  startDate: string;
  endDate: string;
}

export function BoostTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.boost");
  const [hosting, setHosting] = useState<Hosting | null>(details || null);
  const [history, setHistory] = useState<BoostHistory[]>([]);
  const [availableOffers, setAvailableOffers] = useState<string[]>([]);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hostingData, boostOffers] = await Promise.all([
        details ? Promise.resolve(details) : boostService.getHosting(serviceName),
        boostService.getBoostOffers(serviceName).catch(() => [])
      ]);
      setHosting(hostingData);
      setAvailableOffers(boostOffers);
      // Historique fictif pour l'exemple
      setHistory([
        { offer: hostingData.offer || "Performance 1", boostOffer: "Performance 2", startDate: "2025-11-15", endDate: "2025-11-22" }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [serviceName, details]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleActivateBoost = async () => {
    if (!selectedOffer) return;
    setActionLoading(true);
    try {
      await boostService.activateBoost(serviceName, selectedOffer);
      alert("Boost activé avec succès");
      loadData();
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateBoost = async () => {
    if (!confirm(t("boost.confirmDeactivate"))) return;
    setActionLoading(true);
    try {
      await boostService.deactivateBoost(serviceName);
      alert("Boost désactivé");
      loadData();
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (loading) return <div className="wh-boost-loading"><div className="wh-boost-skeleton" style={{ height: "400px" }} /></div>;

  const isBoostActive = !!hosting?.boostOffer;

  return (
    <div className="boost-tab">
      {/* Header */}
      <div className="wh-boost-header">
        <div>
          <h3>{t("boost.title")}</h3>
          <p className="wh-boost-description">{t("boost.description")}</p>
        </div>
        <div className="wh-boost-actions">
          {isBoostActive ? (
            <button 
              className="wh-boost-btn-danger-sm" 
              onClick={handleDeactivateBoost}
              disabled={actionLoading}
            >
              {t("boost.deactivate")}
            </button>
          ) : (
            <button 
              className="wh-boost-btn-primary" 
              onClick={handleActivateBoost}
              disabled={actionLoading || !selectedOffer}
            >
              {actionLoading ? "Activation..." : t("boost.activate")}
            </button>
          )}
        </div>
      </div>

      {/* Status card */}
      {isBoostActive ? (
        <div className="boost-status-card active">
          <div className="boost-status-icon">🚀</div>
          <div className="boost-status-content">
            <h4>{t("boost.active")}</h4>
            <p>{t("boost.currentOffer")}: <strong>{hosting?.boostOffer}</strong></p>
          </div>
        </div>
      ) : (
        <div className="boost-activation-card">
          <div className="boost-info">
            <h4>{t("boost.whatIs")}</h4>
            <p>{t("boost.explanation")}</p>
            <div className="boost-features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>{t("boost.featureCpu")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💾</span>
                <span>{t("boost.featureRam")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>{t("boost.featurePriority")}</span>
              </div>
            </div>
            <div className="wh-boost-info-banner warning" style={{ marginTop: "1rem" }}>
              <span className="wh-boost-info-icon">ℹ️</span>
              <span>{t("boost.noteDesc")}</span>
            </div>
          </div>
          <div className="boost-selector">
            <label>Choisir une offre Boost</label>
            <select 
              className="wh-boost-select"
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
            >
              <option value="">-- Sélectionner --</option>
              {availableOffers.map(offer => (
                <option key={offer} value={offer}>{offer}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="boost-history" style={{ marginTop: "2rem" }}>
        <h4>Historique des boosts</h4>
        <table className="wh-boost-table">
          <thead>
            <tr>
              <th>Compte</th>
              <th>Offre actuelle</th>
              <th>Boost</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {isBoostActive && (
              <tr>
                <td className="wh-boost-font-medium">{serviceName}</td>
                <td>{hosting?.offer || "-"}</td>
                <td>
                  <span className="wh-boost-badge success">{hosting?.boostOffer}</span>
                </td>
                <td>En cours</td>
              </tr>
            )}
            {!isBoostActive && (
              <tr>
                <td className="wh-boost-font-medium">{serviceName}</td>
                <td>{hosting?.offer || "-"}</td>
                <td>
                  <span className="wh-boost-badge inactive">Désactivé</span>
                </td>
                <td>-</td>
              </tr>
            )}
            {history.map((h, i) => (
              <tr key={i}>
                <td>{serviceName}</td>
                <td>{h.offer}</td>
                <td>{h.boostOffer}</td>
                <td>{formatDate(h.startDate)} - {formatDate(h.endDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BoostTab;
