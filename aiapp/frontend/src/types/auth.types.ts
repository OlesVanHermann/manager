export interface OvhCredentials {
  appKey: string;
  appSecret: string;
  consumerKey?: string;
}

export interface SupportLevel {
  level: "standard" | "premium" | "premium-accredited" | "business" | "enterprise";
}

export interface OvhAuth {
  account: string;
  method: "account" | "provider" | "user";
  user?: string;
  description?: string;
  roles: string[];
  identities: string[];
  allowedRoutes?: {
    method: string;
    path: string;
  }[] | null;
}

export interface OvhUser {
  nichandle: string;
  email: string;
  firstname: string;
  name: string;
  country: string;
  language: string;
  currency: {
    code: string;
    symbol: string;
  };
  // Champs etendus
  customerCode: string;
  organisation: string;
  supportLevel: SupportLevel;
  auth: OvhAuth;
  isTrusted: boolean;
  enterprise: boolean;
  state: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: OvhUser | null;
  credentials: OvhCredentials | null;
  error: string | null;
}

export interface CredentialResponse {
  validationUrl: string;
  consumerKey: string;
  state: string;
}
