export interface NetAppInfo { id: string; name: string; region: string; status: string; performanceLevel: string; createdAt: string; }
export interface NetAppVolume { id: string; name: string; protocol: string; size: number; usedSize: number; status: string; mountPath: string; }
export interface NetAppSnapshot { id: string; name: string; volumeId: string; volumeName: string; createdAt: string; }
export interface NetAppTask { id: string; type: string; status: string; progress: number; createdAt: string; finishedAt?: string; }
