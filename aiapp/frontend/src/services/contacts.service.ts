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

// ============ API REQUEST ============

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
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

  const response = await fetch(url, { method, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
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

// ============ SERVICE CONTACTS ============

// Fetch contacts for all services using /services endpoint
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
              serviceName: string;
              serviceType?: string;
              customer?: {
                contacts?: {
                  admin?: string;
                  billing?: string;
                  tech?: string;
                };
              };
            }>(credentials, "GET", `/services/${id}`);
            
            if (details.customer?.contacts) {
              return {
                serviceName: details.serviceName,
                serviceType: details.serviceType || "Autre",
                contactAdmin: details.customer.contacts.admin || "-",
                contactTech: details.customer.contacts.tech || "-",
                contactBilling: details.customer.contacts.billing || "-",
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
