import { apiClient } from "../../../../services/api";
import type { WordPressTask } from "../wordpress.types";

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export const tasksService = {
  async listTasks(serviceName: string): Promise<WordPressTask[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/task`, API_OPTIONS);
  },

  async getTask(serviceName: string, taskId: number): Promise<WordPressTask> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/task/${taskId}`, API_OPTIONS);
  },
};
