// ############################################################
// #  NETAPP/TASKS - SERVICE STRICTEMENT ISOLÉ                #
// ############################################################
import { ovhApi } from "../../../../../services/api";
import type { NetAppTask } from "../../netapp.types";

class TasksService {
  async getTasks(serviceId: string): Promise<NetAppTask[]> {
    return ovhApi.get<NetAppTask[]>(`/storage/netapp/${serviceId}/task`);
  }
}
export const tasksService = new TasksService();
