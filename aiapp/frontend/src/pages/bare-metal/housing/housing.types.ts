export interface HousingInfo { name: string; datacenter: string; rack: string; networkBandwidth: number; }
export interface HousingTask { taskId: number; function: string; status: string; startDate: string; doneDate?: string; }
