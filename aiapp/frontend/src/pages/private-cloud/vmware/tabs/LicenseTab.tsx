import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface License { name: string; edition: string; version: string; licenseKey: string; }
interface LicenseTabProps { serviceId: string; }

export default function LicenseTab({ serviceId }: LicenseTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadLicenses(); }, [serviceId]);

  const loadLicenses = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getLicenses(serviceId); setLicenses(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadLicenses}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="license-tab">
      <div className="tab-toolbar"><h2>{t("license.title")}</h2></div>
      {licenses.length === 0 ? <div className="empty-state"><h2>{t("license.empty.title")}</h2></div> : (
        <table className="data-table">
          <thead><tr><th>{t("license.columns.name")}</th><th>{t("license.columns.edition")}</th><th>{t("license.columns.version")}</th><th>{t("license.columns.key")}</th></tr></thead>
          <tbody>{licenses.map((lic, idx) => (<tr key={idx}><td>{lic.name}</td><td>{lic.edition}</td><td>{lic.version}</td><td style={{ fontFamily: "var(--font-mono)" }}>{lic.licenseKey.substring(0, 10)}...</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
