// ============================================================
// CONTACTS SERVICES TAB SERVICE - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";

// ============ TYPES ============

export interface ServiceContact {
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  serviceName: string;
  serviceType?: string;
}

export interface ContactChangeTask {
  id: number;
  serviceName: string;
  contactType: "admin" | "billing" | "tech";
  currentContact: string;
  newContact: string;
  status: "pending" | "doing" | "done" | "refused" | "aborted";
  creationDate: string;
}

export interface ContactChangeRequest {
  contactAdmin?: string;
  contactTech?: string;
  contactBilling?: string;
}

// ============ HELPERS LOCAUX ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getContactTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    admin: "Administrateur",
    billing: "Facturation",
    tech: "Technique",
    contactAdmin: "Administrateur",
    contactBilling: "Facturation",
    contactTech: "Technique",
  };
  return labels[type] || type;
}

// ============ CONTACTS API ============

/** Récupère la liste des services avec leurs contacts */
export async function getServiceContacts(): Promise<ServiceContact[]> {
  try {
    const serviceNames = await ovhGet<string[]>("/me/contact");
    const contacts = await Promise.all(
      serviceNames.slice(0, 50).map(async (serviceName) => {
        try {
          const contact = await ovhGet<ServiceContact>(`/me/contact/${encodeURIComponent(serviceName)}`);
          return { ...contact, serviceName };
        } catch {
          return null;
        }
      })
    );
    return contacts.filter((c): c is ServiceContact => c !== null);
  } catch {
    return [];
  }
}

/** Initie un changement de contact pour un service */
export async function initiateContactChange(
  serviceName: string,
  request: ContactChangeRequest
): Promise<ContactChangeTask> {
  return ovhPost<ContactChangeTask>(`/me/contact/${encodeURIComponent(serviceName)}/change`, request);
}

/** Change un contact spécifique pour un service */
export async function changeContact(
  serviceName: string,
  contactType: string,
  newContact: string
): Promise<ContactChangeTask> {
  return ovhPost<ContactChangeTask>(`/me/contact/${encodeURIComponent(serviceName)}/change`, {
    contactType,
    contactNic: newContact,
  });
}
