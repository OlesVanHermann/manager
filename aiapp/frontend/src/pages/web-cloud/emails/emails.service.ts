// ============================================================
// SERVICE UNIFIÉ - Emails (Agrégation multi-offres)
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../services/api";
import {
  EmailAccount,
  EmailDomain,
  EmailRedirection,
  EmailResponder,
  EmailList,
  EmailLicense,
  EmailTask,
  EmailOffer,
  LicenseHistory,
} from "./types";

// ============ TYPES INTERNES ============

interface DomainServiceMapping {
  domain: string;
  offer: EmailOffer;
  serviceId: string;
  org?: string; // Pour Exchange
}

// Cache du mapping domaine → service
let domainMappingCache: DomainServiceMapping[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

// ============ SERVICE ============

class EmailsService {
  // ============ MAPPING DOMAINE → SERVICE ============

  /** Construit le mapping de tous les domaines vers leurs services. */
  private async buildDomainMapping(): Promise<DomainServiceMapping[]> {
    const now = Date.now();
    if (domainMappingCache.length > 0 && now - cacheTimestamp < CACHE_TTL) {
      return domainMappingCache;
    }

    const mappings: DomainServiceMapping[] = [];

    // 1. MX Plan - le domaine EST le service
    try {
      const mxDomains = await ovhGet<string[]>("/email/domain");
      for (const domain of mxDomains) {
        mappings.push({
          domain,
          offer: "mx-plan",
          serviceId: domain,
        });
      }
    } catch (err) {
      console.error("Error fetching MX Plan domains:", err);
    }

    // 2. Email Pro - service → domaines
    try {
      const proServices = await ovhGet<string[]>("/email/pro");
      for (const service of proServices) {
        try {
          const domains = await ovhGet<string[]>(`/email/pro/${service}/domain`);
          for (const domain of domains) {
            mappings.push({
              domain,
              offer: "email-pro",
              serviceId: service,
            });
          }
        } catch (err) {
          console.error(`Error fetching Email Pro domains for ${service}:`, err);
        }
      }
    } catch (err) {
      console.error("Error fetching Email Pro services:", err);
    }

    // 3. Exchange - org → service → domaines
    try {
      const exchangeOrgs = await ovhGet<string[]>("/email/exchange");
      for (const org of exchangeOrgs) {
        try {
          const services = await ovhGet<string[]>(`/email/exchange/${org}/service`);
          for (const service of services) {
            try {
              const domains = await ovhGet<string[]>(`/email/exchange/${org}/service/${service}/domain`);
              for (const domain of domains) {
                mappings.push({
                  domain,
                  offer: "exchange",
                  serviceId: service,
                  org,
                });
              }
            } catch (err) {
              console.error(`Error fetching Exchange domains for ${org}/${service}:`, err);
            }
          }
        } catch (err) {
          console.error(`Error fetching Exchange services for ${org}:`, err);
        }
      }
    } catch (err) {
      console.error("Error fetching Exchange orgs:", err);
    }

    // 4. Zimbra - platform → domaines
    try {
      const zimbraPlatforms = await ovhGet<string[]>("/zimbra");
      for (const platform of zimbraPlatforms) {
        try {
          const domainsData = await ovhGet<{ id: string; name: string }[]>(`/zimbra/${platform}/domain`);
          for (const d of domainsData) {
            mappings.push({
              domain: d.name,
              offer: "zimbra",
              serviceId: platform,
            });
          }
        } catch (err) {
          console.error(`Error fetching Zimbra domains for ${platform}:`, err);
        }
      }
    } catch (err) {
      console.error("Error fetching Zimbra platforms:", err);
    }

    domainMappingCache = mappings;
    cacheTimestamp = now;
    return mappings;
  }

  /** Trouve les services associés à un domaine. */
  private async getServicesForDomain(domain: string): Promise<DomainServiceMapping[]> {
    const mappings = await this.buildDomainMapping();
    return mappings.filter(m => m.domain === domain);
  }

  // ============ DOMAINES ============

  /** Liste tous les domaines avec leurs offres. */
  async getDomains(): Promise<EmailDomain[]> {
    const mappings = await this.buildDomainMapping();

    // Grouper par domaine
    const domainMap = new Map<string, EmailDomain>();

    for (const mapping of mappings) {
      const existing = domainMap.get(mapping.domain);
      if (existing) {
        if (!existing.offers.includes(mapping.offer)) {
          existing.offers.push(mapping.offer);
        }
      } else {
        domainMap.set(mapping.domain, {
          name: mapping.domain,
          accounts: [],
          totalAccounts: 0,
          totalQuotaUsed: 0,
          offers: [mapping.offer],
        });
      }
    }

    return Array.from(domainMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  // ============ COMPTES ============

  /** Récupère les comptes email d'un domaine (toutes offres). */
  async getAccountsByDomain(domain: string): Promise<EmailAccount[]> {
    const services = await this.getServicesForDomain(domain);
    const accounts: EmailAccount[] = [];

    for (const svc of services) {
      try {
        const svcAccounts = await this.getAccountsForService(svc);
        // Filtrer pour ne garder que les comptes du domaine demandé
        const filtered = svcAccounts.filter(acc => acc.email.endsWith(`@${domain}`));
        accounts.push(...filtered);
      } catch (err) {
        console.error(`Error fetching accounts for ${svc.offer}/${svc.serviceId}:`, err);
      }
    }

    return accounts;
  }

  /** Récupère les comptes d'un service spécifique. */
  private async getAccountsForService(svc: DomainServiceMapping): Promise<EmailAccount[]> {
    switch (svc.offer) {
      case "mx-plan":
        return this.getMxPlanAccounts(svc.serviceId);
      case "email-pro":
        return this.getEmailProAccounts(svc.serviceId);
      case "exchange":
        return this.getExchangeAccounts(svc.org!, svc.serviceId);
      case "zimbra":
        return this.getZimbraAccounts(svc.serviceId);
      default:
        return [];
    }
  }

  // --- MX Plan ---
  private async getMxPlanAccounts(domain: string): Promise<EmailAccount[]> {
    try {
      const names = await ovhGet<string[]>(`/email/domain/${domain}/account`);
      if (!names || names.length === 0) return [];

      const accounts: EmailAccount[] = [];
      for (const name of names) {
        try {
          const details = await ovhGet<{
            accountName: string;
            description?: string;
            quota?: number;
            size?: number;
            isBlocked?: boolean;
          }>(`/email/domain/${domain}/account/${name}`);

          accounts.push({
            id: `mxplan-${domain}-${name}`,
            email: `${name}@${domain}`,
            displayName: details.description || name,
            offer: "mx-plan",
            domain,
            quota: details.quota || 5000,
            quotaUsed: details.size || 0,
            aliases: [],
            status: details.isBlocked ? "suspended" : "ok",
            serviceId: domain,
          });
        } catch (err) {
          console.error(`Error loading MX Plan account ${name}@${domain}:`, err);
        }
      }
      return accounts;
    } catch (err) {
      console.error(`getMxPlanAccounts(${domain}) error:`, err);
      return [];
    }
  }

  // --- Email Pro ---
  private async getEmailProAccounts(service: string): Promise<EmailAccount[]> {
    try {
      const emails = await ovhGet<string[]>(`/email/pro/${service}/account`);
      if (!emails || emails.length === 0) return [];

      const accounts: EmailAccount[] = [];
      for (const email of emails) {
        try {
          const details = await ovhGet<{
            primaryEmailAddress: string;
            displayName?: string;
            quota?: number;
            currentUsage?: number;
            state?: string;
          }>(`/email/pro/${service}/account/${email}`);

          const domain = email.split("@")[1] || "";
          accounts.push({
            id: `pro-${service}-${email}`,
            email: details.primaryEmailAddress || email,
            displayName: details.displayName,
            offer: "email-pro",
            domain,
            quota: details.quota || 10000,
            quotaUsed: details.currentUsage || 0,
            aliases: [],
            status: details.state === "ok" ? "ok" : "pending",
            serviceId: service,
          });
        } catch (err) {
          console.error(`Error loading Email Pro account ${email}:`, err);
        }
      }
      return accounts;
    } catch (err) {
      console.error(`getEmailProAccounts(${service}) error:`, err);
      return [];
    }
  }

  // --- Exchange ---
  private async getExchangeAccounts(org: string, service: string): Promise<EmailAccount[]> {
    try {
      const emails = await ovhGet<string[]>(`/email/exchange/${org}/service/${service}/account`);
      if (!emails || emails.length === 0) return [];

      const accounts: EmailAccount[] = [];
      for (const email of emails) {
        try {
          const details = await ovhGet<{
            primaryEmailAddress: string;
            displayName?: string;
            firstName?: string;
            lastName?: string;
            quota?: number;
            currentUsage?: number;
            state?: string;
          }>(`/email/exchange/${org}/service/${service}/account/${email}`);

          const domain = email.split("@")[1] || "";
          accounts.push({
            id: `exchange-${org}-${service}-${email}`,
            email: details.primaryEmailAddress || email,
            displayName: details.displayName,
            firstName: details.firstName,
            lastName: details.lastName,
            offer: "exchange",
            domain,
            quota: details.quota || 50000,
            quotaUsed: details.currentUsage || 0,
            aliases: [],
            status: details.state === "ok" ? "ok" : "pending",
            serviceId: `${org}/${service}`,
          });
        } catch (err) {
          console.error(`Error loading Exchange account ${email}:`, err);
        }
      }
      return accounts;
    } catch (err) {
      console.error(`getExchangeAccounts(${org}/${service}) error:`, err);
      return [];
    }
  }

  // --- Zimbra ---
  private async getZimbraAccounts(platform: string): Promise<EmailAccount[]> {
    try {
      const accountsData = await ovhGet<{
        id: string;
        email: string;
        displayName?: string;
        quota?: number;
        usedSpace?: number;
        status?: string;
      }[]>(`/zimbra/${platform}/account`);

      if (!accountsData || accountsData.length === 0) return [];

      return accountsData.map(acc => {
        const domain = acc.email.split("@")[1] || "";
        return {
          id: `zimbra-${platform}-${acc.id}`,
          email: acc.email,
          displayName: acc.displayName,
          offer: "zimbra" as EmailOffer,
          domain,
          quota: acc.quota || 10000,
          quotaUsed: acc.usedSpace || 0,
          aliases: [],
          status: acc.status === "ACTIVE" ? "ok" : "pending",
          serviceId: platform,
        };
      });
    } catch (err) {
      console.error(`getZimbraAccounts(${platform}) error:`, err);
      return [];
    }
  }

  /** Récupère les comptes par licence. */
  async getAccountsByLicense(licenseId: string): Promise<EmailAccount[]> {
    // Non implémenté pour l'instant
    return [];
  }

  // ============ REDIRECTIONS (MX Plan uniquement) ============

  async getRedirections(domain: string): Promise<EmailRedirection[]> {
    try {
      const ids = await ovhGet<string[]>(`/email/domain/${domain}/redirection`);
      if (!ids || ids.length === 0) return [];

      const redirections: EmailRedirection[] = [];
      for (const id of ids) {
        try {
          const details = await ovhGet<{
            id: string;
            from: string;
            to: string;
            localCopy?: boolean;
          }>(`/email/domain/${domain}/redirection/${id}`);

          redirections.push({
            id: details.id,
            from: details.from.includes("@") ? details.from : `${details.from}@${domain}`,
            to: details.to,
            type: details.to.endsWith(`@${domain}`) ? "local" : "external",
            keepCopy: details.localCopy || false,
            createdAt: new Date().toISOString(),
            domain,
          });
        } catch (err) {
          console.error(`Error loading redirection ${id}:`, err);
        }
      }
      return redirections;
    } catch (err) {
      console.error(`getRedirections(${domain}) error:`, err);
      return [];
    }
  }

  async createRedirection(domain: string, data: { from: string; to: string; keepCopy: boolean }): Promise<void> {
    await ovhPost(`/email/domain/${domain}/redirection`, {
      from: data.from,
      to: data.to,
      localCopy: data.keepCopy,
    });
  }

  async deleteRedirection(domain: string, id: string): Promise<void> {
    await ovhDelete(`/email/domain/${domain}/redirection/${id}`);
  }

  // ============ RÉPONDEURS (MX Plan uniquement) ============

  async getResponders(domain: string): Promise<EmailResponder[]> {
    try {
      const names = await ovhGet<string[]>(`/email/domain/${domain}/responder`);
      if (!names || names.length === 0) return [];

      const responders: EmailResponder[] = [];
      for (const name of names) {
        try {
          const details = await ovhGet<{
            account: string;
            content: string;
            from?: string;
            to?: string;
            copy: boolean;
          }>(`/email/domain/${domain}/responder/${name}`);

          responders.push({
            id: `${domain}-${name}`,
            email: `${details.account}@${domain}`,
            content: details.content,
            startDate: details.from || new Date().toISOString(),
            endDate: details.to || null,
            active: true,
            createdAt: new Date().toISOString(),
            domain,
          });
        } catch (err) {
          console.error(`Error loading responder ${name}:`, err);
        }
      }
      return responders;
    } catch (err) {
      console.error(`getResponders(${domain}) error:`, err);
      return [];
    }
  }

  async createResponder(domain: string, data: {
    email: string;
    content: string;
    startDate: string;
    endDate: string | null;
    copyTo?: string;
  }): Promise<void> {
    const accountName = data.email.split("@")[0];
    await ovhPost(`/email/domain/${domain}/responder`, {
      account: accountName,
      content: data.content,
      from: data.startDate,
      to: data.endDate,
      copy: !!data.copyTo,
      copyTo: data.copyTo,
    });
  }

  async deleteResponder(domain: string, id: string): Promise<void> {
    const accountName = id.replace(`${domain}-`, "");
    await ovhDelete(`/email/domain/${domain}/responder/${accountName}`);
  }

  // ============ LISTES (MX Plan uniquement) ============

  async getLists(domain: string): Promise<EmailList[]> {
    try {
      const names = await ovhGet<string[]>(`/email/domain/${domain}/mailingList`);
      if (!names || names.length === 0) return [];

      const lists: EmailList[] = [];
      for (const name of names) {
        try {
          const details = await ovhGet<{
            name: string;
            nbSubscribers?: number;
            options?: {
              moderatorMessage?: boolean;
              subscribeByModerator?: boolean;
            };
          }>(`/email/domain/${domain}/mailingList/${name}`);

          let moderationType: "open" | "moderated" | "closed" = "open";
          if (details.options?.subscribeByModerator) {
            moderationType = details.options.moderatorMessage ? "moderated" : "closed";
          }

          lists.push({
            id: `${domain}-${name}`,
            name: details.name,
            email: `${details.name}@${domain}`,
            type: "mailinglist",
            membersCount: details.nbSubscribers || 0,
            moderationType,
            createdAt: new Date().toISOString(),
            domain,
            offer: "mx-plan",
          });
        } catch (err) {
          console.error(`Error loading mailing list ${name}:`, err);
        }
      }
      return lists;
    } catch (err) {
      console.error(`getLists(${domain}) error:`, err);
      return [];
    }
  }

  async getMailingLists(domain: string): Promise<EmailList[]> {
    return this.getLists(domain);
  }

  async createMailingList(domain: string, data: {
    name: string;
    localPart: string;
    moderationType: "open" | "moderated" | "closed";
  }): Promise<void> {
    await ovhPost(`/email/domain/${domain}/mailingList`, {
      name: data.localPart,
      language: "fr",
      options: {
        moderatorMessage: data.moderationType === "moderated",
        subscribeByModerator: data.moderationType !== "open",
        usersPostOnly: data.moderationType === "closed",
      },
    });
  }

  async deleteMailingList(domain: string, id: string): Promise<void> {
    const name = id.replace(`${domain}-`, "");
    await ovhDelete(`/email/domain/${domain}/mailingList/${name}`);
  }

  // ============ TÂCHES ============

  async getTasks(domain?: string): Promise<EmailTask[]> {
    if (!domain) return [];

    try {
      const ids = await ovhGet<number[]>(`/email/domain/${domain}/task`);
      if (!ids || ids.length === 0) return [];

      const tasks: EmailTask[] = [];
      for (const id of ids.slice(0, 50)) {
        try {
          const task = await ovhGet<{
            id: number;
            function: string;
            status: string;
            todoDate?: string;
            doneDate?: string;
          }>(`/email/domain/${domain}/task/${id}`);

          tasks.push({
            id: task.id,
            function: task.function,
            status: task.status as EmailTask["status"],
            todoDate: task.todoDate,
            doneDate: task.doneDate,
            domain,
          });
        } catch (err) {
          console.error(`Error loading task ${id}:`, err);
        }
      }
      return tasks.sort((a, b) => (b.id || 0) - (a.id || 0));
    } catch (err) {
      console.error(`getTasks(${domain}) error:`, err);
      return [];
    }
  }

  // ============ LICENCES ============

  async getLicenses(): Promise<EmailLicense[]> {
    return [];
  }

  async getLicenseHistory(): Promise<LicenseHistory[]> {
    return [];
  }
}

export const emailsService = new EmailsService();
