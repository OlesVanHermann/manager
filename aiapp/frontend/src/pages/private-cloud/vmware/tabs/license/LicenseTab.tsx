import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { licenseService } from "./LicenseTab.service";
import type { License } from "../../vmware.types";
import "./LicenseTab.css";
export default function LicenseTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setLicenses(await licenseService.getLicenses(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!licenses.length) return <div className="license-empty"><h2>{t("license.empty.title")}</h2></div>;
  return (
    <div className="license-tab">
      <div className="license-toolbar"><h2>{t("license.title")}</h2></div>
      <table className="license-table"><thead><tr><th>{t("license.columns.name")}</th><th>{t("license.columns.edition")}</th><th>{t("license.columns.version")}</th><th>{t("license.columns.key")}</th></tr></thead>
        <tbody>{licenses.map((l,i) => <tr key={i}><td>{l.name}</td><td>{l.edition}</td><td>{l.version}</td><td className="license-key">{l.licenseKey.substring(0,10)}...</td></tr>)}</tbody>
      </table>
    </div>
  );
}
