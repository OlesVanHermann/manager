// ============================================================
// IP - Types isolés
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
