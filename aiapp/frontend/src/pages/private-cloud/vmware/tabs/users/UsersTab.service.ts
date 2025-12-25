import { ovhGet } from "../../../../../services/api";
import type { User } from "../../vmware.types";
export const usersService = {
  getUsers: async (serviceName: string): Promise<User[]> => {
    const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/user`);
    return Promise.all(ids.map((id) => ovhGet<User>(`/dedicatedCloud/${serviceName}/user/${id}`)));
  },
};
