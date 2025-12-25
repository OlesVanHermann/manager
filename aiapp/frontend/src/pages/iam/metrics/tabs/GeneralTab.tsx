// ============================================================
// GENERAL TAB - Informations générales Metrics
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useTranslation } from "react-i18next";
import * as generalService from "./GeneralTab";
import type { MetricsService } from "../metrics.types";
import "./GeneralTab.css";

// ============================================================
// TYPES
// ============================================================

interface GeneralTabProps {
  serviceId: string;
  info: MetricsService | null;
  onRefresh: () => void;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche les informations générales du service Metrics. */
export default function GeneralTab({ serviceId, info, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("iam/metrics/index");
  const { t: tCommon } = useTranslation("common");

  if (!info) {
    return <div className="general-loading-state">{tCommon("loading")}</div>;
  }

  const quotaPercent = generalService.getQuotaPercent(info.quota.current, info.quota.max);
  const quotaClass = generalService.getQuotaClass(quotaPercent);

  return (
    <div className="general-tab">
      <div className="general-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="general-info-grid">
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.serviceName")}</div>
          <div className="general-card-value mono">{info.serviceName}</div>
        </div>

        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.type")}</div>
          <div className="general-card-value">{info.type}</div>
        </div>

        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.region")}</div>
          <div className="general-card-value">{info.region}</div>
        </div>

        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.created")}</div>
          <div className="general-card-value">{generalService.formatDate(info.createdAt)}</div>
        </div>
      </div>

      <div className="general-quota-section">
        <h3>{t("general.quota.title")}</h3>
        <div className="general-quota-bar">
          <div className={`general-quota-fill ${quotaClass}`} style={{ width: `${quotaPercent}%` }}></div>
        </div>
        <div className="general-quota-text">
          <span>{generalService.formatNumber(info.quota.current)} {t("general.quota.datapoints")}</span>
          <span>{generalService.formatNumber(info.quota.max)} {t("general.quota.max")}</span>
        </div>
      </div>

      <div className="general-endpoint-section">
        <h3>{t("general.endpoints.title")}</h3>
        <div className="general-endpoint-item">
          <span className="general-endpoint-label">{t("general.endpoints.opentsdb")}</span>
          <span className="general-endpoint-value">https://opentsdb.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="general-endpoint-item">
          <span className="general-endpoint-label">{t("general.endpoints.warp10")}</span>
          <span className="general-endpoint-value">https://warp10.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="general-endpoint-item">
          <span className="general-endpoint-label">{t("general.endpoints.prometheus")}</span>
          <span className="general-endpoint-value">https://prometheus.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="general-endpoint-item">
          <span className="general-endpoint-label">{t("general.endpoints.influxdb")}</span>
          <span className="general-endpoint-value">https://influxdb.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="general-endpoint-item">
          <span className="general-endpoint-label">{t("general.endpoints.graphite")}</span>
          <span className="general-endpoint-value">https://graphite.{info.region}.metrics.ovh.net</span>
        </div>
      </div>
    </div>
  );
}
