// ============================================================
// BILLING UTILS - Helpers partagés
// ============================================================

import { useState, useEffect } from "react";
import { getCredentials } from "../../../services/api";
import type { OvhCredentials } from "../../../services/home.billing";

export interface TabProps {
  credentials: OvhCredentials;
}

export function useCredentials() {
  const [credentials, setCredentials] = useState<OvhCredentials | null>(null);
  useEffect(() => { setCredentials(getCredentials()); }, []);
  return credentials;
}

export function isNotFoundError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes("404") || msg.includes("not found") || msg.includes("does not exist");
  }
  return false;
}

export const formatDate = (d: string) => 
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export const formatDateLong = (d: string) => 
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export const formatDateInput = (d: string) => 
  d ? new Date(d).toISOString().split("T")[0] : "";

export const formatDateISO = (d: string) => 
  new Date(d).toISOString().split("T")[0];

export const formatAmount = (v: number, c: string) => {
  if (!c || c.toLowerCase() === "points") return `${v.toLocaleString("fr-FR")} pts`;
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);
  } catch {
    return `${v.toLocaleString("fr-FR")} ${c}`;
  }
};

export const formatDateMonth = (d: string | null) => 
  d ? new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;
