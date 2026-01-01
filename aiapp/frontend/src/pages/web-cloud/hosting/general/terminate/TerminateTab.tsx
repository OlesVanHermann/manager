// ============================================================
// TERMINATE TAB - Résiliation d'hébergement
// NAV5: Home > Résiliation
// ============================================================

import React from "react";
import type { Hosting } from "../../hosting.types";

interface TerminateTabProps {
  serviceName: string;
  details: Hosting;
  onRefresh?: () => void;
}

export function TerminateTab({ serviceName, details }: TerminateTabProps) {
  return (
    <div className="hosting-tab-placeholder">
      <div className="placeholder-icon">⚠️</div>
      <h3>Résiliation</h3>
      <p>Service: {serviceName}</p>
      <p>Résilier votre hébergement web.</p>
      <p className="placeholder-note">TODO: Implémenter TerminateTab</p>
    </div>
  );
}

export default TerminateTab;
