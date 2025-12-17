// ============================================================
// DATA STREAMS - Gestion des souscriptions LDP
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.logs";
import type { LogType, LogSubscription } from "../../../../services/iam.logs";

interface DataStreamsProps {
  logType: LogType;
  kind: string;
  onGoBack: () => void;
}

export function DataStreams({ logType, kind, onGoBack }: DataStreamsProps) {
  const { t } = useTranslation("iam/logs");
  const { t: tc } = useTranslation("common");

  const [subscriptions, setSubscriptions] = useState<LogSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { loadSubscriptions(); }, [logType, kind]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true); setError(null);
      const data = await logsService.getSubscriptions(logType, kind);
      setSubscriptions(data);
    } catch (err) { setError(err instanceof Error ? err.message : t("errors.loadError")); }
    finally { setLoading(false); }
  };

  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      setDeletingId(subscriptionId);
      await logsService.deleteSubscription(logType, subscriptionId);
      setSubscriptions((prev) => prev.filter((s) => s.subscriptionId !== subscriptionId));
    } catch (err) { setError(err instanceof Error ? err.message : t("errors.unsubscribeError")); }
    finally { setDeletingId(null); }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="data-streams">
      <div className="data-streams-header">
        <button className="btn btn-secondary btn-sm" onClick={onGoBack}>← {t("dataStreams.back")}</button>
        <h3>{t("dataStreams.title")}</h3>
      </div>
      <div className="data-streams-description"><p>{t("dataStreams.description")}</p></div>
      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>{t("dataStreams.loading")}</p></div>
      ) : error ? (
        <div className="error-banner"><span>{error}</span><button onClick={loadSubscriptions} className="btn btn-sm btn-secondary">{tc("actions.retry")}</button></div>
      ) : subscriptions.length === 0 ? (
        <div className="empty-state"><h4>{t("dataStreams.empty.title")}</h4><p>{t("dataStreams.empty.description")}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr>
              <th>{t("dataStreams.columns.streamId")}</th>
              <th>{t("dataStreams.columns.service")}</th>
              <th>{t("dataStreams.columns.kind")}</th>
              <th>{t("dataStreams.columns.createdAt")}</th>
              <th>{t("dataStreams.columns.actions")}</th>
            </tr></thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.subscriptionId}>
                  <td className="text-mono">{sub.streamId}</td>
                  <td>{sub.serviceName}</td>
                  <td><span className="badge badge-neutral">{sub.kind}</span></td>
                  <td>{formatDate(sub.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-error btn-sm" onClick={() => handleUnsubscribe(sub.subscriptionId)} disabled={deletingId === sub.subscriptionId}>
                      {deletingId === sub.subscriptionId ? <span className="spinner-sm"></span> : t("dataStreams.unsubscribe")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="data-streams-footer"><button className="btn btn-outline btn-sm" onClick={loadSubscriptions}>{tc("actions.refresh")}</button></div>
    </div>
  );
}
