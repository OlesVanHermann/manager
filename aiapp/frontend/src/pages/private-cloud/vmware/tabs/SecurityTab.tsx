import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface SecurityPolicy { userAccessPolicy: string; userSessionTimeout: number; userLimitConcurrentSession: number; logOutPolicy: string; tokenValidityInHours: number; }
interface SecurityTabProps { serviceId: string; }

export default function SecurityTab({ serviceId }: SecurityTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPolicy(); }, [serviceId]);

  const loadPolicy = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getSecurityPolicy(serviceId); setPolicy(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadPolicy}>{tCommon("actions.retry")}</button></div>;
  if (!policy) return null;

  return (
    <div className="security-tab">
      <div className="tab-toolbar"><h2>{t("security.title")}</h2><button className="btn btn-outline" onClick={loadPolicy}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("security.fields.accessPolicy")}</div><div className="card-value">{policy.userAccessPolicy}</div></div>
        <div className="info-card"><div className="card-title">{t("security.fields.sessionTimeout")}</div><div className="card-value">{policy.userSessionTimeout} min</div></div>
        <div className="info-card"><div className="card-title">{t("security.fields.concurrentSessions")}</div><div className="card-value">{policy.userLimitConcurrentSession}</div></div>
        <div className="info-card"><div className="card-title">{t("security.fields.logoutPolicy")}</div><div className="card-value">{policy.logOutPolicy}</div></div>
        <div className="info-card"><div className="card-title">{t("security.fields.tokenValidity")}</div><div className="card-value">{policy.tokenValidityInHours}h</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}><h3>{t("security.actions.title")}</h3><div className="item-actions" style={{ marginTop: "var(--space-3)" }}><button className="btn btn-outline">{t("security.actions.editPolicy")}</button><button className="btn btn-outline">{t("security.actions.manageIps")}</button></div></div>
    </div>
  );
}
