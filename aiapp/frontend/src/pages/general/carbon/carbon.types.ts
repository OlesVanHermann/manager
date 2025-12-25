// ============================================================
// CARBON TYPES - Types partagés entre les tabs carbon
// SEUL fichier partagé autorisé au niveau NAV2
// ============================================================

import type { OvhCredentials } from "../../../types/auth.types";

// ============ TAB PROPS ============

export interface TabProps {
  credentials: OvhCredentials;
}

// ============ CARBON FOOTPRINT ============

export interface CarbonFootprint {
  total: number;
  unit: "kgCO2e" | "tCO2e";
  period: {
    from: string;
    to: string;
  };
  breakdown: CarbonBreakdownItem[];
}

export interface CarbonBreakdownItem {
  category: CarbonCategory;
  value: number;
  percentage: number;
  trend?: "up" | "down" | "stable";
  trendPercentage?: number;
}

export type CarbonCategory = 
  | "compute"
  | "storage"
  | "network"
  | "cooling"
  | "other";

// ============ SERVICES IMPACT ============

export interface ServiceCarbonImpact {
  serviceName: string;
  serviceType: string;
  carbonFootprint: number;
  unit: "kgCO2e" | "tCO2e";
  energyConsumption: number;
  energyUnit: "kWh" | "MWh";
  pue: number;
  datacenter: string;
  region: string;
}

// ============ DATACENTER INFO ============

export interface DatacenterCarbonInfo {
  name: string;
  code: string;
  country: string;
  region: string;
  pue: number;
  renewableEnergyPercentage: number;
  carbonIntensity: number;
  certifications: string[];
}

// ============ REPORTS ============

export interface CarbonReport {
  id: string;
  type: "monthly" | "quarterly" | "yearly";
  period: {
    from: string;
    to: string;
  };
  generatedAt: string;
  downloadUrl: string;
  format: "pdf" | "csv" | "json";
}

// ============ GOALS / TARGETS ============

export interface CarbonGoal {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: "kgCO2e" | "tCO2e" | "percentage";
  targetDate: string;
  status: "on_track" | "at_risk" | "off_track" | "achieved";
  createdAt: string;
}

// ============ HISTORY ============

export interface CarbonHistoryPoint {
  date: string;
  value: number;
  unit: "kgCO2e" | "tCO2e";
}

export interface CarbonHistory {
  period: {
    from: string;
    to: string;
  };
  granularity: "daily" | "weekly" | "monthly";
  data: CarbonHistoryPoint[];
  average: number;
  min: number;
  max: number;
}

// ============ RECOMMENDATIONS ============

export interface CarbonRecommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  estimatedSavings: number;
  unit: "kgCO2e" | "tCO2e";
  category: CarbonCategory;
  difficulty: "easy" | "medium" | "hard";
  services?: string[];
}
