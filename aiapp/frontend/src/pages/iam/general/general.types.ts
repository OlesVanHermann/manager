/**
 * Types pour iam/general
 * NAV1: iam | NAV2: general
 */

export interface Identity {
  id: string;
  urn: string;
  type: 'user' | 'service_account' | 'group';
  displayName: string;
  email?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface Policy {
  id: string;
  name: string;
  description?: string;
  type: 'custom' | 'managed';
  permissions: string[];
  identities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  policies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  result: 'allowed' | 'denied';
  details?: Record<string, unknown>;
}

export interface TabProps {
  className?: string;
}
