// ============================================================
// TAB: HISTORY - Historique de la zone DNS
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dnsZonesService } from "../../../../services/web-cloud.dns-zones";

interface Props {
  zoneName: string;
}

/** Onglet Historique - Versions de la zone DNS. */
export function HistoryTab({ zoneName }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const dates = await dnsZonesService.listHistory(zoneName);
        setHistory(dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()));
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [zoneName]);

  const handleRestore = async (createdAt: string) => {
    if (!confirm(t("history.confirmRestore"))) return;
    try {
      setRestoring(createdAt);
      await dnsZonesService.restoreHistory(zoneName, createdAt);
      alert(t("history.restored"));
    } catch (err) {
      alert(String(err));
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="history-tab">
      <div className="tab-header">
        <div>
          <h3>{t("history.title")}</h3>
          <p className="tab-description">{t("history.description")}</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <h3>{t("history.empty")}</h3>
        </div>
      ) : (
        <div className="history-timeline">
          {history.map((date, index) => (
            <div key={date} className="history-item">
              <div className="history-dot" />
              <div className="history-content">
                <div>
                  <div className="history-date">{formatDate(date)}</div>
                  {index === 0 && <span className="badge success">Actuelle</span>}
                </div>
                {index > 0 && (
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => handleRestore(date)}
                    disabled={restoring === date}
                  >
                    {restoring === date ? tCommon("loading") : t("history.restore")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>{t("history.info")}</h4>
        <p>{t("history.infoDesc")}</p>
      </div>
    </div>
  );
}

export default HistoryTab;
