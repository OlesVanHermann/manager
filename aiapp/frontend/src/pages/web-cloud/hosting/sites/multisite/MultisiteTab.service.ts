// ============================================================
// MULTISITE TAB SERVICE - API calls for MultisiteTab
// ============================================================

import { ovhGet, ovhPost, ovhPostNoBody, ovhPut, ovhDelete, ovh2apiGet, ovhIceberg, type IcebergResult } from "../../../../../services/api";
import type { AttachedDomain } from "../../hosting.types";

const BASE = "/hosting/web";

// ============ 2API TYPES ============
export interface ExistingDomain2API {
  domains: Array<{
    name: string;
    type: string;
    hasDnsZone: boolean;
  }>;
}

export interface ZoneRecords2API {
  paginatedZone: {
    records: {
      results: Array<{
        fieldType: string;
        subDomain: string;
        target: string;
        ttl: number;
      }>;
    };
  };
}

export const multisiteService = {
  // --- Attached Domains ---
  listAttachedDomains: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/attachedDomain`),

  getAttachedDomain: (sn: string, domain: string) =>
    ovhGet<AttachedDomain>(`${BASE}/${sn}/attachedDomain/${domain}`),

  // Create with all params from old_manager: cdn, firewall, ownLog, path, runtimeId, ssl, bypassDNSConfiguration, ipLocation
  createAttachedDomain: (sn: string, data: {
    domain: string;
    path: string;
    cdn?: string;
    firewall?: string;
    ownLog?: string | null;
    runtimeId?: number | null;
    ssl?: boolean;
    bypassDNSConfiguration?: boolean;
    ipLocation?: string | null;
  }) =>
    ovhPost<void>(`${BASE}/${sn}/attachedDomain`, {
      domain: data.domain,
      path: data.path,
      cdn: data.cdn?.toLowerCase(),
      firewall: data.firewall?.toLowerCase(),
      ownLog: data.ownLog,
      runtimeId: data.runtimeId,
      ssl: data.ssl,
      bypassDNSConfiguration: data.bypassDNSConfiguration,
      ...(data.ipLocation && { ipLocation: data.ipLocation }),
    }),

  // Update with all params from old_manager
  updateAttachedDomain: (sn: string, domain: string, data: {
    path?: string;
    cdn?: string;
    firewall?: string;
    ownLog?: string | null;
    runtimeId?: number | null;
    ssl?: boolean;
    bypassDNSConfiguration?: boolean;
    ipLocation?: string | null;
  }) =>
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, {
      ...(data.path !== undefined && { path: data.path }),
      ...(data.cdn !== undefined && { cdn: data.cdn.toLowerCase() }),
      ...(data.firewall !== undefined && { firewall: data.firewall.toLowerCase() }),
      ...(data.ownLog !== undefined && { ownLog: data.ownLog }),
      ...(data.runtimeId !== undefined && { runtimeId: data.runtimeId }),
      ...(data.ssl !== undefined && { ssl: data.ssl }),
      ...(data.bypassDNSConfiguration !== undefined && { bypassDNSConfiguration: data.bypassDNSConfiguration }),
      ...(data.ipLocation && { ipLocation: data.ipLocation }),
    }),

  deleteAttachedDomain: (sn: string, domain: string) =>
    ovhDelete<void>(`${BASE}/${sn}/attachedDomain/${domain}`),

  // --- CDN Flush ---
  flushDomainCdn: (sn: string, domain: string, purgeType = "all", pattern = "") => {
    const payload: any = { patternType: purgeType };
    if (purgeType !== "all" && pattern) payload.pattern = pattern;
    if (domain) payload.domain = domain;
    return ovhPost<void>(`${BASE}/${sn}/cdn/flush`, payload);
  },

  // --- SSL ---
  // NOTE: POST sans body (API rejette les body vides avec 400)
  regenerateSsl: (sn: string) =>
    ovhPostNoBody<void>(`${BASE}/${sn}/ssl/regenerate`),

  activateDomainSsl: (sn: string, domain: string) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { ssl: true }),

  deactivateDomainSsl: (sn: string, domain: string) =>
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { ssl: false }),

  // ============ 2API ENDPOINTS (from old_manager) ============

  // Domaines existants - GET /sws/hosting/web/${sn}/add-domain-existing
  getExistingDomains2API: (sn: string, tokenNeeded = false) =>
    ovh2apiGet<ExistingDomain2API>(`/sws/hosting/web/${sn}/add-domain-existing`, {
      tokenNeeded: tokenNeeded ? 1 : 0,
    }),

  // IPv6 configuration - GET /sws/domain/${sn}/zone/records
  getIPv6Configuration2API: (sn: string, search: string) =>
    ovh2apiGet<ZoneRecords2API>(`/sws/domain/${sn}/zone/records`, {
      search,
      searchedType: "AAAA",
    }).then(data => data?.paginatedZone?.records?.results || []).catch(() => []),

  // ============ APIv6 MANQUANTS (from old_manager) ============

  // Dig status
  getDigStatus: (sn: string, domain: string) =>
    ovhGet<{ isOk: boolean; recommendedIp: string; currentIp: string }>(`${BASE}/${sn}/attachedDomain/${domain}/digStatus`),

  // Restart virtual host
  restartAttachedDomain: (sn: string, domain: string) =>
    ovhPost<void>(`${BASE}/${sn}/attachedDomain/${domain}/restart`, {}),

  // Get zones
  getZones: () =>
    ovhGet<string[]>("/domain/zone"),

  // Zone service infos
  getZoneServiceInfos: (zone: string) =>
    ovhGet<any>(`/domain/zone/${zone}/serviceInfos`),

  // Zone records
  getZoneRecords: (zone: string, subDomain?: string, fieldType?: string) =>
    ovhGet<number[]>(`/domain/zone/${zone}/record`, {
      params: { ...(subDomain && { subDomain }), ...(fieldType && { fieldType }) },
    } as any),

  // Get runtime configuration
  getRuntimeConfiguration: (sn: string, runtimeId: number) =>
    ovhGet<any>(`${BASE}/${sn}/runtime/${runtimeId}`),

  // Website creation capabilities
  getWebsiteCreationCapabilities: (sn: string) =>
    ovhGet<any>(`${BASE}/${sn}/websiteCreationCapabilities`),

  // Get websites associated with path
  getWebsitesAssociated: (sn: string, path: string) =>
    ovhGet<any[]>(`${BASE}/${sn}/website`, { params: { path } } as any),

  // Delete with bypass DNS config
  deleteAttachedDomainBypass: (sn: string, domain: string, bypassDNS = false) =>
    ovhDelete<void>(`${BASE}/${sn}/attachedDomain/${domain}?bypassDNSConfiguration=${bypassDNS}`),

  // ============ ZONE RECORDS (from old_manager iceberg) ============

  // Get zone record details by ID
  getZoneRecordById: (zone: string, recordId: number) =>
    ovhGet<{ id: number; fieldType: string; subDomain: string; target: string; ttl: number }>(
      `/domain/zone/${zone}/record/${recordId}`
    ),

  // Get A records for a subdomain (for existing configuration check)
  getExistingConfiguration: async (zone: string, subDomain: string, wwwNeeded = false) => {
    // Get all A record IDs
    const ids = await ovhGet<number[]>(`/domain/zone/${zone}/record`, {
      params: { fieldType: "A" },
    } as any);

    // Get details for each record
    const records = await Promise.all(
      ids.map((id: number) =>
        ovhGet<{ id: number; fieldType: string; subDomain: string; target: string; ttl: number }>(
          `/domain/zone/${zone}/record/${id}`
        )
      )
    );

    // Filter by subdomain
    return records.filter(
      (record) =>
        record.subDomain === subDomain ||
        (wwwNeeded && record.subDomain === ["www", subDomain].filter(Boolean).join("."))
    );
  },

  // ============ HELPER METHODS (from old_manager) ============

  // Add domain with www handling (like old_manager addDomain)
  addDomainWithWww: async (
    sn: string,
    baseDomain: string,
    domainName: string | null,
    home: string,
    wwwNeeded: boolean,
    autoconfigure: boolean,
    cdn: string,
    countryIp: { country?: string } | null,
    firewall: string,
    ownLog: string | null,
    ssl: boolean,
    runtimeId: number | null
  ) => {
    const completeDomain = domainName ? `${domainName}.${baseDomain}` : baseDomain;
    const ipLocation = countryIp?.country || null;

    const promises = [
      multisiteService.createAttachedDomain(sn, {
        domain: completeDomain,
        path: home,
        cdn,
        firewall,
        ownLog,
        runtimeId,
        ssl,
        bypassDNSConfiguration: !autoconfigure,
        ipLocation,
      }),
    ];

    if (wwwNeeded) {
      promises.push(
        multisiteService.createAttachedDomain(sn, {
          domain: `www.${completeDomain}`,
          path: home,
          cdn,
          firewall,
          ownLog,
          runtimeId,
          ssl,
          bypassDNSConfiguration: !autoconfigure,
          ipLocation,
        })
      );
    }

    return Promise.all(promises);
  },

  // Modify domain with www handling (like old_manager modifyDomain)
  modifyDomainWithWww: async (
    sn: string,
    domain: string,
    home: string,
    wwwNeeded: boolean,
    cdn: string,
    countryIp: { country?: string } | null,
    firewall: string,
    ownLog: string | null,
    ssl: boolean,
    runtimeId: number | null
  ) => {
    const ipLocation = countryIp?.country || null;

    const promises = [
      multisiteService.updateAttachedDomain(sn, domain, {
        path: home,
        cdn,
        firewall,
        ownLog,
        runtimeId,
        ssl,
        bypassDNSConfiguration: false,
        ipLocation,
      }),
    ];

    if (wwwNeeded) {
      promises.push(
        multisiteService.updateAttachedDomain(sn, `www.${domain}`, {
          path: home,
          cdn,
          firewall,
          ownLog,
          runtimeId,
          ssl,
          bypassDNSConfiguration: false,
          ipLocation,
        })
      );
    }

    return Promise.all(promises);
  },

  // Remove domain with www handling (like old_manager removeDomain)
  removeDomainWithWww: async (sn: string, domain: string, wwwNeeded: boolean, autoconfigure: boolean) => {
    const promises = [multisiteService.deleteAttachedDomainBypass(sn, domain, !autoconfigure)];

    if (wwwNeeded) {
      promises.push(multisiteService.deleteAttachedDomainBypass(sn, `www.${domain}`, !autoconfigure));
    }

    return Promise.all(promises);
  },

  // ============ ICEBERG PAGINATION (from old_manager) ============

  // List attached domains with iceberg (old_manager uses limit: 50000)
  listAttachedDomainsIceberg: (sn: string, page = 1, pageSize = 50000): Promise<IcebergResult<AttachedDomain>> =>
    ovhIceberg<AttachedDomain>(`${BASE}/${sn}/attachedDomain`, { page, pageSize }),

  // List zone records with iceberg
  getZoneRecordsIceberg: (zone: string, page = 1, pageSize = 100, fieldType?: string): Promise<IcebergResult<any>> =>
    ovhIceberg<any>(`/domain/zone/${zone}/record`, {
      page,
      pageSize,
      ...(fieldType && { filters: [{ field: "fieldType", comparator: "eq", value: fieldType }] }),
    }),

  // Get all attached domains with full details (from old_manager getTabDomains)
  getAllAttachedDomainsDetails: async (sn: string) => {
    const result = await ovhIceberg<AttachedDomain>(`${BASE}/${sn}/attachedDomain`, { page: 1, pageSize: 50000 });
    return result.data;
  },

  // ============ GIT INTEGRATION (from old_manager git-*.service.js) ============

  // --- SSH Key (from git-association.service.js) ---

  // Get SSH public key (auto-create if 404/403)
  getSshKey: async (sn: string): Promise<string | null> => {
    try {
      const data = await ovhGet<{ publicKey: string }>(`${BASE}/${sn}/key/ssh`);
      return data.publicKey;
    } catch (error: any) {
      if (error?.status === 404 || error?.status === 403) {
        try {
          const data = await ovhPost<{ publicKey: string }>(`${BASE}/${sn}/key/ssh`, {});
          return data.publicKey;
        } catch (createError: any) {
          if (createError?.status === 500) {
            return null;
          }
          throw createError;
        }
      }
      throw error;
    }
  },

  // --- VCS Webhooks (from git-association.service.js) ---

  // Get VCS webhook URLs for a path
  getVcsWebhookUrls: (sn: string, path: string, vcs: string) =>
    ovhGet<{ push: string; tag: string }>(`${BASE}/${sn}/vcs/webhooks`, {
      params: { path, vcs },
    } as any),

  // --- Website / VCS Association (from git-association.service.js) ---

  // Get websites list (with optional path filter)
  listWebsites: (sn: string, path?: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/website`, {
      params: path ? { path } : undefined,
    } as any).catch(() => []),

  // Get website details
  getWebsite: (sn: string, websiteId: number) =>
    ovhGet<{
      id: number;
      path: string;
      status: string;
      vcsUrl: string;
      vcsBranch: string;
    }>(`${BASE}/${sn}/website/${websiteId}`),

  // Get VCS informations for a path (from git-association.service.js getVcsInformations)
  getVcsInformations: async (sn: string, path: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/website`, {
      params: { path },
    } as any).catch(() => []);

    if (ids.length === 0) return null;

    const website = await ovhGet<{
      id: number;
      vcsUrl: string;
      vcsBranch: string;
    }>(`${BASE}/${sn}/website/${ids[0]}`);

    return {
      repositoryUrl: website.vcsUrl,
      branchName: website.vcsBranch,
      id: website.id,
    };
  },

  // Create website with VCS (from git-association.service.js postWebsiteAssociated)
  createWebsiteWithVcs: (sn: string, data: {
    path: string;
    vcsBranch: string;
    vcsUrl: string;
  }) =>
    ovhPost<{ id: number }>(`${BASE}/${sn}/website`, data),

  // Update website VCS branch (from git-association.service.js putWebsiteAssociated)
  updateWebsiteVcsBranch: (sn: string, websiteId: number, vcsBranch: string) =>
    ovhPut<void>(`${BASE}/${sn}/website/${websiteId}`, { vcsBranch }),

  // --- Deployment (from git-deployment.service.js) ---

  // Deploy website (with optional reset)
  deployWebsite: (sn: string, websiteId: number, reset = false) =>
    ovhPost<{ taskId: number }>(`${BASE}/${sn}/website/${websiteId}/deploy`, { reset }),

  // --- Removal (from git-removal.service.js) ---

  // Delete website / git association (with optional deleteFiles)
  deleteWebsite: (sn: string, websiteId: number, deleteFiles = false) =>
    ovhDelete<void>(`${BASE}/${sn}/website/${websiteId}?deleteFiles=${deleteFiles}`),

  // --- Helper: Full Git association flow ---

  // Associate Git repository to a domain path
  associateGitRepository: async (
    sn: string,
    path: string,
    vcsUrl: string,
    vcsBranch: string
  ) => {
    // 1. Create website with VCS
    const website = await multisiteService.createWebsiteWithVcs(sn, {
      path,
      vcsUrl,
      vcsBranch,
    });

    // 2. Get webhook URLs
    const vcsType = vcsUrl.includes("github.com") ? "github" :
                    vcsUrl.includes("gitlab.com") ? "gitlab" :
                    vcsUrl.includes("bitbucket.org") ? "bitbucket" : "github";

    const webhooks = await multisiteService.getVcsWebhookUrls(sn, path, vcsType).catch(() => null);

    return {
      websiteId: website.id,
      webhooks,
    };
  },

  // Remove Git association from a domain
  removeGitAssociation: async (sn: string, path: string, deleteFiles = false) => {
    const vcsInfo = await multisiteService.getVcsInformations(sn, path);
    if (!vcsInfo) {
      throw new Error("No Git association found for this path");
    }
    return multisiteService.deleteWebsite(sn, vcsInfo.id, deleteFiles);
  },

  // Deploy from Git
  deployFromGit: async (sn: string, path: string, reset = false) => {
    const vcsInfo = await multisiteService.getVcsInformations(sn, path);
    if (!vcsInfo) {
      throw new Error("No Git association found for this path");
    }
    return multisiteService.deployWebsite(sn, vcsInfo.id, reset);
  },
};

export default multisiteService;
