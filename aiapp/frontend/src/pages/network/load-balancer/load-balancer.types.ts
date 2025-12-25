// ============================================================
// LOAD BALANCER - Types partagés (extraits de network.ts)
// ============================================================

export interface IpLoadBalancing {
  serviceName: string;
  displayName: string | null;
  ipLoadbalancing: string;
  zone: string[];
  state: "blacklisted" | "deleted" | "free" | "ok" | "quarantined" | "suspended";
  vrackEligibility: boolean;
  vrackName: string | null;
  sslConfiguration: "intermediate" | "modern" | null;
  offer: string;
  orderableZone: { name: string; planCode: string }[];
}

export interface IpLoadBalancingServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface IpLoadBalancingFarm {
  farmId: number;
  displayName: string | null;
  zone: string;
  port: number | null;
  balance: "first" | "leastconn" | "roundrobin" | "source" | "uri";
  stickiness: "cookie" | "none" | "sourceIp";
  probe: { type: string; port: number | null; interval: number; url: string | null; method: string | null; match: string | null; pattern: string | null; forceSsl: boolean | null } | null;
}

export interface IpLoadBalancingServer {
  serverId: number;
  farmId: number;
  displayName: string | null;
  address: string;
  port: number | null;
  status: "active" | "inactive";
  proxyProtocolVersion: "v1" | "v2" | "v2-ssl" | "v2-ssl-cn" | null;
  weight: number | null;
  ssl: boolean;
  backup: boolean;
}

export interface IpLoadBalancingFrontend {
  frontendId: number;
  displayName: string | null;
  zone: string;
  port: string;
  ssl: boolean;
  defaultFarmId: number | null;
  dedicatedIpfo: string[];
  defaultSslId: number | null;
  disabled: boolean;
  hsts: boolean;
  httpHeader: string[];
  allowedSource: string[];
  deniedSource: string[];
}

export interface LbWithDetails {
  serviceName: string;
  details?: IpLoadBalancing;
  serviceInfos?: IpLoadBalancingServiceInfos;
  loading: boolean;
}
