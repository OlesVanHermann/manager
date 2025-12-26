import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { securityService } from "./SecurityTab.service";
import type { SecurityPolicy } from "../../vmware.types";
import "./SecurityTab.css";

export default function SecurityTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/security");
  const { t: tCommon } = useTranslation("common");

  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, [serviceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPolicy(await securityService.getSecurityPolicy(serviceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!policy) return <div className="security-empty"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>;

  return (
    <div className="security-tab">
      <div className="security-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadData}>{tCommon("actions.refresh")}</button>
      </div>
      <div className="security-info-grid">
        <div className="security-info-card">
          <div className="security-card-title">{t("fields.accessPolicy")}</div>
          <div className="security-card-value">{policy.accessNetworkState}</div>
        </div>
        <div className="security-info-card">
          <div className="security-card-title">{t("fields.sessionTimeout")}</div>
          <div className="security-card-value">{policy.sessionTimeoutInMinutes} min</div>
        </div>
        <div className="security-info-card">
          <div className="security-card-title">{t("fields.concurrentSessions")}</div>
          <div className="security-card-value">{policy.maxConcurrentConnections}</div>
        </div>
        <div className="security-info-card">
          <div className="security-card-title">{t("fields.logoutPolicy")}</div>
          <div className="security-card-value">{policy.logoutPolicy}</div>
        </div>
        <div className="security-info-card">
          <div className="security-card-title">{t("fields.tokenValidity")}</div>
          <div className="security-card-value">{policy.tokenValidityInSeconds} sec</div>
        </div>
      </div>
      <div className="security-actions">
        <h3>{t("actions.title")}</h3>
        <button className="btn btn-outline">{t("actions.editPolicy")}</button>
        <button className="btn btn-outline">{t("actions.manageIps")}</button>
      </div>
    </div>
  );
}
