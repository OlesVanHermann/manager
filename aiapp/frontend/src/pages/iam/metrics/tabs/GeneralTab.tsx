// ============================================================
// GENERAL TAB - Informations générales Metrics
// ============================================================

import { useTranslation } from "react-i18next";

// ============================================================
// TYPES
// ============================================================

interface MetricsServiceInfo {
  serviceName: string;
  displayName?: string;
  region: string;
  type: string;
  status: string;
  quota: {
    current: number;
    max: number;
  };
  createdAt: string;
}

interface GeneralTabProps {
  serviceId: string;
  info: MetricsServiceInfo | null;
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
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  // ---------- HELPERS ----------
  const getQuotaPercent = () => {
    return Math.round((info.quota.current / info.quota.max) * 100);
  };

  const getQuotaClass = () => {
    const percent = getQuotaPercent();
    if (percent >= 90) return "danger";
    if (percent >= 70) return "warning";
    return "";
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <div className="general-tab">
      <div className="tab-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="card-title">{t("general.fields.serviceName")}</div>
          <div className="card-value mono">{info.serviceName}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.type")}</div>
          <div className="card-value">{info.type}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.region")}</div>
          <div className="card-value">{info.region}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.created")}</div>
          <div className="card-value">{new Date(info.createdAt).toLocaleDateString("fr-FR")}</div>
        </div>
      </div>

      <div className="quota-section">
        <h3>{t("general.quota.title")}</h3>
        <div className="quota-bar">
          <div className={`quota-fill ${getQuotaClass()}`} style={{ width: `${getQuotaPercent()}%` }}></div>
        </div>
        <div className="quota-text">
          <span>{formatNumber(info.quota.current)} {t("general.quota.datapoints")}</span>
          <span>{formatNumber(info.quota.max)} {t("general.quota.max")}</span>
        </div>
      </div>

      <div className="endpoint-section">
        <h3>{t("general.endpoints.title")}</h3>
        <div className="endpoint-item">
          <span className="endpoint-label">{t("general.endpoints.opentsdb")}</span>
          <span className="endpoint-value">https://opentsdb.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="endpoint-item">
          <span className="endpoint-label">{t("general.endpoints.warp10")}</span>
          <span className="endpoint-value">https://warp10.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="endpoint-item">
          <span className="endpoint-label">{t("general.endpoints.prometheus")}</span>
          <span className="endpoint-value">https://prometheus.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="endpoint-item">
          <span className="endpoint-label">{t("general.endpoints.influxdb")}</span>
          <span className="endpoint-value">https://influxdb.{info.region}.metrics.ovh.net</span>
        </div>
        <div className="endpoint-item">
          <span className="endpoint-label">{t("general.endpoints.graphite")}</span>
          <span className="endpoint-value">https://graphite.{info.region}.metrics.ovh.net</span>
        </div>
      </div>
    </div>
  );
}
