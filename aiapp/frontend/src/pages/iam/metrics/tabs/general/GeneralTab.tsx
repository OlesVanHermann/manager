// ============================================================
// GENERAL TAB - Informations générales Metrics
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useTranslation } from "react-i18next";
import * as generalService from "./GeneralTab.service";
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
  const { t } = useTranslation("iam/metrics/general");
  const { t: tCommon } = useTranslation("common");

  if (!info) {
    return <div className="metrics-general-loading-state">{tCommon("loading")}</div>;
  }

  const quotaPercent = generalService.getQuotaPercent(info.quota.current, info.quota.max);
  const quotaClass = generalService.getQuotaClass(quotaPercent);

  return (
    <div className="metrics-general-tab">
      <div className="metrics-general-toolbar">
        <h2>{t("info.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="metrics-general-info-grid">
        <div className="metrics-general-info-card">
          <div className="metrics-general-card-title">{t("info.fields.serviceName")}</div>
          <div className="metrics-general-card-value mono">{info.serviceName}</div>
        </div>

        <div className="metrics-general-info-card">
          <div className="metrics-general-card-title">{t("info.fields.type")}</div>
          <div className="metrics-general-card-value">{info.type}</div>
        </div>

        <div className="metrics-general-info-card">
          <div className="metrics-general-card-title">{t("info.fields.region")}</div>
          <div className="metrics-general-card-value">{info.region}</div>
        </div>

        <div className="metrics-general-info-card">
          <div className="metrics-general-card-title">{t("info.fields.created")}</div>
          <div className="metrics-general-card-value">{generalService.formatDate(info.createdAt)}</div>
        </div>
      </div>

      <div className="metrics-general-quota-section">
        <h3>{t("info.quota.title")}</h3>
        <div className="metrics-general-quota-bar">
          <div className={`general-quota-fill ${quotaClass}`} style={{ width: `${quotaPercent}%` }}></div>
        </div>
        <div className="metrics-general-quota-text">
          <span>{generalService.formatNumber(info.quota.current)} {t("info.quota.datapoints")}</span>
          <span>{generalService.formatNumber(info.quota.max)} {t("info.quota.max")}</span>
        </div>
      </div>

      <div className="metrics-general-endpoint-section">
        <h3>{t("info.endpoints.title")}</h3>
        <div className="metrics-general-endpoint-item">
          <span className="metrics-general-endpoint-label">{t("info.endpoints.opentsdb")}</span>
          <span className="metrics-general-endpoint-value">https://opentsdb.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="metrics-general-endpoint-item">
          <span className="metrics-general-endpoint-label">{t("info.endpoints.warp10")}</span>
          <span className="metrics-general-endpoint-value">https://warp10.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="metrics-general-endpoint-item">
          <span className="metrics-general-endpoint-label">{t("info.endpoints.prometheus")}</span>
          <span className="metrics-general-endpoint-value">https://prometheus.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="metrics-general-endpoint-item">
          <span className="metrics-general-endpoint-label">{t("info.endpoints.influxdb")}</span>
          <span className="metrics-general-endpoint-value">https://influxdb.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="metrics-general-endpoint-item">
          <span className="metrics-general-endpoint-label">{t("info.endpoints.graphite")}</span>
          <span className="metrics-general-endpoint-value">https://graphite.{info.region}.metrics.ovh.net</span>
        </div>
      </div>
    </div>
  );
}
