// ============================================================
// DNS ZONES TAB: HISTORY - Historique de la zone
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dnsZonesService } from "../../../../services/dns-zones.service";

interface Props { zoneName: string; }

export function HistoryTab({ zoneName }: Props) {
  const { t } = useTranslation("web-cloud/dns-zones/index");
  const { t: tCommon } = useTranslation("common");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await dnsZonesService.listHistory(zoneName); setHistory(data); }
      catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [zoneName]);

  const handleRestore = async (createdAt: string) => {
    if (!confirm(t("history.confirmRestore"))) return;
    try { setRestoring(createdAt); await dnsZonesService.restoreHistory(zoneName, createdAt); alert(t("history.restored")); }
    catch (err) { setError(String(err)); }
    finally { setRestoring(null); }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="history-tab">
      <div className="tab-header"><h3>{t("history.title")}</h3><p className="tab-description">{t("history.description")}</p></div>
      {history.length === 0 ? (
        <div className="empty-state"><p>{t("history.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("history.date")}</th><th>{t("history.actions")}</th></tr></thead>
          <tbody>
            {history.map(h => (
              <tr key={h}>
                <td>{new Date(h).toLocaleString()}</td>
                <td><button className="btn-small" onClick={() => handleRestore(h)} disabled={restoring === h}>{restoring === h ? tCommon("loading") : t("history.restore")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="info-box"><h4>{t("history.info")}</h4><p>{t("history.infoDesc")}</p></div>
    </div>
  );
}

export default HistoryTab;
