import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { securityService } from "./SecurityTab.service";
import type { SecurityPolicy } from "../../vmware.types";
import "./SecurityTab.css";
export default function SecurityTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setPolicy(await securityService.getSecurityPolicy(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!policy) return null;
  return (
    <div className="security-tab">
      <div className="security-toolbar"><h2>{t("security.title")}</h2><button className="btn btn-outline" onClick={loadData}>{tCommon("actions.refresh")}</button></div>
      <div className="security-info-grid">
        <div className="security-info-card"><div className="security-card-title">{t("security.fields.accessPolicy")}</div><div className="security-card-value">{policy.userAccessPolicy}</div></div>
        <div className="security-info-card"><div className="security-card-title">{t("security.fields.sessionTimeout")}</div><div className="security-card-value">{policy.userSessionTimeout} min</div></div>
        <div className="security-info-card"><div className="security-card-title">{t("security.fields.concurrentSessions")}</div><div className="security-card-value">{policy.userLimitConcurrentSession}</div></div>
        <div className="security-info-card"><div className="security-card-title">{t("security.fields.tokenValidity")}</div><div className="security-card-value">{policy.tokenValidityInHours}h</div></div>
      </div>
    </div>
  );
}
