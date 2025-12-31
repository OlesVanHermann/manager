// ============================================================
// OPTIONS TAB - Options actives et disponibles
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connectionsService } from "../connections.service";
import type { Option, AvailableOption } from "../connections.types";
import "./OptionsTab.css";

interface OptionsTabProps {
  connectionId: string;
}

export function OptionsTab({ connectionId }: OptionsTabProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [activeOptions, setActiveOptions] = useState<Option[]>([]);
  const [availableOptions, setAvailableOptions] = useState<AvailableOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [active, available] = await Promise.all([
          connectionsService.getOptions(connectionId),
          connectionsService.getAvailableOptions(connectionId),
        ]);
        setActiveOptions(active);
        setAvailableOptions(available);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  const getOptionIcon = (type: string): string => {
    switch (type) {
      case "fixed-ip": return "🎯";
      case "ipv6": return "🔢";
      case "gtr": return "⚡";
      case "backup-4g": return "📶";
      case "anti-ddos": return "🛡";
      case "qos": return "📊";
      default: return "⚙";
    }
  };

  const formatPrice = (price: number, period: string): string => {
    const formatted = price.toFixed(2).replace(".", ",");
    return period === "monthly" ? `${formatted}€/mois` : `${formatted}€`;
  };

  const handleAddOption = async (optionId: string) => {
    try {
      await connectionsService.addOption(connectionId, optionId);
      // Refresh options
      const [active, available] = await Promise.all([
        connectionsService.getOptions(connectionId),
        connectionsService.getAvailableOptions(connectionId),
      ]);
      setActiveOptions(active);
      setAvailableOptions(available);
    } catch (err) {
      console.error("Add option failed:", err);
    }
  };

  const handleRemoveOption = async (optionId: string) => {
    if (!confirm(t("options.confirmRemove"))) return;
    try {
      await connectionsService.removeOption(connectionId, optionId);
      setActiveOptions(activeOptions.filter((o) => o.id !== optionId));
    } catch (err) {
      console.error("Remove option failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="options-tab">
        <div className="options-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="options-tab">
        <div className="options-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  // Filter out active options from available
  const activeIds = new Set(activeOptions.map((o) => o.id));
  const filteredAvailable = availableOptions.filter((o) => !activeIds.has(o.id));

  return (
    <div className="options-tab">
      {/* Active Options */}
      <div className="options-section">
        <div className="section-header">
          <h4>{t("options.active.title")}</h4>
          <span className="options-count">{activeOptions.length}</span>
        </div>

        {activeOptions.length > 0 ? (
          <div className="active-options">
            {activeOptions.map((option) => (
              <div key={option.id} className="option-card active">
                <div className="option-icon">{getOptionIcon(option.type)}</div>
                <div className="option-info">
                  <span className="option-label">{option.label}</span>
                  {option.price && (
                    <span className="option-price">
                      {formatPrice(option.price, "monthly")}
                    </span>
                  )}
                </div>
                <button
                  className="btn-remove"
                  onClick={() => handleRemoveOption(option.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="options-empty">
            <p>{t("options.active.empty")}</p>
          </div>
        )}
      </div>

      {/* Available Options */}
      <div className="options-section">
        <div className="section-header">
          <h4>{t("options.available.title")}</h4>
        </div>

        <div className="available-options">
          {filteredAvailable.map((option) => (
            <div key={option.id} className="option-card available">
              <div className="option-icon">{getOptionIcon(option.type)}</div>
              <div className="option-info">
                <span className="option-label">{option.label}</span>
                <span className="option-desc">{option.description}</span>
              </div>
              <div className="option-price-action">
                <span className="option-price">
                  {formatPrice(option.price, option.period)}
                </span>
                <button
                  className="btn-add"
                  onClick={() => handleAddOption(option.id)}
                >
                  + {t("options.available.add")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="options-info">
        <span className="info-icon">ℹ</span>
        <p>{t("options.info")}</p>
      </div>
    </div>
  );
}
