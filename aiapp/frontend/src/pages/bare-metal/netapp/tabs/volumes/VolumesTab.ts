import { ovhApi } from "../../../../../services/api";
import type { NetAppVolume } from "../../netapp.types";
class VolumesService { async getVolumes(serviceId: string): Promise<NetAppVolume[]> { return ovhApi.get<NetAppVolume[]>(`/storage/netapp/${serviceId}/share`); } }
export const volumesService = new VolumesService();
