// ============================================================
// API EXCHANGE - Commandes (Order)
// Endpoints: /order/email/exchange/{org}/service/{service}/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/order/email/exchange";

// ---------- TYPES ----------

export interface OrderPrice {
  currencyCode: string;
  text: string;
  value: number;
}

export interface OrderDetail {
  description: string;
  domain: string;
  quantity: number;
  totalPrice: OrderPrice;
  unitPrice: OrderPrice;
}

export interface Order {
  orderId: number;
  url: string;
  prices: {
    withTax: OrderPrice;
    withoutTax: OrderPrice;
    tax: OrderPrice;
  };
  details: OrderDetail[];
}

export interface AccountOrderOptions {
  durations: string[];
  licences: string[];
}

export interface DiskSpaceOrderOptions {
  durations: string[];
  quota: number[];
}

export interface UpgradeOptions {
  durations: string[];
  offers: string[];
}

// ---------- HELPERS ----------

function getOrderPath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- ACCOUNT ORDER ----------

/**
 * Options pour commander des comptes supplémentaires
 * Équivalent old_manager: prepareForOrder
 */
export async function getAccountOptions(
  serviceId: string,
  duration: string
): Promise<{
  licence: string[];
  number: number[];
  storageQuota?: number[];
}> {
  const basePath = getOrderPath(serviceId);
  return apiFetch(`${basePath}/account/${duration}`);
}

/**
 * Commander des comptes supplémentaires
 * Équivalent old_manager: orderAccounts
 */
export async function orderAccounts(
  serviceId: string,
  duration: string,
  data: {
    number: number;
    licence: string;
    storageQuota?: number;
  }
): Promise<Order> {
  const basePath = getOrderPath(serviceId);
  return apiFetch<Order>(`${basePath}/account/${duration}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------- DISK SPACE ORDER ----------

/**
 * Options pour commander de l'espace disque
 * Équivalent old_manager: getDiskSpaceOptions
 */
export async function getDiskSpaceOptions(serviceId: string): Promise<{
  quota: number[];
}> {
  const basePath = getOrderPath(serviceId);
  return apiFetch(`${basePath}/diskSpace`);
}

/**
 * Commander de l'espace disque
 * Équivalent old_manager: orderDiskSpace
 */
export async function orderDiskSpace(
  serviceId: string,
  quota: number
): Promise<Order> {
  const basePath = getOrderPath(serviceId);
  return apiFetch<Order>(`${basePath}/diskSpace`, {
    method: "POST",
    body: JSON.stringify({ quota }),
  });
}

// ---------- ACCOUNT UPGRADE ----------

/**
 * Options pour upgrader une licence de compte
 * Équivalent old_manager: getAccountUpgradeOptions
 */
export async function getAccountUpgradeOptions(
  serviceId: string,
  duration: string
): Promise<{
  newQuota: number[];
  primaryEmailAddress: string[];
}> {
  const basePath = getOrderPath(serviceId);
  return apiFetch(`${basePath}/accountUpgrade/${duration}`);
}

/**
 * Upgrader une licence de compte
 * Équivalent old_manager: orderAccountUpgrade
 */
export async function orderAccountUpgrade(
  serviceId: string,
  duration: string,
  data: {
    primaryEmailAddress: string;
    newQuota: number;
  }
): Promise<Order> {
  const basePath = getOrderPath(serviceId);
  return apiFetch<Order>(`${basePath}/accountUpgrade/${duration}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------- SERVICE UPGRADE ----------

/**
 * Options pour upgrader l'offre Exchange
 * Équivalent old_manager: getUpgradeOptions
 */
export async function getServiceUpgradeOptions(serviceId: string): Promise<{
  offer: string[];
}> {
  const basePath = getOrderPath(serviceId);
  return apiFetch(`${basePath}/upgrade`);
}

/**
 * Upgrader l'offre Exchange
 * Équivalent old_manager: orderUpgrade
 */
export async function orderServiceUpgrade(
  serviceId: string,
  offer: string
): Promise<Order> {
  const basePath = getOrderPath(serviceId);
  return apiFetch<Order>(`${basePath}/upgrade`, {
    method: "POST",
    body: JSON.stringify({ offer }),
  });
}

// ---------- OUTLOOK LICENSE ----------

/**
 * Options pour commander une licence Outlook
 * Équivalent old_manager: getOutlookOptions
 */
export async function getOutlookOptions(
  serviceId: string,
  duration: string
): Promise<{
  primaryEmailAddress: string[];
}> {
  const basePath = getOrderPath(serviceId);
  return apiFetch(`${basePath}/outlook/${duration}`);
}

/**
 * Commander une licence Outlook
 * Équivalent old_manager: orderOutlook
 */
export async function orderOutlook(
  serviceId: string,
  duration: string,
  primaryEmailAddress: string
): Promise<Order> {
  const basePath = getOrderPath(serviceId);
  return apiFetch<Order>(`${basePath}/outlook/${duration}`, {
    method: "POST",
    body: JSON.stringify({ primaryEmailAddress }),
  });
}

// ---------- DURATIONS ----------

/**
 * Récupérer les durées disponibles pour une commande
 */
export async function getAvailableDurations(
  serviceId: string,
  orderType: "account" | "accountUpgrade" | "outlook"
): Promise<string[]> {
  const basePath = getOrderPath(serviceId);
  return apiFetch<string[]>(`${basePath}/${orderType}`);
}
