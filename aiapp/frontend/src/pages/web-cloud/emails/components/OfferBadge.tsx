// ============================================================
// COMPOSANT - OfferBadge (Badge offre email)
// ============================================================

import { EmailOffer } from "../types";
import { OFFER_CONFIG } from "../emails.constants";

interface OfferBadgeProps {
  offer: EmailOffer;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  count?: number;
}

/** Badge visuel pour identifier l'offre email (🟠 Exchange, 🔵 Pro, etc.) */
export function OfferBadge({ offer, size = "md", showLabel = false, count }: OfferBadgeProps) {
  const config = OFFER_CONFIG[offer];

  const sizeClasses = {
    sm: "offer-badge-sm",
    md: "offer-badge-md",
    lg: "offer-badge-lg",
  };

  return (
    <span className={`offer-badge ${sizeClasses[size]}`} title={config.label}>
      <span
        className="offer-badge-dot"
        style={{ backgroundColor: config.color }}
      />
      {showLabel && <span className="offer-badge-label">{config.label}</span>}
      {count !== undefined && <span className="offer-badge-count">{count}</span>}
    </span>
  );
}

// ---------- STYLES INLINE (pour inclusion dans LeftPanel.css) ----------
/*
.offer-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.offer-badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.offer-badge-sm .offer-badge-dot {
  width: 8px;
  height: 8px;
}

.offer-badge-lg .offer-badge-dot {
  width: 12px;
  height: 12px;
}

.offer-badge-label {
  font-size: 12px;
  color: var(--color-text-secondary, #6B7280);
}

.offer-badge-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-primary, #111827);
}
*/
