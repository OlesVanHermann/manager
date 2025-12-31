// ============================================================
// COMPOSANT - LicenseView (Liste licences/packs dans LeftPanel)
// ============================================================

import { useMemo } from "react";
import { EmailLicense, EmailOffer } from "../../types";
import { OFFER_CONFIG } from "../../emails.constants";

interface LicenseViewProps {
  licenses: EmailLicense[];
  selectedLicense: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
}

/** Vue par licence dans le panel gauche. */
export function LicenseView({ licenses, selectedLicense, onSelect, searchQuery }: LicenseViewProps) {
  const { packs, alacarte, included } = useMemo(() => {
    const filtered = searchQuery
      ? licenses.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : licenses;

    return {
      packs: filtered.filter(l => l.type === "pack"),
      alacarte: filtered.filter(l => l.type === "alacarte"),
      included: filtered.filter(l => l.type === "included"),
    };
  }, [licenses, searchQuery]);

  const totalCost = useMemo(() => {
    return licenses.reduce((sum, l) => sum + l.pricePerMonth, 0);
  }, [licenses]);

  if (licenses.length === 0) {
    return (
      <div className="left-panel-empty">
        <p>Aucune licence trouvée</p>
      </div>
    );
  }

  return (
    <div className="license-list">
      {/* ---------- PACKS ---------- */}
      {packs.length > 0 && (
        <div className="license-section">
          <div className="license-section-header">PACKS</div>
          {packs.map((license) => (
            <LicenseItem
              key={license.id}
              license={license}
              isSelected={license.id === selectedLicense}
              onSelect={() => onSelect(license.id)}
            />
          ))}
        </div>
      )}

      {/* ---------- À LA CARTE ---------- */}
      {alacarte.length > 0 && (
        <div className="license-section">
          <div className="license-section-header">À LA CARTE</div>
          {alacarte.map((license) => (
            <LicenseItem
              key={license.id}
              license={license}
              isSelected={license.id === selectedLicense}
              onSelect={() => onSelect(license.id)}
            />
          ))}
        </div>
      )}

      {/* ---------- INCLUS ---------- */}
      {included.length > 0 && (
        <div className="license-section">
          <div className="license-section-header">INCLUS</div>
          {included.map((license) => (
            <LicenseItem
              key={license.id}
              license={license}
              isSelected={license.id === selectedLicense}
              onSelect={() => onSelect(license.id)}
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
