// ============================================================
// COMPOSANT - LicenseView (Liste licences/packs dans LeftPanel)
// Améliorations: Filtrage/pagination gérés par parent
// ============================================================

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmailLicense, EmailOffer } from "../../types";
import { OFFER_CONFIG } from "./emails.constants";

interface LicenseViewProps {
  licenses: EmailLicense[];
  selectedLicense: string | null;
  onSelect: (id: string) => void;
  currentPage: number;
  itemsPerPage: number;
}

/** Vue par licence dans le panel gauche. Reçoit licenses déjà filtré. */
export function LicenseView({ licenses, selectedLicense, onSelect, currentPage, itemsPerPage }: LicenseViewProps) {
  const { t } = useTranslation("web-cloud/emails/index");

  // Groupe par type
  const { packs, alacarte, included } = useMemo(() => {
    return {
      packs: licenses.filter(l => l.type === "pack"),
      alacarte: licenses.filter(l => l.type === "alacarte"),
      included: licenses.filter(l => l.type === "included"),
    };
  }, [licenses]);

  // Pagination sur la liste combinée
  const paginatedItems = useMemo(() => {
    const allItems = [...packs, ...alacarte, ...included];
    const start = (currentPage - 1) * itemsPerPage;
    return allItems.slice(start, start + itemsPerPage);
  }, [packs, alacarte, included, currentPage, itemsPerPage]);

  // Re-grouper les items paginés
  const paginatedGroups = useMemo(() => {
    return {
      packs: paginatedItems.filter(l => l.type === "pack"),
      alacarte: paginatedItems.filter(l => l.type === "alacarte"),
      included: paginatedItems.filter(l => l.type === "included"),
    };
  }, [paginatedItems]);

  const totalCost = useMemo(() => {
    return licenses.reduce((sum, l) => sum + l.pricePerMonth, 0);
  }, [licenses]);

  if (licenses.length === 0) {
    return (
      <div className="left-panel-empty">
        <p>{t("leftPanel.noLicense")}</p>
      </div>
    );
  }

  return (
    <div className="license-list">
      {/* ---------- PACKS ---------- */}
      {paginatedGroups.packs.length > 0 && (
        <div className="license-section">
          <div className="license-section-header">{t("leftPanel.sectionPacks")}</div>
          {paginatedGroups.packs.map((license) => (
            <LicenseItem
              key={license.id}
              license={license}
              isSelected={license.id === selectedLicense}
              onSelect={() => {
                onSelect(license.id);
              }}
            />
          ))}
        </div>
      )}

      {/* ---------- À LA CARTE ---------- */}
      {paginatedGroups.alacarte.length > 0 && (
        <div className="license-section">
          <div className="license-section-header">{t("leftPanel.sectionAlacarte")}</div>
          {paginatedGroups.alacarte.map((license) => (
            <LicenseItem
              key={license.id}
              license={license}
              isSelected={license.id === selectedLicense}
              onSelect={() => {
                onSelect(license.id);
              }}
            />
          ))}
        </div>
      )}

      {/* ---------- INCLUS ---------- */}
      {paginatedGroups.included.length > 0 && (
        <div className="license-section">
          <div className="license-section-header">{t("leftPanel.sectionIncluded")}</div>
          {paginatedGroups.included.map((license) => (
            <LicenseItem
              key={license.id}
              license={license}
              isSelected={license.id === selectedLicense}
              onSelect={() => {
                onSelect(license.id);
              }}
            />
          ))}
        </div>
      )}

      {/* ---------- TOTAL ---------- */}
      <div className="license-total">
        Total: <strong>{totalCost.toFixed(2)} €/mois</strong>
      </div>
    </div>
  );
}

// ---------- LICENSE ITEM ----------

interface LicenseItemProps {
  license: EmailLicense;
  isSelected: boolean;
  onSelect: () => void;
}

function LicenseItem({ license, isSelected, onSelect }: LicenseItemProps) {
  const config = OFFER_CONFIG[license.offer];
  const usagePercent = (license.usedLicenses / license.totalLicenses) * 100;

  return (
    <button
      className={`license-item ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="license-item-header">
        <span className="license-item-icon">📦</span>
        <span className="license-item-name">{license.name}</span>
      </div>

      <div className="license-item-offer">
        <span
          className="offer-dot"
          style={{ backgroundColor: config.color }}
        />
        <span className="license-scope">
          {license.scope === "multi-domain" ? "Multi-domaine" : license.scopeDomain}
        </span>
      </div>

      {license.type !== "included" && (
        <div className="license-item-usage">
          <div className="usage-bar">
            <div
              className="usage-bar-fill"
              style={{
                width: `${usagePercent}%`,
                backgroundColor: config.color,
              }}
            />
          </div>
          <span className="usage-text">
            {license.usedLicenses}/{license.totalLicenses} utilisées
          </span>
        </div>
      )}

      <div className="license-item-price">
        {license.type === "included" ? (
          <span className="price-free">Inclus</span>
        ) : (
          <span className="price-amount">{license.pricePerMonth.toFixed(2)} €/mois</span>
        )}
      </div>
    </button>
  );
}
