import { ovhGet, ovhPost } from "../../../../services/api";
import type { IpAddress } from "../instances.types";

export function filterPublicIps(ipAddresses: IpAddress[]): IpAddress[] {
  return ipAddresses.filter(ip => ip.type === "public");
}

export function filterPrivateIps(ipAddresses: IpAddress[]): IpAddress[] {
  return ipAddresses.filter(ip => ip.type === "private");
}

export const networkService = { filterPublicIps, filterPrivateIps };
