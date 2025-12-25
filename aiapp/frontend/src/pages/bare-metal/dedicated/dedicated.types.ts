// ============================================================
// DEDICATED TYPES - Types partagés pour tous les tabs Dedicated
// ============================================================

export interface DedicatedServer {
  name: string;
  commercialRange: string;
  datacenter: string;
  ip: string;
  linkSpeed: number;
  os: string;
  professionalUse: boolean;
  rack: string;
  region: string;
  rescueMail: string | null;
  reverse: string;
  rootDevice: string | null;
  serverId: number;
  state: "error" | "hacked" | "hackedBlocked" | "ok";
  supportLevel: "critical" | "fastpath" | "gs" | "pro" | "technic";
  bootId: number | null;
  monitoring: boolean;
  newUpgradeSystem: boolean;
  noIntervention: boolean;
  powerState: "poweroff" | "poweron";
}

export interface DedicatedServerServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface DedicatedServerHardware {
  bootMode: "legacy" | "uefi" | "uefiLegacy";
  coresPerProcessor: number;
  defaultHardwareRaidSize: { unit: string; value: number } | null;
  defaultHardwareRaidType: string | null;
  description: string | null;
  diskGroups: {
    defaultHardwareRaidSize: { unit: string; value: number } | null;
    defaultHardwareRaidType: string | null;
    description: string;
    diskGroupId: number;
    diskSize: { unit: string; value: number };
    diskType: string;
    numberOfDisks: number;
    raidController: string | null;
  }[];
  expansionCards: { description: string; type: string }[] | null;
  formFactor: string;
  memorySize: { unit: string; value: number };
  motherboard: string;
  numberOfProcessors: number;
  processorArchitecture: string;
  processorName: string;
  threadsPerProcessor: number;
  usbKeys: { unit: string; value: number }[] | null;
}

export interface DedicatedServerVrack {
  vrack: string;
  state: "activating" | "inMaintenance" | "ok";
}

export interface DedicatedServerIpmi {
  activated: boolean;
  supportedFeatures: { kvmoverip: boolean; serialOverLanSshKey: boolean; serialOverLanUrl: boolean };
}

export interface DedicatedServerTask {
  taskId: number;
  function: string;
  status: "cancelled" | "customerError" | "doing" | "done" | "init" | "ovhError" | "todo";
  startDate: string;
  doneDate: string | null;
  lastUpdate: string;
  comment: string | null;
}

export interface DedicatedServerIntervention {
  interventionId: number;
  date: string;
  type: string;
}
