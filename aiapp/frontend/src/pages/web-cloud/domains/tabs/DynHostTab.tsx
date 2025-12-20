// ============================================================
// TAB: DYNHOST - DNS dynamique
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DynHostRecord } from "../../../../services/web-cloud.domains";

interface Props {
  zoneName: string;
}

/** Onglet DynHost - DNS dynamique. */
export function DynHostTab({ zoneName }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");

  const [records, setRecords] = useState<DynHostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const ids = await domainsService.listDynHostRecords(zoneName);
        const details = await Promise.all(ids.map((id) => domainsService.getDynHostRecord(zoneName, id)));
        setRecords(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [zoneName]);

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dynhost-tab">
      <div className="tab-header">
        <div>
          <h3>{t("dynhost.title")}</h3>
          <p className="tab-description">{t("dynhost.description")}</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <h3>{t("dynhost.empty")}</h3>
          <p className="hint">{t("dynhost.emptyHint")}</p>
        </div>
      ) : (
        <div className="dynhost-cards">
          {records.map((record) => (
            <div key={record.id} className="dynhost-card">
              <div className="dynhost-header">
                <h4>{record.subDomain}.{zoneName}</h4>
                <span className="badge success">Actif</span>
              </div>
              <div className="dynhost-info">
                <label>{t("dynhost.ip")}</label>
                <span>{record.ip}</span>
                <label>{t("dynhost.zone")}</label>
                <span>{record.zone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>{t("dynhost.info")}</h4>
        <p>{t("dynhost.infoDesc")}</p>
      </div>
    </div>
  );
}

export default DynHostTab;
