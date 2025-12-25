// ============================================================
// GENERAL TAB SERVICE - CARBON - ISOLÉ
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ TYPES ============

export interface CarbonFootprint {
  co2: number;
  unit: string;
  period: string;
}

export interface CarbonService {
  serviceName: string;
  serviceType: string;
  co2: number;
  unit: string;
}

export interface CarbonSummary {
  total: CarbonFootprint;
  services: CarbonService[];
  equivalents?: {
    flights?: number;
    cars?: number;
    trees?: number;
  };
}

// ============ HELPERS ============

export function formatCO2(value: number, unit: string = "kg"): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} t`;
  }
  return `${value.toFixed(2)} ${unit}`;
}

// ============ CARBON API ============

export async function getCarbonFootprint(): Promise<CarbonSummary> {
  try {
    const data = await ovhGet<CarbonSummary>("/me/consumption/carbonFootprint");
    return data;
  } catch {
    return {
      total: { co2: 0, unit: "kg", period: "yearly" },
      services: [],
    };
  }
}

export async function getCarbonServices(): Promise<CarbonService[]> {
  try {
    const summary = await getCarbonFootprint();
    return summary.services || [];
  } catch {
    return [];
  }
}

// ============ DEDICATED SERVERS CARBON ============

export interface DedicatedServerCarbon {
  serviceName: string;
  co2: number;
  unit: string;
}

export async function getAccountCarbonFootprint(): Promise<CarbonSummary | null> {
  try {
    return await getCarbonFootprint();
  } catch {
    return null;
  }
}

export async function downloadCarbonReport(): Promise<Blob | null> {
  try {
    const response = await fetch("/api/ovh/me/consumption/carbonFootprint/report", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}
