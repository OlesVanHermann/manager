import { useTranslation } from "react-i18next";
interface PleskLicense { id: string; ip: string; version: string; domainNumber: number; status: string; createdAt: string; }
interface GeneralTabProps { licenseId: string; license: PleskLicense | null; onRefresh: () => void; }
export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");
  if (!license) return <div className="loading-state">{tCommon("loading")}</div>;
  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("plesk.general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="license-info-card"><div className="info-grid">
        <div className="info-item"><span className="info-label">{t("fields.id")}</span><span className="info-value mono">{license.id}</span></div>
        <div className="info-item"><span className="info-label">{t("fields.ip")}</span><span className="info-value mono">{license.ip}</span></div>
        <div className="info-item"><span className="info-label">{t("fields.version")}</span><span className="info-value">{license.version}</span></div>
        <div className="info-item"><span className="info-label">{t("plesk.general.fields.domains")}</span><span className="info-value">{license.domainNumber}</span></div>
        <div className="info-item"><span className="info-label">{t("fields.created")}</span><span className="info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span></div>
      </div></div>
      <div className="license-info-card"><h3>{t("actions.title")}</h3><div className="license-actions" style={{ marginTop: "var(--space-3)" }}><button className="btn btn-outline">{t("actions.changeIp")}</button><button className="btn btn-outline">{t("plesk.general.actions.changeDomains")}</button><button className="btn btn-outline btn-danger">{t("actions.terminate")}</button></div></div>
    </div>
  );
}
