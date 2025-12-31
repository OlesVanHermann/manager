// ============================================================
// TYPES CONNECTIONS - Types isolés pour Connexions Internet
// ============================================================

// Types de technologie de connexion
export type TechType = 'ADSL' | 'ADSL2+' | 'VDSL2' | 'FTTH' | 'FTTO' | 'FTTE' | '4G/LTE' | '5G' | 'SAT';

// Types d'offres commerciales
export type OfferType = 'access-only' | 'pack-perso' | 'pack-pro' | 'pack-business' | 'custom';

// Statut connexion
export type ConnectionStatus = 'connected' | 'disconnected' | 'syncing' | 'pending';

// Type de modem
export type ModemType = 'ovh' | 'custom';

// ============================================================
// INTERFACES PRINCIPALES
// ============================================================

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Modem {
  id: string;
  name: string;
  type: ModemType;
  brand?: string;
  model?: string;
  serial?: string;
  mac?: string;
  firmware?: string;
  uptime?: string;
  lastReboot?: string;
  wanIp?: string;
  lanIp?: string;
  connectedDevices?: number;
  managed: boolean;
}

export interface Service {
  id: string;
  type: 'domain' | 'email' | 'voip' | 'hosting';
  name: string;
  status: 'active' | 'suspended';
  count?: number;
}

export interface Option {
  id: string;
  type: 'fixed-ip' | 'ipv6' | 'gtr' | 'backup-4g' | 'anti-ddos' | 'qos';
  label: string;
  active: boolean;
  price?: number;
}

export interface Billing {
  amount: number;
  currency: string;
  period: 'monthly' | 'yearly';
  nextBilling: string;
  engagement?: string;
}

export interface Connection {
  id: string;
  name: string;
  techType: TechType;
  offerType: OfferType;
  offerLabel: string;
  status: ConnectionStatus;
  address: Address;
  modem: Modem | null;
  services: Service[];
  options: Option[];
  billing: Billing;
  downSpeed: number;
  upSpeed: number;
  maxDownSpeed: number;
  maxUpSpeed: number;
  connectedSince: string;
  lastSync: string;
  otbId: string | null;
  nro?: string;
  gtr?: string;
}

// ============================================================
// TYPES LIGNE
// ============================================================

export interface LineStatus {
  status: ConnectionStatus;
  ipv4: string;
  ipv6?: string;
  gateway: string;
  dns: string[];
  downSpeed: number;
  upSpeed: number;
  maxDownSpeed: number;
  maxUpSpeed: number;
  attenuation: number;
  noiseMargin: number;
  crcErrors: number;
  fecErrors?: number;
  lastSync: string;
  connectedSince: string;
  nro: string;
  lineType?: string;
  distance?: number;
}

export interface LineDiagnostic {
  id: string;
  date: string;
  status: 'running' | 'completed' | 'failed';
  latency?: number;
  packetLoss?: number;
  lineProfile?: string;
  downSpeed?: number;
  upSpeed?: number;
  tests?: DiagnosticTest[];
  results?: DiagnosticResult[];
}

export interface DiagnosticTest {
  test: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

export interface DiagnosticResult {
  test: string;
  status: 'ok' | 'warning' | 'error';
  value: string;
  expected?: string;
}

export interface LineStats {
  period: string;
  connectedDays?: number;
  bandwidth?: BandwidthPoint[];
  uptime?: UptimeStats;
  events?: EventsStats;
  data?: StatPoint[];
}

export interface BandwidthPoint {
  label: string;
  down: number;
  up: number;
}

export interface UptimeStats {
  percentage: number;
  availableMinutes: number;
  unavailableMinutes: number;
}

export interface EventsStats {
  resyncCount: number;
  disconnectCount: number;
  lastResync?: string;
  lastDisconnect?: string;
  history?: EventHistory[];
}

export interface EventHistory {
  date: string;
  type: 'resync' | 'disconnect' | 'connect';
  duration?: number;
}

export interface StatPoint {
  timestamp: string;
  downSpeed: number;
  upSpeed: number;
  uptime: boolean;
}

export interface LineAlert {
  id: string;
  type: 'disconnect' | 'resync' | 'quality' | 'incident' | 'ip_change';
  channel: 'email' | 'sms';
  recipient: string;
  status: 'active' | 'paused' | 'disabled';
}

// ============================================================
// TYPES MODEM OVH
// ============================================================

export interface ModemWifi {
  enabled24: boolean;
  ssid24: string;
  password24: string;
  channel24: number | 'auto';
  enabled5: boolean;
  ssid5: string;
  password5: string;
  channel5: number | 'auto';
  security: 'WPA2' | 'WPA3' | 'WPA2/WPA3';
  connectedDevices: number;
}

export interface ModemDhcp {
  enabled: boolean;
  rangeStart: string;
  rangeEnd: string;
  leaseTime: number;
  leases: DhcpLease[];
  staticLeases: StaticLease[];
}

export interface StaticLease {
  name: string;
  mac: string;
  ip: string;
}

export interface DhcpLease {
  id: string;
  mac: string;
  ip: string;
  hostname: string;
  reserved: boolean;
  expires?: string;
}

export interface ModemNatRule {
  id: string;
  name: string;
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  externalPort: number;
  internalIp: string;
  internalPort: number;
  enabled: boolean;
}

export interface ModemRouter {
  mode: 'router' | 'bridge';
  dmzEnabled: boolean;
  dmzIp?: string;
  firewallEnabled: boolean;
  upnpEnabled: boolean;
}

export interface ModemDns {
  primary: string;
  secondary: string;
}

export interface ModemMtu {
  size: number;
}

// ============================================================
// TYPES MODEM PERSO
// ============================================================

export interface ModemCustom {
  brand: string;
  model: string;
  mac: string;
}

export interface ModemCredentials {
  mode: 'PPPoE' | 'DHCP';
  username: string;
  password: string;
  vlan?: number;
}

export interface ModemGuide {
  brand: string;
  model: string;
  url: string;
}

// ============================================================
// TYPES SERVICES / VOIP / OPTIONS
// ============================================================

export interface VoipLine {
  id: string;
  number: string;
  status: 'active' | 'suspended';
  type: 'line' | 'fax';
}

export interface EcoFax {
  enabled: boolean;
  email: string;
  number?: string;
}

export interface AvailableOption {
  id: string;
  type: string;
  label: string;
  description: string;
  price: number;
  period: 'monthly' | 'one-time';
}

// ============================================================
// TYPES TACHES
// ============================================================

export interface Task {
  id: string;
  type: string;
  status: 'todo' | 'doing' | 'done' | 'error';
  createdAt: string;
  updatedAt: string;
  progress?: number;
  comment?: string;
}
