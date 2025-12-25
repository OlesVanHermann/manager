// ============================================================
// STREAMS TAB SERVICE - Service API isolé pour l'onglet Streams
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Stream } from "../dbaas-logs.types";

// ============================================================
// API STREAMS
// ============================================================

/** Récupère la liste des streams d'un service. */
export async function getStreams(serviceName: string): Promise<Stream[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/graylog/stream`);
  const streams = await Promise.all(
    ids.map((id) => ovhGet<Stream>(`/dbaas/logs/${serviceName}/output/graylog/stream/${id}`))
  );
  return streams;
}

/** Crée un nouveau stream. */
export async function createStream(
  serviceName: string,
  data: { title: string; description?: string; retentionId: string }
): Promise<Stream> {
  return ovhPost<Stream>(`/dbaas/logs/${serviceName}/output/graylog/stream`, data);
}

/** Supprime un stream. */
export async function deleteStream(serviceName: string, streamId: string): Promise<void> {
  return ovhDelete(`/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`);
}

// ============================================================
// SERVICE OBJECT
// ============================================================

export const streamsService = {
  getStreams,
  createStream,
  deleteStream,
};
