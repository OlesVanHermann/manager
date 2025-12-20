// ============================================================
// COMPONENT: ServiceItemBadge - Badges domaine/zone
// ============================================================

interface Props {
  hasDomain: boolean;
  hasZone: boolean;
}

/** Affiche les badges indiquant si l'entrée a un domaine et/ou une zone. */
export function ServiceItemBadge({ hasDomain, hasZone }: Props) {
  return (
    <div className="service-item-badges">
      {hasDomain && <span className="badge-icon" title="Domaine OVH">🌐</span>}
      {hasZone && <span className="badge-icon" title="Zone DNS OVH">📋</span>}
    </div>
  );
}
