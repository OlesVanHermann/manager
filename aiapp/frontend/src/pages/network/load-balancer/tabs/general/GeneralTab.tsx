/**
 * LOAD BALANCER General Tab - Composant STRICTEMENT isolé
 * NAV1: network | NAV2: load-balancer | NAV3: general
 * ISOLATION: Ce composant n'importe RIEN d'autres tabs
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IpLoadBalancing, IpLoadBalancingServiceInfos } from "../../load-balancer.types";
import { lbGeneralService } from "./GeneralTab.service";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceName: string;
}

export default function GeneralTab({ serviceName }: GeneralTabProps) {
  const { t } = useTranslation("network/load-balancer/general");
  const { t: tCommon } = useTranslation("common");
  const [lb, setLb] = useState<IpLoadBalancing | null>(null);
  const [serviceInfos, setServiceInfos] = useState<IpLoadBalancingServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [serviceName]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lbData, infos] = await Promise.all([
        lbGeneralService.getLoadBalancer(serviceName),
        lbGeneralService.getServiceInfos(serviceName),
      ]);
      setLb(lbData);
      setServiceInfos(infos);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading || !lb) {
    return <div className="lb-general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="lb-general-tab">
      <div className="lb-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadData}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="lb-general-info-grid">
        <div className="lb-general-info-card">
          <div className="lb-general-card-title">{t("fields.serviceName")}</div>
          <div className="lb-general-card-value-mono">{lb.serviceName}</div>
        </div>
        <div className="lb-general-info-card">
          <div className="lb-general-card-title">{t("fields.displayName")}</div>
          <div className="lb-general-card-value">{lb.displayName || "-"}</div>
        </div>
        <div className="lb-general-info-card">
          <div className="lb-general-card-title">{t("fields.ip")}</div>
          <div className="lb-general-card-value-mono">{lb.ipLoadbalancing}</div>
        </div>
        <div className="lb-general-info-card">
          <div className="lb-general-card-title">{t("fields.offer")}</div>
          <div className="lb-general-card-value">{lb.offer}</div>
        </div>
        <div className="lb-general-info-card">
          <div className="lb-general-card-title">{t("fields.state")}</div>
          <div className="lb-general-card-value">
            <span className={`lb-general-status-badge ${lbGeneralService.getStatusBadgeClass(lb.state)}`}>
              {lb.state}
            </span>
          </div>
        </div>
        <div className="lb-general-info-card">
          <div className="lb-general-card-title">{t("fields.sslConfiguration")}</div>
          <div className="lb-general-card-value">{lb.sslConfiguration || "-"}</div>
        </div>
      </div>

      <div className="lb-general-info-card">
        <div className="lb-general-card-title">{t("fields.zones")}</div>
        <div className="lb-general-zones-list">
          {lb.zone?.map((zone) => (
            <span key={zone} className="lb-general-zone-badge">{zone}</span>
          ))}
        </div>
      </div>

      {serviceInfos && (
        <div className="lb-general-info-card lb-general-service-section">
          <h3>{t("service.title")}</h3>
          <div className="lb-general-service-grid">
            <div className="lb-general-service-item">
              <div className="lb-general-service-label">{t("service.creation")}</div>
              <div className="lb-general-service-value">
                {lbGeneralService.formatDate(serviceInfos.creation)}
              </div>
            </div>
            <div className="lb-general-service-item">
              <div className="lb-general-service-label">{t("service.expiration")}</div>
              <div className="lb-general-service-value">
                {lbGeneralService.formatDate(serviceInfos.expiration)}
              </div>
            </div>
            <div className="lb-general-service-item">
              <div className="lb-general-service-label">{t("service.status")}</div>
              <div className="lb-general-service-value">{serviceInfos.status}</div>
            </div>
            <div className="lb-general-service-item">
              <div className="lb-general-service-label">{t("service.autoRenew")}</div>
              <div className="lb-general-service-value">
                {serviceInfos.renew?.automatic ? tCommon("yes") : tCommon("no")}
              </div>
            </div>
          </div>
        </div>
      )}

      {lb.vrackEligibility && (
        <div className="lb-general-info-card">
          <div className="lb-general-card-title">{t("fields.vrack")}</div>
          <div className="lb-general-card-value">
            {lb.vrackName || t("fields.vrackEligible")}
          </div>
        </div>
      )}
    </div>
  );
}
