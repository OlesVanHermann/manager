import { ovhGet } from "./api";
export interface NutanixCluster { serviceName: string; targetSpec?: { name: string; controlPanelURL: string; }; status: string; }
export async function getClusters(): Promise<string[]> { return ovhGet<string[]>("/nutanix"); }
export async function getCluster(serviceName: string): Promise<NutanixCluster> { return ovhGet<NutanixCluster>(`/nutanix/${serviceName}`); }
