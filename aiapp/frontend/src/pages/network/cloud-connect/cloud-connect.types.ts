// ============================================================
// CLOUD CONNECT - Types partagés (SEUL fichier partagé)
// ============================================================

export interface CloudConnectInfo {
  uuid: string;
  description?: string;
  status: string;
  bandwidth: number;
  pop: string;
  portSpeed: number;
}

export interface CloudConnectInterface {
  id: number;
  status: string;
  lightStatus: string;
}

export interface CloudConnectTask {
  id: number;
  function: string;
  status: string;
  startDate: string;
  doneDate?: string;
}
