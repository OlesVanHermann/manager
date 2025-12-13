// ============================================================
// NAVIGATION TREE - New Manager OVHcloud
// Structure: Univers → Sections → Sous-sections (NAV3)
// ============================================================

export interface NavNode {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: string;
  url?: string;
  external?: boolean;
}

export interface UniversSection {
  id: string;
  label: string;
  subsections?: NavNode[];
}

export interface Universe {
  id: string;
  label: string;
  shortLabel?: string;
  sections: UniversSection[];
}

// SVG paths for icons (Heroicons)
export const icons: Record<string, string> = {
  home: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  server: "M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z",
  cloud: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
  globe: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  list: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z",
  grid: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  chevronLeft: "M15.75 19.5L8.25 12l7.5-7.5",
  chevronRight: "M8.25 4.5l7.5 7.5-7.5 7.5",
  chevronDown: "M19.5 8.25l-7.5 7.5-7.5-7.5",
  user: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  cog: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
  ellipsis: "M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
};

// ============================================================
// UNIVERS DEFINITIONS
// ============================================================

export const universes: Universe[] = [
  // ============================================================
  // A) HOME - Fonctionnalités transverses
  // ============================================================
  {
    id: "home",
    label: "HOME",
    shortLabel: "Home",
    sections: [
      // 1) Accueil
      {
        id: "home-dashboard",
        label: "Accueil",
      },
      // 2) Compte
      {
        id: "home-account",
        label: "Compte",
        subsections: [
          { id: "account-info", label: "Informations générales" },
          { id: "account-edit", label: "Éditer mon compte" },
          { id: "account-security", label: "Sécurité" },
          { id: "account-gdpr", label: "Données personnelles" },
          { id: "account-advanced", label: "Paramètres avancés" },
          { id: "account-contacts-services", label: "Mes services (gestion de contacts)" },
          { id: "account-contacts-requests", label: "Mes demandes (gestion de contacts)" },
        ],
      },
      // 3) Facturation
      {
        id: "home-billing",
        label: "Facturation",
        subsections: [
          { id: "billing-services", label: "Mes services" },
          { id: "billing-invoices", label: "Factures" },
          { id: "billing-refunds", label: "Avoirs" },
          { id: "billing-payments", label: "Paiement" },
          { id: "billing-orders", label: "Commandes" },
          { id: "billing-references", label: "Mes références internes" },
          { id: "billing-methods", label: "Moyens de paiement" },
          { id: "billing-prepaid", label: "Compte prépayé" },
          { id: "billing-vouchers", label: "Bon d'achat" },
          { id: "billing-fidelity", label: "Points de fidélité" },
          { id: "billing-contracts", label: "Contrats" },
        ],
      },
      // 4) Support
      {
        id: "home-support",
        label: "Support",
        subsections: [
          { id: "support-tickets", label: "Mes tickets" },
          { id: "support-create", label: "Créer un nouveau ticket" },
          { id: "support-level", label: "Mon niveau de support" },
          { id: "support-communications", label: "Mes communications" },
          { id: "support-broadcast", label: "Paramètres de diffusion" },
        ],
      },
      // 5) Carbone
      {
        id: "home-carbon",
        label: "Carbone",
      },
      // 6) Playground API
      {
        id: "home-api",
        label: "Playground API",
        subsections: [
          { id: "api-console", label: "API" },
          { id: "api-advanced", label: "Paramètres avancés" },
        ],
      },
    ],
  },

  // ============================================================
  // B) PUBLIC CLOUD
  // ============================================================
  {
    id: "public-cloud",
    label: "PUBLIC CLOUD",
    shortLabel: "Public",
    sections: [
      { id: "pci-home", label: "Accueil" },
      {
        id: "pci-instances",
        label: "Instances",
        subsections: [
          { id: "pci-instances-list", label: "Liste" },
          { id: "pci-instances-create", label: "Créer" },
        ],
      },
      {
        id: "pci-storage",
        label: "Storage",
        subsections: [
          { id: "pci-block", label: "Block Storage" },
          { id: "pci-object", label: "Object Storage" },
          { id: "pci-archive", label: "Cold Archive" },
        ],
      },
      { id: "pci-network", label: "Network" },
      { id: "pci-databases", label: "Databases" },
      { id: "pci-ai", label: "AI & ML" },
    ],
  },

  // ============================================================
  // C) PRIVATE CLOUD
  // ============================================================
  {
    id: "private-cloud",
    label: "PRIVATE CLOUD",
    shortLabel: "Private",
    sections: [
      { id: "hpc-home", label: "Accueil" },
      { id: "hpc-vmware", label: "VMware" },
      { id: "hpc-nutanix", label: "Nutanix" },
      { id: "hpc-sap", label: "SAP HANA" },
    ],
  },

  // ============================================================
  // D) BARE METAL
  // ============================================================
  {
    id: "bare-metal",
    label: "BARE METAL",
    shortLabel: "Bare Metal",
    sections: [
      { id: "bm-home", label: "Accueil" },
      {
        id: "bm-dedicated",
        label: "Serveurs dédiés",
        subsections: [
          { id: "bm-dedicated-list", label: "Mes serveurs" },
          { id: "bm-dedicated-order", label: "Commander" },
        ],
      },
      {
        id: "bm-vps",
        label: "VPS",
        subsections: [
          { id: "bm-vps-list", label: "Mes VPS" },
          { id: "bm-vps-order", label: "Commander" },
        ],
      },
      { id: "bm-managed", label: "Managed Bare Metal" },
    ],
  },

  // ============================================================
  // E) WEB CLOUD
  // ============================================================
  {
    id: "web-cloud",
    label: "WEB CLOUD",
    shortLabel: "Web",
    sections: [
      { id: "web-home", label: "Accueil" },
      {
        id: "web-domains",
        label: "Domaines",
        subsections: [
          { id: "web-domains-list", label: "Mes domaines" },
          { id: "web-domains-dns", label: "Zones DNS" },
        ],
      },
      {
        id: "web-hosting",
        label: "Hébergements",
        subsections: [
          { id: "web-hosting-list", label: "Mes hébergements" },
          { id: "web-hosting-db", label: "Bases de données" },
        ],
      },
      {
        id: "web-emails",
        label: "Emails",
        subsections: [
          { id: "web-emails-domain", label: "Email domain" },
          { id: "web-emails-pro", label: "Email Pro" },
          { id: "web-emails-exchange", label: "Exchange" },
        ],
      },
    ],
  },

  // ============================================================
  // F) NETWORK
  // ============================================================
  {
    id: "network",
    label: "NETWORK",
    shortLabel: "Network",
    sections: [
      { id: "net-home", label: "Accueil" },
      { id: "net-ip", label: "IP" },
      { id: "net-vrack", label: "vRack" },
      { id: "net-lb", label: "Load Balancer" },
      { id: "net-cdn", label: "CDN" },
    ],
  },

  // ============================================================
  // G) IAM - Identity & Access Management
  // ============================================================
  {
    id: "iam",
    label: "IAM",
    shortLabel: "IAM",
    sections: [
      {
        id: "iam-home",
        label: "Accueil",
        subsections: [
          { id: "iam-identities", label: "Identités" },
          { id: "iam-policies", label: "Politiques" },
          { id: "iam-groups", label: "Groupes" },
          { id: "iam-logs", label: "Logs" },
        ],
      },
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
