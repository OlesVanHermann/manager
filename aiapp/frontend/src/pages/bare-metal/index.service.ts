/* ============================================================
   BARE-METAL DASHBOARD SERVICE
   Service local pour le listing des produits bare-metal
   ============================================================ */

import { ovhGet } from "../../services/api";

// ===== VPS =====
export interface VpsListItem {
  name: string;
  state: string;
  model?: { name: string };
  zone?: string;
}

export const listVps = async (): Promise<string[]> => {
  return ovhGet<string[]>("/vps");
};

export const getVpsInfo = async (serviceName: string): Promise<VpsListItem> => {
  return ovhGet<VpsListItem>(`/vps/${serviceName}`);
};

// ===== DEDICATED =====
export interface DedicatedListItem {
  name: string;
  state: string;
  commercialRange?: string;
  datacenter?: string;
}

export const listDedicated = async (): Promise<string[]> => {
  return ovhGet<string[]>("/dedicated/server");
};

export const getDedicatedInfo = async (serviceName: string): Promise<DedicatedListItem> => {
  return ovhGet<DedicatedListItem>(`/dedicated/server/${serviceName}`);
};

// ===== NASHA =====
export const listNasha = async (): Promise<string[]> => {
  return ovhGet<string[]>("/dedicated/nasha");
};

// ===== NETAPP =====
export const listNetapp = async (): Promise<string[]> => {
  return ovhGet<string[]>("/storage/netapp");
};

// ===== HOUSING =====
export const listHousing = async (): Promise<string[]> => {
  return ovhGet<string[]>("/dedicated/housing");
};

export const dashboardService = {
  listVps,
  getVpsInfo,
  listDedicated,
  getDedicatedInfo,
  listNasha,
  listNetapp,
  listHousing,
};
