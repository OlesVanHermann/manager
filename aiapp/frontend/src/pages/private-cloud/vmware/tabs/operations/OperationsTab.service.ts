import { ovhGet } from "../../../../../services/api";
import type { Operation } from "../../vmware.types";
export const operationsService = {
  getOperations: async (serviceName: string): Promise<Operation[]> => {
    const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/operation`);
    const ops = await Promise.all(ids.slice(0, 50).map((id) => ovhGet<Operation>(`/dedicatedCloud/${serviceName}/operation/${id}`)));
    return ops.sort((a, b) => new Date(b.startedOn).getTime() - new Date(a.startedOn).getTime());
  },
};
export const getOperationStateBadgeClass = (state: string): string => ({ done: "badge-success", doing: "badge-info", todo: "badge-warning", error: "badge-error", cancelled: "badge-secondary" })[state] || "";
