// ============================================================
// API EXCHANGE - Groupes de distribution
// Endpoints apiv6: /email/exchange/{org}/service/{service}/mailingList/*
// Endpoints 2API: /sws/exchange/{org}/{exchange}/groups/*
// ============================================================

import { apiFetch, ovh2apiGet, ovh2apiPost, ovh2apiPut } from "../../../../../services/api";

const BASE = "/email/exchange";
const BASE_2API = "/sws/exchange";

// ---------- TYPES ----------

export interface ExchangeGroup {
  mailingListAddress: string;
  displayName?: string;
  hiddenFromGAL: boolean;
  joinRestriction: "open" | "closed" | "approvalRequired";
  departRestriction: "open" | "closed";
  maxReceiveSize?: number;
  maxSendSize?: number;
  senderAuthentification: boolean;
  state: "ok" | "deleting";
  taskPendingId?: number;
}

export interface CreateGroupParams {
  mailingListAddress: string;
  displayName?: string;
  hiddenFromGAL?: boolean;
  joinRestriction?: "open" | "closed" | "approvalRequired";
  departRestriction?: "open" | "closed";
  senderAuthentification?: boolean;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

export async function list(domain: string, serviceId?: string): Promise<ExchangeGroup[]> {
  if (!serviceId) return [];

  const basePath = getServicePath(serviceId);
  const addresses = await apiFetch<string[]>(`${basePath}/mailingList`);

  const groups = await Promise.all(
    addresses.map(addr => get(domain, addr, serviceId))
  );

  return groups;
}

export async function get(domain: string, id: string, serviceId?: string): Promise<ExchangeGroup> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeGroup>(`${basePath}/mailingList/${id}`);
}

export async function create(domain: string, data: CreateGroupParams, serviceId?: string): Promise<ExchangeGroup> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeGroup>(`${basePath}/mailingList`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function remove(domain: string, id: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ---------- MEMBERS ----------

export async function getMembers(domain: string, id: string, serviceId?: string): Promise<string[]> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);

  const members = await apiFetch<{ memberContactId?: number; memberAccountId?: number }[]>(
    `${basePath}/mailingList/${id}/member/contact`
  );

  // Simplified: return member IDs as strings
  return members.map(m => String(m.memberContactId || m.memberAccountId));
}

export async function addMember(domain: string, id: string, email: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${id}/member/account`, {
    method: "POST",
    body: JSON.stringify({ memberAccountId: email }),
  });
}

export async function removeMember(domain: string, id: string, email: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${id}/member/account/${email}`, {
    method: "DELETE",
  });
}

// ---------- MANAGERS ----------

/**
 * Suppression d'un manager (APIv6)
 * Équivalent old_manager: removeManager
 */
export async function removeManager(
  serviceId: string,
  mailingListAddress: string,
  managerAccountId: number
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(
    `${basePath}/mailingList/${mailingListAddress}/manager/account/${managerAccountId}`,
    { method: "DELETE" }
  );
}

/**
 * Suppression d'un membre par type (APIv6)
 * Équivalent old_manager: removeMember (avec type)
 */
export async function removeMemberByType(
  serviceId: string,
  mailingListAddress: string,
  memberId: number,
  type: "ACCOUNT" | "CONTACT"
): Promise<void> {
  const basePath = getServicePath(serviceId);
  const memberType = type === "ACCOUNT" ? "account" : "contact";
  await apiFetch(
    `${basePath}/mailingList/${mailingListAddress}/member/${memberType}/${memberId}`,
    { method: "DELETE" }
  );
}

// ---------- GROUP UPDATE APIv6 ----------

/**
 * Mise à jour d'un groupe via APIv6 (pas 2API)
 * Équivalent old_manager: updateGroup
 */
export async function updateApiv6(
  serviceId: string,
  mailingListAddress: string,
  data: Partial<Omit<ExchangeGroup, "mailingListAddress" | "state" | "taskPendingId">>
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${mailingListAddress}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ---------- GROUP ALIASES APIv6 ----------

/**
 * Ajout d'un alias à un groupe (APIv6)
 * Équivalent old_manager: addGroupAlias
 */
export async function addGroupAlias(
  serviceId: string,
  mailingListAddress: string,
  alias: string
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${mailingListAddress}/alias`, {
    method: "POST",
    body: JSON.stringify({ alias }),
  });
}

/**
 * Suppression d'un alias d'un groupe (APIv6)
 * Équivalent old_manager: deleteGroupAlias
 */
export async function removeGroupAlias(
  serviceId: string,
  mailingListAddress: string,
  alias: string
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${mailingListAddress}/alias/${alias}`, {
    method: "DELETE",
  });
}

