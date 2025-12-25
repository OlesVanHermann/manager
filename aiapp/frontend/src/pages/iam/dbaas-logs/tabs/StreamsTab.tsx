// ============================================================
// STREAMS TAB - Gestion des streams Graylog
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as streamsService from "./StreamsTab";
import type { Stream } from "../dbaas-logs.types";
import "./StreamsTab.css";

interface StreamsTabProps {
  serviceId: string;
}

export default function StreamsTab({ serviceId }: StreamsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
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
    if (!confirm(t("streams.confirmDelete"))) return;
    try { await streamsService.deleteStream(serviceId, streamId); loadStreams(); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
  };

  if (loading) return <div className="streams-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="streams-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadStreams}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="streams-tab">
      <div className="streams-toolbar">
        <h2>{t("streams.title")}</h2>
        <button className="btn btn-primary">{t("streams.create")}</button>
      </div>
      {streams.length === 0 ? (
        <div className="streams-empty-state"><h2>{t("streams.empty.title")}</h2><p>{t("streams.empty.description")}</p></div>
      ) : (
        <div className="streams-list">
          {streams.map((stream) => (
            <div key={stream.streamId} className="streams-card">
              <div className="streams-card-header">
                <div>
                  <div className="streams-title">{stream.title}</div>
                  <div className="streams-id">{stream.streamId}</div>
                </div>
                <div className="streams-actions">
                  <button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button>
                  <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(stream.streamId)}>{tCommon("actions.delete")}</button>
                </div>
              </div>
              {stream.description && <p className="streams-description">{stream.description}</p>}
              <div className="streams-details">
                <div className="streams-detail-item"><span className="streams-detail-label">{t("streams.fields.indexing")}</span><span className="streams-detail-value">{stream.indexingEnabled ? "✅ Activé" : "❌ Désactivé"}</span></div>
                <div className="streams-detail-item"><span className="streams-detail-label">{t("streams.fields.websocket")}</span><span className="streams-detail-value">{stream.webSocketEnabled ? "✅ Activé" : "❌ Désactivé"}</span></div>
                <div className="streams-detail-item"><span className="streams-detail-label">{t("streams.fields.created")}</span><span className="streams-detail-value">{new Date(stream.createdAt).toLocaleDateString("fr-FR")}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
