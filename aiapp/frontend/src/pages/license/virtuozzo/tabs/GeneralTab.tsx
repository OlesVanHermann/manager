import { useTranslation } from "react-i18next";
interface VirtuozzoLicense { id: string; ip: string; version: string; containerNumber: number; status: string; createdAt: string; }
interface GeneralTabProps { licenseId: string; license: VirtuozzoLicense | null; onRefresh: () => void; }
export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");
  if (!license) return <div className="loading-state">{tCommon("loading")}</div>;
  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("virtuozzo.general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="license-info-card"><div className="info-grid">
        <div className="info-item"><span className="info-label">{t("fields.id")}</span><span className="info-value mono">{license.id}</span></div>
        <div className="info-item"><span className="info-label">{t("fields.ip")}</span><span className="info-value mono">{license.ip}</span></div>
        <div className="info-item"><span className="info-label">{t("fields.version")}</span><span className="info-value">{license.version}</span></div>
        <div className="info-item"><span className="info-label">{t("virtuozzo.general.fields.containers")}</span><span className="info-value">{license.containerNumber}</span></div>
        <div className="info-item"><span className="info-label">{t("fields.created")}</span><span className="info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span></div>
      </div></div>
      <div className="license-info-card"><h3>{t("actions.title")}</h3><div className="license-actions" style={{ marginTop: "var(--space-3)" }}><button className="btn btn-outline">{t("actions.changeIp")}</button><button className="btn btn-outline btn-danger">{t("actions.terminate")}</button></div></div>
    </div>
  );
}
