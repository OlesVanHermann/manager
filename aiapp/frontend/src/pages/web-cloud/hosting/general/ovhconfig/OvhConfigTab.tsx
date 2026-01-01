// ============================================================
// OVHCONFIG TAB - Configuration .ovhconfig
// NAV5: Home > OvhConfig
// ============================================================

import React from "react";
import type { Hosting } from "../../hosting.types";

interface OvhConfigTabProps {
  serviceName: string;
  details: Hosting;
  onRefresh?: () => void;
}

export function OvhConfigTab({ serviceName, details }: OvhConfigTabProps) {
  return (
    <div className="hosting-tab-placeholder">
      <div className="placeholder-icon">⚙️</div>
      <h3>Configuration OvhConfig</h3>
      <p>Service: {serviceName}</p>
      <p>Gérez les paramètres .ovhconfig de votre hébergement.</p>
      <p className="placeholder-note">TODO: Implémenter OvhConfigTab</p>
    </div>
  );
}

export default OvhConfigTab;
