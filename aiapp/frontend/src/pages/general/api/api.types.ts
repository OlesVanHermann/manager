// ============================================================
// API TYPES - Types partagés pour NAV2=api
// ============================================================

// ============ CREDENTIALS ============

export interface OvhCredentials {
  appKey: string;
  appSecret: string;
  consumerKey?: string;
}

// ============ USER ============

export interface OvhUser {
  nichandle: string;
  email: string;
  firstname: string;
  name: string;
  customerCode?: string;
  organisation?: string;
  isTrusted?: boolean;
  supportLevel?: {
    level: string;
  };
  auth?: {
    method: string;
  };
}

// ============ API HISTORY ============

export interface ApiHistoryItem {
  method: string;
  path: string;
  status: number;
}

// ============ DOC LINKS ============

export interface DocLink {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  category: "docs" | "tools" | "sdks" | "auth";
}
