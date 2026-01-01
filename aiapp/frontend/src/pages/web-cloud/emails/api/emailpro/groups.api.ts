// ============================================================
// API EMAIL PRO - Groupes (Mailing Lists)
// Endpoints 2API: /sws/emailpro/{service}/groups/*
// Endpoints APIv6: /email/pro/{service}/mailingList/*
// ============================================================

import { apiFetch, ovh2apiGet, ovh2apiPost, ovh2apiPut } from "../../../../../services/api";

const BASE = "/email/pro";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface EmailProGroup {
  mailingListAddress: string;
  displayName?: string;
  maxSendSize?: number;
  maxReceiveSize?: number;
  hiddenFromGAL: boolean;
  departRestriction: "open" | "closed";
  joinRestriction: "open" | "closed" | "approval";
  state: "ok" | "deleting";
  taskPendingId?: number;
  membersCount?: number;
  managersCount?: number;
}

export interface CreateGroupParams {
  mailingListAddress: string;
  displayName?: string;
  departRestriction: "open" | "closed";
  joinRestriction: "open" | "closed" | "approval";
  hiddenFromGAL?: boolean;
  maxSendSize?: number;
  maxReceiveSize?: number;
}

export interface GroupMember {
  memberAccountId?: number;
  memberContactId?: number;
  type: "ACCOUNT" | "CONTACT";
}

export interface GroupManager {
  managerAccountId: number;
}

// ---------- 2API TYPES ----------

export interface GroupListResult {
  list: {
    results: EmailProGroup[];
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

// ---------- 2API CALLS ----------

/**
 * Liste paginée des groupes (2API)
 * Équivalent old_manager: getGroups
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupListResult> {
  return ovh2apiGet<GroupListResult>(`${BASE_2API}/${serviceId}/groups`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Droits de délégation d'un groupe (2API)
 * Équivalent old_manager: getMailingListDelegationRights
 */
export async function getDelegationRights(
  serviceId: string,
  mailingListAddress: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupDelegationRightsResult> {
  return ovh2apiGet<GroupDelegationRightsResult>(
    `${BASE_2API}/${serviceId}/groups/${mailingListAddress}/rights`,
    {
      count: options?.count ?? 25,
      offset: options?.offset ?? 0,
      search: options?.search ?? "",
    }
  );
}

/**
 * Mise à jour des droits de délégation d'un groupe (2API)
 * Équivalent old_manager: updateMailingListDelegationRights
 */
export async function updateDelegationRights(
  serviceId: string,
  mailingListAddress: string,
  rights: {
    sendRights?: string[];
    sendOnBehalfRights?: string[];
  }
): Promise<void> {
  await ovh2apiPut(
    `${BASE_2API}/${serviceId}/groups/${mailingListAddress}/rights-update`,
    rights
  );
}

/**
 * Comptes d'un groupe (2API)
 * Équivalent old_manager: getAccountsByGroup
 */
export async function getAccounts(
  serviceId: string,
  mailingListAddress: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupListResult> {
  return ovh2apiGet<GroupListResult>(
    `${BASE_2API}/${serviceId}/groups/${mailingListAddress}/accounts`,
    {
      count: options?.count ?? 25,
      offset: options?.offset ?? 0,
      search: options?.search ?? "",
    }
  );
}

/**
 * Managers d'un groupe (2API)
 * Équivalent old_manager: getManagersByGroup
 */
export async function getManagers(
  serviceId: string,
  mailingListAddress: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupListResult> {
  return ovh2apiGet<GroupListResult>(
    `${BASE_2API}/${serviceId}/groups/${mailingListAddress}/managers`,
    {
      count: options?.count ?? 25,
      offset: options?.offset ?? 0,
      search: options?.search ?? "",
    }
  );
}

/**
 * Membres d'un groupe (2API)
 * Équivalent old_manager: getMembersByGroup
 */
export async function getMembers(
  serviceId: string,
  mailingListAddress: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<GroupListResult> {
  return ovh2apiGet<GroupListResult>(
    `${BASE_2API}/${serviceId}/groups/${mailingListAddress}/members`,
    {
      count: options?.count ?? 25,
      offset: options?.offset ?? 0,
      search: options?.search ?? "",
    }
  );
}

/**
 * Alias d'un groupe (2API)
 * Équivalent old_manager: getGroupAliasList
 */
export async function getAliases(
  serviceId: string,
  mailingListAddress: string,
  options?: { count?: number; offset?: number }
): Promise<{ list: { results: Array<{ displayName: string }>; count: number } }> {
  return ovh2apiGet(`${BASE_2API}/${serviceId}/group/${mailingListAddress}/alias`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}

// ============================================================
// APIv6 ENDPOINTS
// ============================================================

/**
 * Liste des groupes (APIv6)
 */
export async function list(serviceId: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${serviceId}/mailingList`);
}

/**
 * Détails d'un groupe (APIv6)
 */
export async function get(serviceId: string, mailingListAddress: string): Promise<EmailProGroup> {
  return apiFetch<EmailProGroup>(`${BASE}/${serviceId}/mailingList/${mailingListAddress}`);
}

/**
 * Création d'un groupe (APIv6)
 */
export async function create(serviceId: string, data: CreateGroupParams): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/mailingList`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mise à jour d'un groupe (APIv6)
 */
export async function update(
  serviceId: string,
  mailingListAddress: string,
  data: Partial<Omit<CreateGroupParams, "mailingListAddress">>
): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/mailingList/${mailingListAddress}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Suppression d'un groupe (APIv6)
 * Équivalent old_manager: deleteGroup
 */
export async function remove(serviceId: string, mailingListAddress: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/mailingList/${mailingListAddress}`, {
    method: "DELETE",
  });
}

export { remove as delete };

/**
 * Suppression d'un manager (APIv6)
 * Équivalent old_manager: removeManager
 */
export async function removeManager(
  serviceId: string,
  mailingListAddress: string,
  managerAccountId: number
): Promise<void> {
  await apiFetch(
    `${BASE}/${serviceId}/mailingList/${mailingListAddress}/manager/account/${managerAccountId}`,
    { method: "DELETE" }
  );
}

/**
 * Suppression d'un membre (APIv6)
 * Équivalent old_manager: removeMember
 */
export async function removeMember(
  serviceId: string,
  mailingListAddress: string,
  memberId: number,
  type: "ACCOUNT" | "CONTACT"
): Promise<void> {
  const memberType = type === "ACCOUNT" ? "account" : "contact";
  await apiFetch(
    `${BASE}/${serviceId}/mailingList/${mailingListAddress}/member/${memberType}/${memberId}`,
    { method: "DELETE" }
  );
}

/**
 * Ajout d'un alias à un groupe (APIv6)
 * Équivalent old_manager: addGroupAlias
 */
export async function addAlias(
  serviceId: string,
  mailingListAddress: string,
  alias: string
): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/mailingList/${mailingListAddress}/alias`, {
    method: "POST",
    body: JSON.stringify({ alias }),
  });
}

/**
 * Suppression d'un alias d'un groupe (APIv6)
 * Équivalent old_manager: deleteGroupAlias
 */
export async function removeAlias(
  serviceId: string,
  mailingListAddress: string,
  alias: string
): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/mailingList/${mailingListAddress}/alias/${alias}`, {
    method: "DELETE",
  });
}
