// ============================================================
// STREAMS TAB - Gestion des streams Graylog
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as streamsService from "./StreamsTab.service";
import type { Stream } from "../dbaas-logs.types";
import "./StreamsTab.css";

interface StreamsTabProps {
  serviceId: string;
}

export default function StreamsTab({ serviceId }: StreamsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/streams");
  const { t: tCommon } = useTranslation("common");

  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadStreams(); }, [serviceId]);

  const loadStreams = async () => {
    try {
      setLoading(true); setError(null);
      const data = await streamsService.getStreams(serviceId);
      setStreams(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (streamId: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try { await streamsService.deleteStream(serviceId, streamId); loadStreams(); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
  };

  if (loading) return <div className="dbaas-logs-streams-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="dbaas-logs-streams-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadStreams}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="dbaas-logs-streams-tab">
      <div className="dbaas-logs-streams-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>
      {streams.length === 0 ? (
        <div className="dbaas-logs-streams-empty-state"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>
      ) : (
        <div className="dbaas-logs-streams-list">
          {streams.map((stream) => (
            <div key={stream.streamId} className="dbaas-logs-streams-card">
              <div className="dbaas-logs-streams-card-header">
                <div>
                  <div className="dbaas-logs-streams-title">{stream.title}</div>
                  <div className="dbaas-logs-streams-id">{stream.streamId}</div>
                </div>
                <div className="dbaas-logs-streams-actions">
                  <button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button>
                  <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(stream.streamId)}>{tCommon("actions.delete")}</button>
                </div>
              </div>
              {stream.description && <p className="dbaas-logs-streams-description">{stream.description}</p>}
              <div className="dbaas-logs-streams-details">
                <div className="dbaas-logs-streams-detail-item"><span className="dbaas-logs-streams-detail-label">{t("fields.indexing")}</span><span className="dbaas-logs-streams-detail-value">{stream.indexingEnabled ? "✅ Activé" : "❌ Désactivé"}</span></div>
                <div className="dbaas-logs-streams-detail-item"><span className="dbaas-logs-streams-detail-label">{t("fields.websocket")}</span><span className="dbaas-logs-streams-detail-value">{stream.webSocketEnabled ? "✅ Activé" : "❌ Désactivé"}</span></div>
                <div className="dbaas-logs-streams-detail-item"><span className="dbaas-logs-streams-detail-label">{t("fields.created")}</span><span className="dbaas-logs-streams-detail-value">{new Date(stream.createdAt).toLocaleDateString("fr-FR")}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
