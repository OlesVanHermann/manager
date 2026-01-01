// ============================================================
// MIGRATION TAB - Migration d'hébergement
// NAV5: Home > Migration
// ============================================================

import React from "react";
import type { Hosting } from "../../hosting.types";

interface MigrationTabProps {
  serviceName: string;
  details: Hosting;
  onRefresh?: () => void;
}

export function MigrationTab({ serviceName, details }: MigrationTabProps) {
  return (
    <div className="hosting-tab-placeholder">
      <div className="placeholder-icon">🚀</div>
      <h3>Migration</h3>
      <p>Service: {serviceName}</p>
      <p>Migrez votre hébergement vers une nouvelle infrastructure.</p>
      <p className="placeholder-note">TODO: Implémenter MigrationTab</p>
    </div>
  );
}

export default MigrationTab;
