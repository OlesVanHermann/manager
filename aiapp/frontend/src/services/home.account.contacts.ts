// ============================================================
// CONTACTS SERVICE - Gestion des contacts OVHcloud
// ============================================================

import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

// ============ TYPES ============

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    country: string;
  };
}

export interface ContactChange {
  id: number;
  askDate: string;
  state: "doing" | "done" | "refused" | "todo" | "validatingByCustomers";
  type: "contactAdmin" | "contactBilling" | "contactTech";
  from: string;
  to: string;
  serviceDomain: string;
}

export interface ServiceContact {
  serviceName: string;
  serviceType: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
}

export interface ContactChangeRequest {
  contactAdmin?: string;
  contactTech?: string;
  contactBilling?: string;
}

export interface ContactChangeResponse {
  contactAdmin?: number[];
  contactTech?: number[];
  contactBilling?: number[];
}

// ============ API REQUEST ============

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // Certains endpoints retournent vide (204)
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

// ============ CONTACTS ============

export async function getContactIds(credentials: OvhCredentials): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/me/contact");
}

export async function getContact(credentials: OvhCredentials, contactId: number): Promise<Contact> {
  return ovhRequest<Contact>(credentials, "GET", `/me/contact/${contactId}`);
}

export async function getContacts(credentials: OvhCredentials): Promise<Contact[]> {
  const ids = await getContactIds(credentials);
  const contacts = await Promise.all(
    ids.map((id) => getContact(credentials, id).catch(() => null))
  );
  return contacts.filter((c): c is Contact => c !== null);
}

// ============ CONTACT CHANGES ============

export async function getContactChangeIds(credentials: OvhCredentials): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/me/task/contactChange");
}

export async function getContactChange(credentials: OvhCredentials, taskId: number): Promise<ContactChange> {
  return ovhRequest<ContactChange>(credentials, "GET", `/me/task/contactChange/${taskId}`);
}

export async function getContactChanges(credentials: OvhCredentials): Promise<ContactChange[]> {
  const ids = await getContactChangeIds(credentials);
  const changes = await Promise.all(
    ids.map((id) => getContactChange(credentials, id).catch(() => null))
  );
  return changes.filter((c): c is ContactChange => c !== null)
    .sort((a, b) => new Date(b.askDate).getTime() - new Date(a.askDate).getTime());
}

/** Accepte une demande de changement de contact. Requiert le token reçu par email. */
export async function acceptContactChange(credentials: OvhCredentials, taskId: number, token: string): Promise<void> {
  return ovhRequest<void>(credentials, "POST", `/me/task/contactChange/${taskId}/accept`, { token });
}

/** Refuse une demande de changement de contact. Requiert le token reçu par email. */
export async function refuseContactChange(credentials: OvhCredentials, taskId: number, token: string): Promise<void> {
  return ovhRequest<void>(credentials, "POST", `/me/task/contactChange/${taskId}/refuse`, { token });
}

/** Initie un changement de contact pour un service. Envoie un email de validation aux contacts concernés. */
export async function initiateContactChange(
  credentials: OvhCredentials,
  serviceName: string,
  contacts: ContactChangeRequest
): Promise<ContactChangeResponse> {
  return ovhRequest<ContactChangeResponse>(credentials, "POST", `/me/change/contact`, {
    serviceName,
    ...contacts,
  });
}

// ============ SERVICE CONTACTS ============

/** Récupère les contacts de tous les services (limité à 50 pour performance). */
export async function getServiceContacts(credentials: OvhCredentials): Promise<ServiceContact[]> {
  try {
    const serviceIds = await ovhRequest<number[]>(credentials, "GET", "/services");
    const serviceContacts: ServiceContact[] = [];
    
    const batchSize = 10;
    for (let i = 0; i < Math.min(serviceIds.length, 50); i += batchSize) {
      const batch = serviceIds.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (id) => {
          try {
            const details = await ovhRequest<{
              resource?: {
                displayName?: string;
                name?: string;
                product?: {
                  description?: string;
                  name?: string;
                };
              };
              customer?: {
                contacts?: Array<{
                  customerCode: string;
                  type: string;
                }>;
              };
            }>(credentials, "GET", `/services/${id}`);
            
            if (details.resource && details.customer?.contacts) {
              const contacts = details.customer.contacts;
              const findContact = (type: string) => {
                const contact = contacts.find(c => c.type === type);
                return contact?.customerCode || "-";
              };
              return {
                serviceName: details.resource.displayName || details.resource.name || "-",
                serviceType: details.resource.product?.description || details.resource.product?.name || "Autre",
                contactAdmin: findContact("administrator"),
                contactTech: findContact("technical"),
                contactBilling: findContact("billing"),
              };
            }
          } catch {
            return null;
          }
          return null;
        })
      );
      serviceContacts.push(...results.filter((r): r is ServiceContact => r !== null));
    }
    
    return serviceContacts;
  } catch {
    return [];
  }
}
