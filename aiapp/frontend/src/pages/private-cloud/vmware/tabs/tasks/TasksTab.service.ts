import { ovhGet } from "../../../../../services/api";
import type { Task } from "../../vmware.types";
export const tasksService = {
  getTasks: async (serviceName: string): Promise<Task[]> => {
    const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/task`);
    const tasks = await Promise.all(ids.slice(0, 50).map((id) => ovhGet<Task>(`/dedicatedCloud/${serviceName}/task/${id}`)));
    return tasks.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  },
};
export const getTaskStateBadgeClass = (state: string): string => ({ done: "badge-success", doing: "badge-info", todo: "badge-warning", error: "badge-error", cancelled: "badge-secondary" })[state] || "";
