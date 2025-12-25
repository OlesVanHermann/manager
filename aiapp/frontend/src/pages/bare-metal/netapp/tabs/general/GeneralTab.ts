import { ovhApi } from "../../../../../services/api";
import type { NetAppInfo } from "../../netapp.types";
class GeneralService { async getNetApp(id: string): Promise<NetAppInfo> { return ovhApi.get<NetAppInfo>(`/storage/netapp/${id}`); } }
export const generalService = new GeneralService();
