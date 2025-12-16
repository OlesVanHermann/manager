// ============================================================
// SERVICE NETWORK - IP, vRack, CDN, Load Balancer
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES - IP
// ============================================================

export interface IpBlock {
  ip: string;
  canBeTerminated: boolean;
  country: string | null;
  description: string;
  organisationId: string | null;
  routedTo: { serviceName: string } | null;
  type: 'cdn' | 'cloud' | 'dedicated' | 'failover' | 'hosted_ssl' | 'housing' | 'loadBalancing' | 'mail' | 'overthebox' | 'pcc' | 'pci' | 'private' | 'vpn' | 'vps' | 'vrack' | 'xdsl';
}

export interface IpReverse {
  ipReverse: string;
  reverse: string;
}

export interface IpFirewall {
  enabled: boolean;
  ipOnFirewall: string;
  state: 'disableFirewallPending' | 'enableFirewallPending' | 'ok';
}

export interface IpMitigation {
  ipOnMitigation: string;
  permanent: boolean;
  state: 'creationPending' | 'ok' | 'removalPending';
  auto: boolean;
}

export interface IpTask {
  taskId: number;
  function: string;
  status: 'cancelled' | 'customerError' | 'doing' | 'done' | 'init' | 'ovhError' | 'todo';
  startDate: string;
  doneDate: string | null;
  lastUpdate: string;
  comment: string | null;
}

// ============================================================
// TYPES - VRACK
// ============================================================

export interface Vrack {
  name: string;
  description: string;
}

export interface VrackServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface VrackAllowedService {
  cloudProject: string[];
  dedicatedCloud: string[];
  dedicatedServer: string[];
  dedicatedServerInterface: string[];
  ip: string[];
  ipLoadbalancing: string[];
  legacyVrack: string[];
  ovhCloudConnect: string[];
}

export interface VrackTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'init' | 'todo';
  targetDomain: string | null;
  serviceName: string | null;
  orderId: number | null;
  lastUpdate: string;
  todoDate: string;
}

// ============================================================
// TYPES - LOAD BALANCER
// ============================================================

export interface IpLoadBalancing {
  serviceName: string;
  displayName: string | null;
  ipLoadbalancing: string;
  zone: string[];
  state: 'blacklisted' | 'deleted' | 'free' | 'ok' | 'quarantined' | 'suspended';
  vrackEligibility: boolean;
  vrackName: string | null;
  sslConfiguration: 'intermediate' | 'modern' | null;
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
  balance: 'first' | 'leastconn' | 'roundrobin' | 'source' | 'uri';
  stickiness: 'cookie' | 'none' | 'sourceIp';
  probe: { type: string; port: number | null; interval: number; url: string | null; method: string | null; match: string | null; pattern: string | null; forceSsl: boolean | null } | null;
}

export interface IpLoadBalancingServer {
  serverId: number;
  farmId: number;
  displayName: string | null;
  address: string;
  port: number | null;
  status: 'active' | 'inactive';
  proxyProtocolVersion: 'v1' | 'v2' | 'v2-ssl' | 'v2-ssl-cn' | null;
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

// ============================================================
// SERVICE
// ============================================================

class NetworkService {
  // ==================== IP ====================
  async listIps(): Promise<string[]> {
    return ovhApi.get<string[]>('/ip');
  }

  async getIp(ip: string): Promise<IpBlock> {
    return ovhApi.get<IpBlock>(`/ip/${encodeURIComponent(ip)}`);
  }

  async listReverses(ip: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/ip/${encodeURIComponent(ip)}/reverse`);
  }

  async getReverse(ip: string, ipReverse: string): Promise<IpReverse> {
    return ovhApi.get<IpReverse>(`/ip/${encodeURIComponent(ip)}/reverse/${encodeURIComponent(ipReverse)}`);
  }

  async setReverse(ip: string, ipReverse: string, reverse: string): Promise<IpReverse> {
    return ovhApi.post<IpReverse>(`/ip/${encodeURIComponent(ip)}/reverse`, { ipReverse, reverse });
  }

  async getFirewall(ip: string, ipOnFirewall: string): Promise<IpFirewall> {
    return ovhApi.get<IpFirewall>(`/ip/${encodeURIComponent(ip)}/firewall/${encodeURIComponent(ipOnFirewall)}`);
  }

  async getMitigation(ip: string, ipOnMitigation: string): Promise<IpMitigation> {
    return ovhApi.get<IpMitigation>(`/ip/${encodeURIComponent(ip)}/mitigation/${encodeURIComponent(ipOnMitigation)}`);
  }

  async listTasks(ip: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/ip/${encodeURIComponent(ip)}/task`);
  }