// ============================================================
// 2API ENDPOINTS - Pagination serveur & données agrégées
// Ces endpoints utilisent /sws/exchange/* (2API)
// ============================================================

// ---------- 2API TYPES ----------

export interface GroupListResult {
  list: {
    results: Array<ExchangeGroup & {
      aliases?: number;
      managers?: number;
      members?: number;
    }>;
    count: number;
  };
}

export interface GroupDelegationRight {
  account: string;
  sendRights: boolean;
  sendOnBehalfRights: boolean;
}

export interface GroupDelegationRightsResult {
  list: {
    results: GroupDelegationRight[];
    count: number;
  };
}

export interface GroupAccountsResult {
  list: {
    results: Array<{ email: string; type: "ACCOUNT" | "CONTACT" }>;
    count: number;
  };
}

// ---------- 2API HELPERS ----------

function get2apiPath(serviceId: string): string {
  const [org, exchange] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE_2API}/${org}/${exchange}`;
}

// ---------- 2API CALLS ----------

/**
 * Liste paginée des groupes (2API) - pagination serveur
 * Équivalent old_manager: getGroups
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupListResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<GroupListResult>(`${path}/groups`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Création groupe (2API)
 * Équivalent old_manager: addExchangeGroup
 */
export async function create2api(
  serviceId: string,
  data: CreateGroupParams & {
    managersToAdd?: string[];
    membersToAdd?: string[];
  }
): Promise<void> {
  const path = get2apiPath(serviceId);
  await ovh2apiPost(`${path}/groups-add`, data);
}

/**
 * Mise à jour groupe (2API)
 * Équivalent old_manager: updateGroups
 */
export async function update2api(
  serviceId: string,
  groupAddress: string,
  data: Partial<ExchangeGroup> & {
    managersToAdd?: string[];
    managersToRemove?: string[];
    membersToAdd?: string[];
    membersToRemove?: string[];
  }
): Promise<void> {
  const path = get2apiPath(serviceId);
  await ovh2apiPut(`${path}/groups/${groupAddress}/update`, data);
}

/**
 * Droits de délégation du groupe (2API)
 * Équivalent old_manager: getMailingListDelegationRights
 */
export async function getGroupDelegationRights(
  serviceId: string,
  groupAddress: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupDelegationRightsResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<GroupDelegationRightsResult>(`${path}/groups/${groupAddress}/rights`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Mise à jour droits de délégation (2API)
 * Équivalent old_manager: updateMailingListDelegationRights
 */
export async function updateGroupDelegationRights(
  serviceId: string,
  groupAddress: string,
  rights: {
    sendRights?: string[];
    sendOnBehalfRights?: string[];
  }
): Promise<void> {
  const path = get2apiPath(serviceId);
  await ovh2apiPut(`${path}/groups/${groupAddress}/rights-update`, rights);
}

/**
 * Comptes par groupe (2API)
 * Équivalent old_manager: getAccountsByGroup
 */
export async function getGroupAccounts(
  serviceId: string,
  groupAddress: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupAccountsResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<GroupAccountsResult>(`${path}/groups/${groupAddress}/accounts`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Managers du groupe (2API)
 * Équivalent old_manager: getGroupManagerList
 */
export async function getGroupManagers(
  serviceId: string,
  groupAddress: string,
  options?: { count?: number; offset?: number }
): Promise<GroupAccountsResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<GroupAccountsResult>(`${path}/groups/${groupAddress}/managers`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}

/**
 * Membres du groupe (2API)
 * Équivalent old_manager: getGroupMembersList
 */
export async function getGroupMembers(
  serviceId: string,
  groupAddress: string,
  options?: { state?: string }
): Promise<GroupAccountsResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<GroupAccountsResult>(`${path}/groups/${groupAddress}/members`, {
    state: options?.state ?? "ok",
  });
}

/**
 * Alias du groupe (2API)
 * Équivalent old_manager: getGroupAliasList
 */
export async function getGroupAliases(
  serviceId: string,
  groupAddress: string,
  options?: { count?: number; offset?: number }
): Promise<{ list: { results: string[]; count: number } }> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet(`${path}/group/${groupAddress}/alias`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}
