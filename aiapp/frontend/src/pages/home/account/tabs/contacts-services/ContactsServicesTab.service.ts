// ============================================================
// CONTACTS SERVICES TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";

// ============ TYPES ============

export interface ServiceContact {
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  serviceName: string;
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

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function getContactTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    admin: "Administrateur",
    billing: "Facturation",
    tech: "Technique",
  };
  return labels[type] || type;
}

// ============ CONTACTS API ============

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

export async function changeContact(serviceName: string, contactType: string, newContact: string): Promise<ContactChangeTask> {
  return ovhPost<ContactChangeTask>(`/me/contact/${encodeURIComponent(serviceName)}/change`, {
    contactType,
    contactNic: newContact,
  });
}

// ============ ALIASES ============

export async function initiateContactChange(serviceName: string, contactType: string, newContact: string): Promise<ContactChangeTask> {
  return changeContact(serviceName, contactType, newContact);
}
