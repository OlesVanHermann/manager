// ============================================================
// SERVICE ISOLÉ : ContactsTab - Gestion des contacts domaine + OWO
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";
import type { DomainContact } from "../../domains.types";

interface OwoState {
  owner: boolean;
  admin: boolean;
  tech: boolean;
  billing: boolean;
}

// ============ TYPES CONTACT FIELDS ============

export interface ContactField {
  fieldName: string;
  mandatory: boolean;
  readOnly: boolean;
  type: string;
}

// ============ TYPES CONFIGURATION RULE ============

export interface ConfigurationRule {
  allowedValues?: string[];
  type: string;
  fields?: Record<string, unknown>;
}

export interface ConfigurationRuleCheck {
  valid: boolean;
  errors?: string[];
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
   * Get domain owner contact - Pattern identique old_manager
   * 1. GET /domain/{domain} pour obtenir whoisOwner ID
   * 2. GET /me/contact/{whoisOwner} pour obtenir les détails
   */
  async getOwner(domain: string): Promise<DomainContact & { contactId?: number } | null> {
    try {
      // Step 1: Get domain info with whoisOwner
      const domainInfo = await ovhGet<{ whoisOwner?: string | number }>(`/domain/${encodeURIComponent(domain)}`);

      // whoisOwner can be a number (contact ID) or empty
      if (domainInfo.whoisOwner && !isNaN(Number(domainInfo.whoisOwner))) {
        const contactId = Number(domainInfo.whoisOwner);
        // Step 2: Get contact details
        const ownerContact = await ovhGet<DomainContact>(`/me/contact/${contactId}`);
        return { ...ownerContact, contactId };
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get OWO (email obfuscation) state for a domain
   * GET /domain/{domain}/owo
   * @returns OwoState with available flag, or null if OWO not available for this TLD
   */
  async getOwoState(domain: string): Promise<{ state: OwoState; available: boolean }> {
    try {
      const fields = await ovhGet<string[]>(`/domain/${encodeURIComponent(domain)}/owo`);
      // API returns array of obfuscated field names
      const state: OwoState = {
        owner: fields.includes("owner") || fields.includes("OWNER"),
        admin: fields.includes("admin") || fields.includes("ADMIN"),
        tech: fields.includes("tech") || fields.includes("TECH"),
        billing: fields.includes("billing") || fields.includes("BILLING"),
      };
      return { state, available: true };
    } catch {
      // OWO not available for this TLD (404) - return unavailable
      return {
        state: { owner: false, admin: false, tech: false, billing: false },
        available: false
      };
    }
  }

  /**
   * Update OWO state for a domain
   * POST /domain/{domain}/owo
   * Note: 404 = OWO non disponible pour ce TLD (géré gracieusement)
   */
  async updateOwoState(domain: string, state: OwoState): Promise<boolean> {
    try {
      const fields: string[] = [];
      if (state.owner) fields.push("owner");
      if (state.admin) fields.push("admin");
      if (state.tech) fields.push("tech");
      if (state.billing) fields.push("billing");

      await ovhPost(`/domain/${encodeURIComponent(domain)}/owo`, {
        obfuscate: fields,
      });
      return true;
    } catch {
      // OWO not available for this TLD - return false silently
      return false;
    }
  }

  /**
   * Regenerate OWO email for a specific contact
   * POST /domain/{domain}/owo/{contact}/regenerate
   * Note: 404 = OWO non disponible pour ce TLD (géré gracieusement)
   */
  async regenerateOwo(domain: string, contactType: string): Promise<boolean> {
    try {
      await ovhPost(`/domain/${encodeURIComponent(domain)}/owo/${contactType}/regenerate`, {});
      return true;
    } catch {
      // OWO not available for this TLD - return false silently
      return false;
    }
  }

  /**
   * Change contact for a domain - Identique old_manager
   * POST /domain/{domain}/changeContact
   * @param contactType - "admin" | "tech" | "billing"
   * @param newNic - Le nouveau NIC handle (ex: ab12345-ovh)
   */
  async changeContact(domain: string, contactType: "admin" | "tech" | "billing", newNic: string): Promise<number[]> {
    const body: Record<string, string> = {};
    if (contactType === "admin") body.contactAdmin = newNic;
    if (contactType === "tech") body.contactTech = newNic;
    if (contactType === "billing") body.contactBilling = newNic;

    return ovhPost<number[]>(`/domain/${encodeURIComponent(domain)}/changeContact`, body);
  }

  // -------- CONTACT FIELDS (Identique old_manager) --------
  /**
   * Get contact fields metadata
   * GET /me/contact/{contactId}/fields - Identique old_manager
   */
  async getContactFields(contactId: string): Promise<ContactField[]> {
    return ovhGet<ContactField[]>(`/me/contact/${contactId}/fields`);
  }

  // -------- CONTACT BY NIC HANDLE --------
  /**
   * Get contact details by NIC handle (admin, tech, billing)
   * GET /me/contact/{nicHandle}
   * Note: Pour les contacts admin/tech/billing qui sont des NIC handles (ex: "ab12345-ovh")
   */
  async getContactByNicHandle(nicHandle: string): Promise<DomainContact> {
    return ovhGet<DomainContact>(`/me/contact/${encodeURIComponent(nicHandle)}`);
  }

  // -------- DOMAIN CONTACT BY ID (Owner) --------
  /**
   * Get domain owner contact by numeric ID
   * GET /domain/contact/{contactId} - Identique old_manager
   * Note: Pour le owner uniquement, qui a un ID numérique (whoisOwner)
   * @param contactId - ID numérique (number), pas un NIC handle !
   */
  async getDomainContactById(contactId: number): Promise<DomainContact> {
    return ovhGet<DomainContact>(`/domain/contact/${contactId}`);
  }

  /**
   * Update domain owner contact
   * PUT /domain/contact/{contactId} - Identique old_manager
   * @param contactId - ID numérique (number)
   */
  async updateDomainContact(contactId: number, params: Partial<DomainContact>): Promise<DomainContact> {
    return ovhPut<DomainContact>(`/domain/contact/${contactId}`, params);
  }

  // -------- CONFIGURATION RULES (Identique old_manager) --------
  /**
   * Get domain configuration rule for an action
   * GET /domain/configurationRule?action={action}&domain={domain} - Identique old_manager
   */
  async getDomainConfigurationRule(action: string, domain: string): Promise<ConfigurationRule> {
    return ovhGet<ConfigurationRule>(
      `/domain/configurationRule?action=${encodeURIComponent(action)}&domain=${encodeURIComponent(domain)}`
    );
  }

  /**
   * Check domain configuration rule
   * POST /domain/configurationRule/check?action={action}&domain={domain} - Identique old_manager
   */
  async checkDomainConfigurationRule(
    action: string,
    domain: string,
    params: Record<string, unknown>
  ): Promise<ConfigurationRuleCheck> {
    return ovhPost<ConfigurationRuleCheck>(
      `/domain/configurationRule/check?action=${encodeURIComponent(action)}&domain=${encodeURIComponent(domain)}`,
      params
    );
  }
}

export const contactsService = new ContactsService();
