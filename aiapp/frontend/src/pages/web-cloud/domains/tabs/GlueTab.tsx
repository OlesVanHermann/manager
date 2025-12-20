// ============================================================
// TAB: GLUE RECORDS - Enregistrements Glue
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, GlueRecord } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

/** Onglet Glue Records du domaine. */
export function GlueTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");

  const [glues, setGlues] = useState<GlueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const hosts = await domainsService.listGlueRecords(domain);
        const details = await Promise.all(hosts.map((host) => domainsService.getGlueRecord(domain, host)));
        setGlues(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

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
    <div className="glue-tab">
      <div className="tab-header">
        <div>
          <h3>{t("glue.title")}</h3>
          <p className="tab-description">{t("glue.description")}</p>
        </div>
      </div>

      {glues.length === 0 ? (
        <div className="empty-state">
          <h3>{t("glue.empty")}</h3>
          <p className="hint">{t("glue.emptyHint")}</p>
        </div>
      ) : (
        <div className="glue-cards">
          {glues.map((glue) => (
            <div key={glue.host} className="glue-card">
              <h4>{glue.host}</h4>
              <div className="glue-ips">
                {glue.ips.map((ip, i) => (
                  <div key={i} className="glue-ip">
                    <label>IP {i + 1}</label>
                    <span>{ip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>{t("glue.info")}</h4>
        <p>{t("glue.infoDesc")}</p>
      </div>
    </div>
  );
}

export default GlueTab;
