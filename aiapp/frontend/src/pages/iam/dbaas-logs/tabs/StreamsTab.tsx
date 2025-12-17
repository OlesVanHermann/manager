// ============================================================
// STREAMS TAB - Gestion des streams Graylog
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.dbaas-logs";

// ============================================================
// TYPES
// ============================================================

interface Stream {
  streamId: string;
  title: string;
  description?: string;
  retentionId: string;
  indexingEnabled: boolean;
  webSocketEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StreamsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des streams de logs Graylog. */
export default function StreamsTab({ serviceId }: StreamsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadStreams();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadStreams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsService.getStreams(serviceId);
      setStreams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDelete = async (streamId: string) => {
    if (!confirm(t("streams.confirmDelete"))) return;
    try {
      await logsService.deleteStream(serviceId, streamId);
      loadStreams();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadStreams}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="streams-tab">
      <div className="tab-toolbar">
        <h2>{t("streams.title")}</h2>
        <button className="btn btn-primary">{t("streams.create")}</button>
      </div>

      {streams.length === 0 ? (
        <div className="empty-state">
          <h2>{t("streams.empty.title")}</h2>
          <p>{t("streams.empty.description")}</p>
        </div>
      ) : (
        <div className="streams-list">
          {streams.map((stream) => (
            <div key={stream.streamId} className="stream-card">
              <div className="stream-header">
                <div>
                  <div className="stream-title">{stream.title}</div>
                  <div className="stream-id">{stream.streamId}</div>
                </div>
                <div className="item-actions">
                  <button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button>
                  <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(stream.streamId)}>{tCommon("actions.delete")}</button>
                </div>
              </div>
              {stream.description && <p className="stream-description">{stream.description}</p>}
              <div className="stream-details">
                <div className="detail-item">
                  <span className="detail-label">{t("streams.fields.indexing")}</span>
                  <span className="detail-value">{stream.indexingEnabled ? "✅ Activé" : "❌ Désactivé"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t("streams.fields.websocket")}</span>
                  <span className="detail-value">{stream.webSocketEnabled ? "✅ Activé" : "❌ Désactivé"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t("streams.fields.created")}</span>
                  <span className="detail-value">{new Date(stream.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
