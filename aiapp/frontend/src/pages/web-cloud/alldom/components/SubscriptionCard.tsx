// ============================================================
// COMPONENT: SubscriptionCard - Abonnement du pack
// ============================================================

import { useTranslation } from "react-i18next";
import { AllDomFullInfo } from "../../../../services/web-cloud.alldom";

interface Props {
  data: AllDomFullInfo;
  onTerminate: () => void;
  onCancelTerminate: () => void;
  hasTerminateAction: boolean;
}

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";

export function SubscriptionCard({ data, onTerminate, onCancelTerminate, hasTerminateAction }: Props) {
  const { t } = useTranslation("web-cloud/alldom/index");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const renewModeLabels: Record<string, string> = {
    "automatic": t("subscription.automatic"),
    "manual": t("subscription.manual"),
  };

  const getRenewalUrl = () => 
    `${OVH_MANAGER_BASE}/#/dedicated/billing/autorenew?searchText=${encodeURIComponent(data.pack.name)}`;

  const getContactsUrl = () => 
    `${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${encodeURIComponent(data.pack.name)}`;

  return (
    <div className="info-card">
      <div className="card-header-with-actions">
        <h3>{t("subscription.title")}</h3>
        <div className="card-actions">
          <a href={getRenewalUrl()} target="_blank" rel="noopener noreferrer" className="btn-link-external">
            {t("subscription.manageRenewal")} →
          </a>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>{t("subscription.renewMode")}</label>
          <span className={`badge ${data.renewMode === "automatic" ? "success" : "warning"}`}>
            {data.renewMode ? renewModeLabels[data.renewMode] || data.renewMode : "-"}
          </span>
          {hasTerminateAction && (
            <span className="badge error" style={{ marginLeft: "8px" }}>{t("subscription.terminatePending")}</span>
          )}
        </div>
        <div className="info-item">
          <label>{data.renewMode === "automatic" ? t("subscription.renewalDate") : t("subscription.expirationDate")}</label>
          <span>{formatDate(data.renewMode === "automatic" ? data.renewalDate : data.expirationDate)}</span>
        </div>
        <div className="info-item">
          <label>{t("subscription.creationDate")}</label>
          <span>{formatDate(data.creationDate)}</span>
        </div>
      </div>

      <div className="divider" />

      <div className="card-header-with-actions">
        <h4>{t("subscription.contacts")}</h4>
        <a href={getContactsUrl()} target="_blank" rel="noopener noreferrer" className="btn-link-external">
          {t("subscription.manageContacts")} →
        </a>
      </div>

      <div className="contacts-list">
        <div className="contact-item">
          <span className="contact-type">{t("subscription.contactAdmin")}</span>
          <span className="contact-nic font-mono">{data.nicAdmin || "-"}</span>
        </div>
        <div className="contact-item">
          <span className="contact-type">{t("subscription.contactTech")}</span>
          <span className="contact-nic font-mono">{data.nicTechnical || "-"}</span>
        </div>
        <div className="contact-item">
          <span className="contact-type">{t("subscription.contactBilling")}</span>
          <span className="contact-nic font-mono">{data.nicBilling || "-"}</span>
        </div>
      </div>

      <div className="divider" />

      <div className="card-footer-actions">
        {hasTerminateAction ? (
          <button className="btn-secondary" onClick={onCancelTerminate}>
            {t("actions.cancelTerminate")}
          </button>
        ) : (
          <button className="btn-danger-outline" onClick={onTerminate}>
            {t("actions.terminate")}
          </button>
        )}
      </div>
    </div>
  );
}
