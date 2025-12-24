// ============================================================
// SERVICE ISOLÉ : ContactsTab - Gestion des contacts domaine
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { DomainContact } from "../../domains.types";

// ============ SERVICE ============

class ContactsService {
  async getContact(nichandle: string): Promise<DomainContact> {
    return ovhGet<DomainContact>(`/me/contact/${nichandle}`);
  }
}

export const contactsService = new ContactsService();
