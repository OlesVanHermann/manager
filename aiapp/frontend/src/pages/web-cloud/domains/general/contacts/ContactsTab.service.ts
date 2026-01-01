// ============================================================
// SERVICE ISOLÉ : ContactsTab - Gestion des contacts domaine + OWO
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
import type { DomainContact } from "../../domains.types";

interface OwoState {
  owner: boolean;
  admin: boolean;
  tech: boolean;
  billing: boolean;
}

// ============ SERVICE ============

class ContactsService {
  /**
   * Get contact details by NIC handle
   * GET /me/contact/{nichandle}
   */
  async getContact(nichandle: string): Promise<DomainContact> {
    return ovhGet<DomainContact>(`/me/contact/${nichandle}`);
  }

  /**
   * Get OWO (email obfuscation) state for a domain
   * GET /domain/{domain}/owo
   */
  async getOwoState(domain: string): Promise<OwoState> {
    try {
      const fields = await ovhGet<string[]>(`/domain/${encodeURIComponent(domain)}/owo`);
      // API returns array of obfuscated field names
      const state: OwoState = {
        owner: fields.includes("owner") || fields.includes("OWNER"),
        admin: fields.includes("admin") || fields.includes("ADMIN"),
        tech: fields.includes("tech") || fields.includes("TECH"),
        billing: fields.includes("billing") || fields.includes("BILLING"),
      };
      return state;
    } catch {
      // OWO not available for this TLD
      return { owner: false, admin: false, tech: false, billing: false };
    }
  }

  /**
   * Update OWO state for a domain
   * POST /domain/{domain}/owo
   */
  async updateOwoState(domain: string, state: OwoState): Promise<void> {
    const fields: string[] = [];
    if (state.owner) fields.push("owner");
    if (state.admin) fields.push("admin");
    if (state.tech) fields.push("tech");
    if (state.billing) fields.push("billing");

    await ovhPost(`/domain/${encodeURIComponent(domain)}/owo`, {
      obfuscate: fields,
    });
  }

  /**
   * Regenerate OWO email for a specific contact
   * POST /domain/{domain}/owo/{contact}/regenerate
   */
  async regenerateOwo(domain: string, contactType: string): Promise<void> {
    await ovhPost(`/domain/${encodeURIComponent(domain)}/owo/${contactType}/regenerate`, {});
  }
}

export const contactsService = new ContactsService();
