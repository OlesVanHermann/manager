// ============================================================
// LEVEL TAB - Niveaux de support
// NAV1: general / NAV2: support / NAV3: level
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .level-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as levelService from "./LevelTab.service";
import { getCredentials, SUPPORT_URLS } from "./LevelTab.service";
import "./LevelTab.css";

// ============ TYPES ============

interface SupportLevelInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: string;
  isCurrent: boolean;
  actionType: "none" | "included" | "upgrade" | "contact";
}

// ============ COMPOSANT ============

export function LevelTab() {
  const { t } = useTranslation("general/support/index");
  const { t: tCommon } = useTranslation("common");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>("standard");

  const SUPPORT_LEVELS: Omit<SupportLevelInfo, "isCurrent">[] = [
    {
      id: "standard",
      name: t("level.levels.standard.name"),
      description: t("level.levels.standard.description"),
      features: t("level.levels.standard.features", { returnObjects: true }) as string[],
      price: t("level.included"),
      actionType: "included",
    },
    {
      id: "premium",
      name: t("level.levels.premium.name"),
      description: t("level.levels.premium.description"),
      features: t("level.levels.premium.features", { returnObjects: true }) as string[],
      price: t("level.onQuote"),
      actionType: "contact",
    },
    {
      id: "business",
      name: t("level.levels.business.name"),
      description: t("level.levels.business.description"),
      features: t("level.levels.business.features", { returnObjects: true }) as string[],
      price: t("level.onQuote"),
      actionType: "contact",
    },
    {
      id: "enterprise",
      name: t("level.levels.enterprise.name"),
      description: t("level.levels.enterprise.description"),
      features: t("level.levels.enterprise.features", { returnObjects: true }) as string[],
      price: t("level.onQuote"),
      actionType: "contact",
    },
  ];

  useEffect(() => {
    loadSupportLevel();
  }, []);

  const loadSupportLevel = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError(t("errors.notAuthenticated"));
      setLoading(false);
      return;
    }
    try {
      const level = await levelService.getSupportLevel(credentials);
      const normalizedLevel = level.level?.toLowerCase().replace("-accredited", "") || "standard";
      setCurrentLevel(normalizedLevel);
    } catch {
      setCurrentLevel("standard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="level-tab">
        <div className="level-loading-state">
          <div className="level-spinner"></div>
          <p>{t("level.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="level-tab">
        <div className="level-error-state">
          <p>{error}</p>
          <button onClick={loadSupportLevel} className="level-btn level-btn-primary">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  const levels: SupportLevelInfo[] = SUPPORT_LEVELS.map((level) => ({
    ...level,
    isCurrent: level.id === currentLevel,
  }));
  const currentLevelInfo = levels.find((l) => l.isCurrent);

  return (
    <div className="level-tab">
      <div className="level-header">
        <h2>{t("level.title")}</h2>
        <p>{t("level.subtitle")}</p>
        <a
          href={SUPPORT_URLS.comparison}
          target="_blank"
          rel="noopener noreferrer"
          className="level-comparison-link"
        >
          {t("level.comparison")}
        </a>
      </div>

      {currentLevelInfo && (
        <div className="level-current-banner">
          <div className="level-current-info">
            <span className="level-current-label">{t("level.currentLevel")}</span>
            <span className="level-current-name">{currentLevelInfo.name}</span>
          </div>
          <span className="level-badge level-badge-primary">{t("level.active")}</span>
        </div>
      )}

      <div className="level-grid">
        {levels.map((level) => (
          <div key={level.id} className={`level-card ${level.isCurrent ? "level-current" : ""}`}>
            <div className="level-card-header">
              <h3>{level.name}</h3>
              {level.isCurrent && (
                <span className="level-badge level-badge-success">{t("level.current")}</span>
              )}
            </div>
            <p className="level-description">{level.description}</p>
            <div className="level-price">{level.price}</div>
            <ul className="level-features">
              {level.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <div className="level-actions">
              {level.isCurrent ? (
                <button className="level-btn level-btn-secondary" disabled>
                  {t("level.currentButton")}
                </button>
              ) : level.actionType === "included" ? (
                <span className="level-included-text">{t("level.includedDefault")}</span>
              ) : (
                <a
                  href={SUPPORT_URLS.comparison}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="level-btn level-btn-primary"
                >
                  {t("level.learnMore")}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="level-contact">
        <h3>{t("level.needHelp")}</h3>
        <p>{t("level.contactSales")}</p>
        <a
          href={SUPPORT_URLS.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="level-btn level-btn-secondary"
        >
          {t("level.contactButton")}
        </a>
      </div>
    </div>
  );
}
