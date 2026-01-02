// ============================================================
// API LICENSE - Historique des licences
// Endpoints: /email/pro/{service}/license, /email/exchange/.../license
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { EmailServiceType } from "./services.api";

// ---------- TYPES ----------

export type LicensePeriod = "LASTWEEK" | "LASTMONTH" | "LAST3MONTHS" | "LASTYEAR";

export interface LicenseDataPoint {
  value: number;
  time: Date;
}

export interface LicenseSeries {
  name: string;  // 'outlook', 'standard', 'basic', 'enterprise'
  max: number;
  data: LicenseDataPoint[];
}

export interface LicenseHistory {
  periods: LicensePeriod[];
  series: LicenseSeries[];
}

export interface RawLicenseEntry {
  date: string;
  outlookQuantity: number;
  accountLicense: Array<{
    license: string;
    licenseQuantity: number;
  }>;
}

// ---------- HELPERS ----------

/**
 * Calcule la date de début selon la période
 */
function getFromDate(period: LicensePeriod): Date {
  const now = new Date();
  switch (period) {
    case "LASTWEEK":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "LASTMONTH":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "LAST3MONTHS":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case "LASTYEAR":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

/**
 * Transforme les données brutes en séries pour graphique
 */
function transformLicenseData(data: RawLicenseEntry[]): LicenseSeries[] {
  const series: LicenseSeries[] = [];

  // Série Outlook
  const outlookSerie: LicenseSeries = {
    name: "outlook",
    max: 0,
    data: [],
  };

  data.forEach((entry) => {
    const point = {
      value: entry.outlookQuantity,
      time: new Date(entry.date),
    };
    outlookSerie.data.push(point);
    if (entry.outlookQuantity > outlookSerie.max) {
      outlookSerie.max = entry.outlookQuantity;
    }
  });

  if (outlookSerie.max > 0) {
    series.push(outlookSerie);
  }

  // Séries par type de licence
  const licenseTypes = ["basic", "standard", "enterprise"];

  for (const licenseType of licenseTypes) {
    const licenseSerie: LicenseSeries = {
      name: licenseType,
      max: 0,
      data: [],
    };

    data.forEach((entry) => {
      const licenseEntry = entry.accountLicense.find(
        (al) => al.license.toLowerCase() === licenseType
      );
      const value = licenseEntry?.licenseQuantity ?? 0;

      licenseSerie.data.push({
        value,
        time: new Date(entry.date),
      });

      if (value > licenseSerie.max) {
        licenseSerie.max = value;
      }
    });

    if (licenseSerie.max > 0) {
      series.push(licenseSerie);
    }
  }

  return series;
}

// ---------- EXCHANGE LICENSE HISTORY ----------

/**
 * Récupère l'historique des licences Exchange
 * GET /email/exchange/{organization}/service/{exchangeService}/license
 */
export async function getExchangeLicenseHistory(
  organization: string,
  exchangeService: string,
  period: LicensePeriod = "LASTMONTH"
): Promise<LicenseHistory> {
  const fromDate = getFromDate(period);
  const toDate = new Date();

  const data = await ovhGet<RawLicenseEntry[]>(
    `/email/exchange/${organization}/service/${exchangeService}/license?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
  );

  return {
    periods: ["LASTWEEK", "LASTMONTH", "LAST3MONTHS", "LASTYEAR"],
    series: transformLicenseData(data),
  };
}

// ---------- EMAIL PRO LICENSE HISTORY ----------

/**
 * Récupère l'historique des licences Email Pro
 * GET /email/pro/{service}/license
 */
export async function getEmailProLicenseHistory(
  service: string,
  period: LicensePeriod = "LASTMONTH"
): Promise<LicenseHistory> {
  const fromDate = getFromDate(period);
  const toDate = new Date();

  const data = await ovhGet<RawLicenseEntry[]>(
    `/email/pro/${service}/license?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
  );

  return {
    periods: ["LASTWEEK", "LASTMONTH", "LAST3MONTHS", "LASTYEAR"],
    series: transformLicenseData(data),
  };
}

// ---------- MX PLAN LICENSE HISTORY ----------

/**
 * Récupère l'historique des licences MX Plan
 * GET /email/mxplan/{service}/license
 */
export async function getMXPlanLicenseHistory(
  service: string,
  period: LicensePeriod = "LASTMONTH"
): Promise<LicenseHistory> {
  const fromDate = getFromDate(period);
  const toDate = new Date();

  try {
    const data = await ovhGet<RawLicenseEntry[]>(
      `/email/mxplan/${service}/license?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
    );

    return {
      periods: ["LASTWEEK", "LASTMONTH", "LAST3MONTHS", "LASTYEAR"],
      series: transformLicenseData(data),
    };
  } catch {
    // MXPlan n'a pas toujours l'endpoint license
    return {
      periods: ["LASTWEEK", "LASTMONTH", "LAST3MONTHS", "LASTYEAR"],
      series: [],
    };
  }
}

// ---------- AGGREGATED LICENSE HISTORY ----------

/**
 * Récupère l'historique des licences pour un service
 * (Dispatcher selon le type de service)
 */
export async function getLicenseHistoryForService(
  serviceType: EmailServiceType,
  serviceId: string,
  organization?: string,
  period: LicensePeriod = "LASTMONTH"
): Promise<LicenseHistory> {
  switch (serviceType) {
    case "exchange":
      if (!organization) throw new Error("Organization required for Exchange");
      return getExchangeLicenseHistory(organization, serviceId, period);
    case "emailpro":
      return getEmailProLicenseHistory(serviceId, period);
    case "mxplan":
      return getMXPlanLicenseHistory(serviceId, period);
    default:
      return {
        periods: ["LASTWEEK", "LASTMONTH", "LAST3MONTHS", "LASTYEAR"],
        series: [],
      };
  }
}

// ---------- LICENSE SUMMARY ----------

export interface LicenseSummary {
  totalLicenses: number;
  usedLicenses: number;
  byType: {
    [key: string]: {
      total: number;
      used: number;
    };
  };
}

/**
 * Calcule le résumé des licences actuelles à partir de l'historique
 */
export function getLicenseSummaryFromHistory(history: LicenseHistory): LicenseSummary {
  const summary: LicenseSummary = {
    totalLicenses: 0,
    usedLicenses: 0,
    byType: {},
  };

  for (const serie of history.series) {
    const lastValue = serie.data.length > 0
      ? serie.data[serie.data.length - 1].value
      : 0;

    summary.byType[serie.name] = {
      total: serie.max,
      used: lastValue,
    };

    summary.totalLicenses += serie.max;
    summary.usedLicenses += lastValue;
  }

  return summary;
}
