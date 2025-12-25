// ============================================================
// IP - Service isolé
// ============================================================

import { ovhGet, ovhPost } from "../../../services/api";
import type { IpBlock, IpReverse, IpFirewall, IpMitigation, IpTask } from "./ip.types";

// ==================== LISTE ====================

export async function listIps(): Promise<string[]> {
  return ovhGet<string[]>("/ip");
}

// ==================== DÉTAILS ====================

export async function getIp(ip: string): Promise<IpBlock> {
  return ovhGet<IpBlock>(`/ip/${encodeURIComponent(ip)}`);
}

// ==================== REVERSE DNS ====================

export async function listReverses(ip: string): Promise<string[]> {
  return ovhGet<string[]>(`/ip/${encodeURIComponent(ip)}/reverse`);
}

export async function getReverse(ip: string, ipReverse: string): Promise<IpReverse> {
  return ovhGet<IpReverse>(`/ip/${encodeURIComponent(ip)}/reverse/${encodeURIComponent(ipReverse)}`);
}

export async function setReverse(ip: string, ipReverse: string, reverse: string): Promise<IpReverse> {
  return ovhPost<IpReverse>(`/ip/${encodeURIComponent(ip)}/reverse`, { ipReverse, reverse });
}

// ==================== FIREWALL ====================

export async function getFirewall(ip: string, ipOnFirewall: string): Promise<IpFirewall> {
  return ovhGet<IpFirewall>(`/ip/${encodeURIComponent(ip)}/firewall/${encodeURIComponent(ipOnFirewall)}`);
}

// ==================== MITIGATION ====================

export async function getMitigation(ip: string, ipOnMitigation: string): Promise<IpMitigation> {
  return ovhGet<IpMitigation>(`/ip/${encodeURIComponent(ip)}/mitigation/${encodeURIComponent(ipOnMitigation)}`);
}

// ==================== TASKS ====================

export async function listTasks(ip: string): Promise<number[]> {
  return ovhGet<number[]>(`/ip/${encodeURIComponent(ip)}/task`);
}

export async function getTask(ip: string, taskId: number): Promise<IpTask> {
  return ovhGet<IpTask>(`/ip/${encodeURIComponent(ip)}/task/${taskId}`);
}

// ==================== EXPORT SERVICE ====================

export const ipService = {
  listIps,
  getIp,
  listReverses,
  getReverse,
  setReverse,
  getFirewall,
  getMitigation,
  listTasks,
  getTask,
};