  async getTask(ip: string, taskId: number): Promise<IpTask> {
    return ovhApi.get<IpTask>(`/ip/${encodeURIComponent(ip)}/task/${taskId}`);
  }

  // ==================== VRACK ====================
  async listVracks(): Promise<string[]> {
    return ovhApi.get<string[]>('/vrack');
  }

  async getVrack(serviceName: string): Promise<Vrack> {
    return ovhApi.get<Vrack>(`/vrack/${serviceName}`);
  }

  async getVrackServiceInfos(serviceName: string): Promise<VrackServiceInfos> {
    return ovhApi.get<VrackServiceInfos>(`/vrack/${serviceName}/serviceInfos`);
  }

  async getAllowedServices(serviceName: string): Promise<VrackAllowedService> {
    return ovhApi.get<VrackAllowedService>(`/vrack/${serviceName}/allowedServices`);
  }

  async listVrackDedicatedServers(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/vrack/${serviceName}/dedicatedServer`);
  }

  async listVrackCloudProjects(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/vrack/${serviceName}/cloudProject`);
  }

  async listVrackIpLoadbalancing(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/vrack/${serviceName}/ipLoadbalancing`);
  }

  async listVrackTasks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/vrack/${serviceName}/task`);
  }

  async getVrackTask(serviceName: string, taskId: number): Promise<VrackTask> {
    return ovhApi.get<VrackTask>(`/vrack/${serviceName}/task/${taskId}`);
  }

  // ==================== LOAD BALANCER ====================
  async listLoadBalancers(): Promise<string[]> {
    return ovhApi.get<string[]>('/ipLoadbalancing');
  }

  async getLoadBalancer(serviceName: string): Promise<IpLoadBalancing> {
    return ovhApi.get<IpLoadBalancing>(`/ipLoadbalancing/${serviceName}`);
  }

  async getLoadBalancerServiceInfos(serviceName: string): Promise<IpLoadBalancingServiceInfos> {
    return ovhApi.get<IpLoadBalancingServiceInfos>(`/ipLoadbalancing/${serviceName}/serviceInfos`);
  }

  // Farms
  async listFarms(serviceName: string, zone?: string): Promise<number[]> {
    let path = `/ipLoadbalancing/${serviceName}/http/farm`;
    if (zone) path += `?zone=${zone}`;
    return ovhApi.get<number[]>(path);
  }

  async getFarm(serviceName: string, farmId: number): Promise<IpLoadBalancingFarm> {
    return ovhApi.get<IpLoadBalancingFarm>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}`);
  }

  // Servers
  async listServers(serviceName: string, farmId: number): Promise<number[]> {
    return ovhApi.get<number[]>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}/server`);
  }

  async getServer(serviceName: string, farmId: number, serverId: number): Promise<IpLoadBalancingServer> {
    return ovhApi.get<IpLoadBalancingServer>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}/server/${serverId}`);
  }

  // Frontends
  async listFrontends(serviceName: string, zone?: string): Promise<number[]> {
    let path = `/ipLoadbalancing/${serviceName}/http/frontend`;
    if (zone) path += `?zone=${zone}`;
    return ovhApi.get<number[]>(path);
  }

  async getFrontend(serviceName: string, frontendId: number): Promise<IpLoadBalancingFrontend> {
    return ovhApi.get<IpLoadBalancingFrontend>(`/ipLoadbalancing/${serviceName}/http/frontend/${frontendId}`);
  }

  // Actions
  async refreshLoadBalancer(serviceName: string, zone: string): Promise<void> {
    return ovhApi.post<void>(`/ipLoadbalancing/${serviceName}/refresh`, { zone });
  }
}

export const networkService = new NetworkService();
