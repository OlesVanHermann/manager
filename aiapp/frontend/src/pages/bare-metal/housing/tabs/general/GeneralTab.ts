import { ovhApi } from "../../../../../services/api";
import type { HousingInfo } from "../../housing.types";
class GeneralService { async getHousing(id: string): Promise<HousingInfo> { return ovhApi.get<HousingInfo>(`/dedicated/housing/${id}`); } }
export const generalService = new GeneralService();
