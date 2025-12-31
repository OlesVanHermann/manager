// ============================================================
// API MX PLAN - Mailing Lists
// Endpoints: /email/domain/{domain}/mailingList/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanMailingList {
  name: string;
  id: number;
  nbSubscribers: number;
  nbSubscribersUpdateDate?: string;
  options: {
    moderatorMessage: boolean;
    subscribeByModerator: boolean;
    usersPostOnly: boolean;
  };
}

export interface CreateMailingListParams {
  name: string;
  language: "de" | "en" | "es" | "fr" | "it" | "nl" | "pl" | "pt";
  options?: {
    moderatorMessage?: boolean;
    subscribeByModerator?: boolean;
    usersPostOnly?: boolean;
  };
  ownerEmail: string;
  replyTo?: string;
}

// ---------- API CALLS ----------

export async function list(domain: string): Promise<MxPlanMailingList[]> {
  const names = await apiFetch<string[]>(`${BASE}/${domain}/mailingList`);

  const lists = await Promise.all(
    names.map(name => get(domain, name))
  );

  return lists;
}

export async function get(domain: string, id: string): Promise<MxPlanMailingList> {
  return apiFetch<MxPlanMailingList>(`${BASE}/${domain}/mailingList/${id}`);
}

export async function create(domain: string, data: CreateMailingListParams): Promise<MxPlanMailingList> {
  return apiFetch<MxPlanMailingList>(`${BASE}/${domain}/mailingList`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function remove(domain: string, id: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/mailingList/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ---------- MEMBERS ----------

export async function getMembers(domain: string, id: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${domain}/mailingList/${id}/subscriber`);
}

export async function addMember(domain: string, id: string, email: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/mailingList/${id}/subscriber`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function removeMember(domain: string, id: string, email: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/mailingList/${id}/subscriber/${email}`, {
    method: "DELETE",
  });
}

// ---------- MODERATORS ----------

export async function getModerators(domain: string, id: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${domain}/mailingList/${id}/moderator`);
}

export async function addModerator(domain: string, id: string, email: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/mailingList/${id}/moderator`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
