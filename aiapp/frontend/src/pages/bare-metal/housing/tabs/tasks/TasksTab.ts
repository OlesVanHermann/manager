import { ovhApi } from "../../../../../services/api";
import type { HousingTask } from "../../housing.types";
class TasksService {
  async getTasks(serviceName: string): Promise<HousingTask[]> {
    const ids = await ovhApi.get<number[]>(`/dedicated/housing/${serviceName}/task`);
    return Promise.all(ids.slice(0, 50).map((id) => ovhApi.get<HousingTask>(`/dedicated/housing/${serviceName}/task/${id}`)));
  }
}
export const tasksService = new TasksService();
