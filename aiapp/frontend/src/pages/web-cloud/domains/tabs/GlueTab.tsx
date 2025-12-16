// ============================================================
// TAB: GLUE RECORDS - Enregistrements Glue
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, GlueRecord } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

/** Onglet Glue Records - Enregistrements pour serveurs DNS heberges. */
export function GlueTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const [glueRecords, setGlueRecords] = useState<GlueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const hosts = await domainsService.listGlueRecords(domain);
        const details = await Promise.all(hosts.map(host => domainsService.getGlueRecord(domain, host)));
        setGlueRecords(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="glue-tab">
      <div className="tab-header">
        <div>
          <h3>{t("glue.title")}</h3>
          <p className="tab-description">{t("glue.description")}</p>
        </div>
      </div>

      {glueRecords.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          <p>{t("glue.empty")}</p>
          <span className="empty-hint">{t("glue.emptyHint")}</span>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("glue.host")}</th>
              <th>{t("glue.ips")}</th>
            </tr>
          </thead>
          <tbody>
            {glueRecords.map(glue => (
              <tr key={glue.host}>
                <td className="font-mono">{glue.host}</td>
                <td className="font-mono">
                  {glue.ips.map((ip, idx) => (
                    <span key={idx} className="ip-badge">{ip}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="info-box">
        <h4>{t("glue.whatIs")}</h4>
        <p>{t("glue.explanation")}</p>
      </div>
    </div>
  );
}

export default GlueTab;
