// ============================================================
// VRACK General Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .vrack-general-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Vrack, VrackServiceInfos } from "../../vrack.types";
import { vrackGeneralService } from "./GeneralTab.service";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceName: string;
}

export default function GeneralTab({ serviceName }: GeneralTabProps) {
  const { t } = useTranslation("network/vrack/general");
  const { t: tCommon } = useTranslation("common");
  const [vrack, setVrack] = useState<Vrack | null>(null);
  const [serviceInfos, setServiceInfos] = useState<VrackServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [serviceName]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vrackData, infos] = await Promise.all([
        vrackGeneralService.getVrack(serviceName),
        vrackGeneralService.getServiceInfos(serviceName),
      ]);
      setVrack(vrackData);
      setServiceInfos(infos);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !vrack) {
    return <div className="vrack-general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="vrack-general-tab">
      <div className="vrack-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadData}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="vrack-general-info-grid">
        <div className="vrack-general-info-card">
          <div className="vrack-general-card-title">{t("fields.name")}</div>
          <div className="vrack-general-card-value mono">{vrack.name}</div>
        </div>
        <div className="vrack-general-info-card vrack-general-description-card">
          <div className="vrack-general-card-title">{t("fields.description")}</div>
          <div className="vrack-general-description-text">
            {vrack.description || t("fields.noDescription")}
          </div>
        </div>
      </div>

      {serviceInfos && (
        <div className="vrack-general-info-card vrack-general-service-section">
          <h3>{t("service.title")}</h3>
          <div className="vrack-general-service-grid">
            <div className="vrack-general-service-item">
              <div className="vrack-general-service-label">{t("service.creation")}</div>
              <div className="vrack-general-service-value">
                {vrackGeneralService.formatDate(serviceInfos.creation)}
              </div>
            </div>
            <div className="vrack-general-service-item">
              <div className="vrack-general-service-label">{t("service.expiration")}</div>
              <div className="vrack-general-service-value">
                {vrackGeneralService.formatDate(serviceInfos.expiration)}
              </div>
            </div>
            <div className="vrack-general-service-item">
              <div className="vrack-general-service-label">{t("service.status")}</div>
              <div className="vrack-general-service-value">{serviceInfos.status}</div>
            </div>
            <div className="vrack-general-service-item">
              <div className="vrack-general-service-label">{t("service.autoRenew")}</div>
              <div className="vrack-general-service-value">
                {serviceInfos.renew?.automatic ? tCommon("yes") : tCommon("no")}
              </div>
            </div>
            <div className="vrack-general-service-item">
              <div className="vrack-general-service-label">{t("service.contactAdmin")}</div>
              <div className="vrack-general-service-value">{serviceInfos.contactAdmin}</div>
            </div>
            <div className="vrack-general-service-item">
              <div className="vrack-general-service-label">{t("service.contactTech")}</div>
              <div className="vrack-general-service-value">{serviceInfos.contactTech}</div>
            </div>
          </div>
        </div>
      )}

      <div className="vrack-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="vrack-general-actions">
          <button className="btn btn-outline">
            {t("actions.editDescription")}
          </button>
        </div>
      </div>
    </div>
  );
}
