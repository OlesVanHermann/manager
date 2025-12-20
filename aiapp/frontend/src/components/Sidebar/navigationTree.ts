// ============================================================
// NAVIGATION TREE - New Manager OVHcloud
// Structure: Univers → Sections → Sous-sections (NAV3)
// Labels via clés i18n (namespace: navigation)
// ============================================================

export interface NavNode {
  id: string;
  i18nKey: string;
  icon?: string;
  url?: string;
  external?: boolean;
}

export interface UniversSection {
  id: string;
  i18nKey: string;
  subsections?: NavNode[];
}

export interface Universe {
  id: string;
  i18nKey: string;
  shortI18nKey?: string;
  sections: UniversSection[];
}

// SVG paths for icons (Heroicons)
export const icons: Record<string, string> = {
  home: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  server: "M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z",
  cloud: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
  globe: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
};

// ============================================================
// UNIVERS DEFINITIONS
// ============================================================

export const universes: Universe[] = [
  // A) HOME
  {
    id: "home",
    i18nKey: "universes.home",
    sections: [
      { id: "home-dashboard", i18nKey: "sections.home.dashboard" },
      { id: "home-account", i18nKey: "sections.home.account" },
      { id: "home-billing", i18nKey: "sections.home.billing" },
      { id: "home-support", i18nKey: "sections.home.support" },
      { id: "home-carbon", i18nKey: "sections.home.carbon" },
      { id: "home-api", i18nKey: "sections.home.api" },
    ],
  },

  // B) PUBLIC CLOUD
  {
    id: "public-cloud",
    i18nKey: "universes.publicCloud",
    sections: [
      { id: "pci-home", i18nKey: "sections.publicCloud.home" },
      { id: "pci-project", i18nKey: "sections.publicCloud.project" },
      { id: "pci-instances", i18nKey: "sections.publicCloud.instances" },
      { id: "pci-block-storage", i18nKey: "sections.publicCloud.blockStorage" },
      { id: "pci-object-storage", i18nKey: "sections.publicCloud.objectStorage" },
      { id: "pci-databases", i18nKey: "sections.publicCloud.databases" },
      { id: "pci-kubernetes", i18nKey: "sections.publicCloud.kubernetes" },
      { id: "pci-registry", i18nKey: "sections.publicCloud.registry" },
      { id: "pci-ai", i18nKey: "sections.publicCloud.ai" },
      { id: "pci-load-balancer", i18nKey: "sections.publicCloud.loadBalancer" },
    ],
  },

  // C) PRIVATE CLOUD
  {
    id: "private-cloud",
    i18nKey: "universes.privateCloud",
    sections: [
      { id: "hpc-home", i18nKey: "sections.privateCloud.home" },
      { id: "hpc-vmware", i18nKey: "sections.privateCloud.vmware" },
      { id: "hpc-nutanix", i18nKey: "sections.privateCloud.nutanix" },
      { id: "hpc-sap", i18nKey: "sections.privateCloud.sap" },
    ],
  },

  // D) BARE METAL
  {
    id: "bare-metal",
    i18nKey: "universes.bareMetal",
    sections: [
      { id: "bm-home", i18nKey: "sections.bareMetal.home" },
      { id: "bm-dedicated", i18nKey: "sections.bareMetal.dedicated" },
      { id: "bm-vps", i18nKey: "sections.bareMetal.vps" },
      { id: "bm-nasha", i18nKey: "sections.bareMetal.nasha" },
      { id: "bm-netapp", i18nKey: "sections.bareMetal.netapp" },
      { id: "bm-housing", i18nKey: "sections.bareMetal.housing" },
    ],
  },

  // E) WEB CLOUD - 6 sections regroupées
  {
    id: "web-cloud",
    i18nKey: "universes.webCloud",
    sections: [
      { id: "web-home", i18nKey: "sections.webCloud.home" },
      { id: "web-domains-dns", i18nKey: "sections.webCloud.domainsDns" },
      { id: "web-hosting", i18nKey: "sections.webCloud.hosting" },
      { id: "web-emails", i18nKey: "sections.webCloud.emails" },
      { id: "web-voip", i18nKey: "sections.webCloud.voip" },
      { id: "web-access", i18nKey: "sections.webCloud.access" },
    ],
  },

  // F) NETWORK
  {
    id: "network",
    i18nKey: "universes.network",
    sections: [
      { id: "net-home", i18nKey: "sections.network.home" },
      { id: "net-ip", i18nKey: "sections.network.ip" },
      { id: "net-vrack", i18nKey: "sections.network.vrack" },
      { id: "net-lb", i18nKey: "sections.network.loadBalancer" },
      { id: "net-cdn", i18nKey: "sections.network.cdn" },
      { id: "net-cloud-connect", i18nKey: "sections.network.cloudConnect" },
      { id: "net-vrack-services", i18nKey: "sections.network.vrackServices" },
      { id: "net-security", i18nKey: "sections.network.security" },
    ],
  },

  // G) IAM
  {
    id: "iam",
    i18nKey: "universes.iam",
    sections: [
      { id: "iam-home", i18nKey: "sections.iam.home" },
      { id: "iam-secret", i18nKey: "sections.iam.secret" },
      { id: "iam-okms", i18nKey: "sections.iam.okms" },
      { id: "iam-hsm", i18nKey: "sections.iam.hsm" },
      { id: "iam-dbaas-logs", i18nKey: "sections.iam.dbaasLogs" },
      { id: "iam-metrics", i18nKey: "sections.iam.metrics" },
    ],
  },

  // H) LICENSE
  {
    id: "license",
    i18nKey: "universes.license",
    sections: [
      { id: "lic-home", i18nKey: "sections.license.home" },
    ],
  },
];

// Interface pour les ressources (chargées dynamiquement via API)
export interface Resource {
  id: string;
  name: string;
  type: string;
  status?: "ok" | "warning" | "error";
}
