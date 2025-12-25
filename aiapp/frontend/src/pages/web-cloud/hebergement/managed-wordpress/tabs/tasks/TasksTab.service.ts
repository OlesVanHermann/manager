import { apiClient } from "../../../../../../services/api";
import type { ManagedWordPressTask } from "../../managed-wordpress.types";

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export const tasksService = {
  async listTasks(serviceName: string): Promise<ManagedWordPressTask[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/task`, API_OPTIONS);
  },

  async getTask(serviceName: string, taskId: number): Promise<ManagedWordPressTask> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/task/${taskId}`, API_OPTIONS);
  },
};
