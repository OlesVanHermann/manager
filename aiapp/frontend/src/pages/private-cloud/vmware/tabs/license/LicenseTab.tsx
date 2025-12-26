import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { licenseService } from "./LicenseTab.service";
import type { License } from "../../vmware.types";
import "./LicenseTab.css";

export default function LicenseTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/license");
  const { t: tCommon } = useTranslation("common");

  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, [serviceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setLicenses(await licenseService.getLicenses(serviceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!licenses.length) return <div className="license-empty"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>;

  return (
    <div className="license-tab">
      <div className="license-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadData}>{tCommon("actions.refresh")}</button>
      </div>
      <table className="license-table">
        <thead>
          <tr>
            <th>{t("columns.name")}</th>
            <th>{t("columns.edition")}</th>
            <th>{t("columns.version")}</th>
            <th>{t("columns.key")}</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map((lic, idx) => (
            <tr key={idx}>
              <td><strong>{lic.name}</strong></td>
              <td>{lic.edition || "-"}</td>
              <td>{lic.version || "-"}</td>
              <td><code className="license-key">{lic.licenseKey}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
