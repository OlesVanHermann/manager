// ############################################################
// #  DEDICATED/IPMI - COMPOSANT STRICTEMENT ISOLÉ            #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./IpmiTab.css                               #
// #  SERVICE LOCAL : ./IpmiTab.service.ts                    #
// #  I18N LOCAL : bare-metal/dedicated/ipmi                  #
// #  CLASSES CSS : .dedicated-ipmi-*                         #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ipmiService } from "./IpmiTab.service";
import type { DedicatedServerIpmi } from "../../dedicated.types";
import "./IpmiTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
}

// ============================================================
// Composant Principal
// ============================================================
export function IpmiTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/ipmi");
  const { t: tCommon } = useTranslation("common");
  const [ipmi, setIpmi] = useState<DedicatedServerIpmi | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);

  // Chargement des données IPMI
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await ipmiService.getIpmi(serviceName);
        setIpmi(data);
      } catch {
        setIpmi(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // Démarrage d'une session IPMI
  const startSession = async (type: "kvmipHtml5URL" | "serialOverLanURL") => {
    try {
      setSessionLoading(true);
      const result = await ipmiService.startIpmiSession(serviceName, type);
      setSessionUrl(result.value);
    } finally {
      setSessionLoading(false);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="dedicated-ipmi-tab">
        <div className="dedicated-ipmi-loading">
          <div className="dedicated-ipmi-skeleton" style={{ width: "60%" }} />
          <div className="dedicated-ipmi-skeleton" style={{ width: "40%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dedicated-ipmi-tab">
      {/* En-tête */}
      <div className="dedicated-ipmi-header">
        <h3>{t("title")}</h3>
        <p className="dedicated-ipmi-description">{t("description")}</p>
      </div>

      {/* IPMI non disponible */}
      {!ipmi || !ipmi.activated ? (
        <div className="dedicated-ipmi-empty">
          <p>{t("notAvailable")}</p>
        </div>
      ) : (
        <>
          {/* Fonctionnalités supportées */}
          <div className="dedicated-ipmi-features">
            <div className="dedicated-ipmi-feature-item">
              <label>KVM over IP</label>
              <span
                className={`dedicated-ipmi-badge ${ipmi.supportedFeatures?.kvmoverip ? "dedicated-ipmi-success" : "dedicated-ipmi-inactive"}`}
              >
                {ipmi.supportedFeatures?.kvmoverip
                  ? t("supported")
                  : t("notSupported")}
              </span>
            </div>
            <div className="dedicated-ipmi-feature-item">
              <label>Serial over LAN</label>
              <span
                className={`dedicated-ipmi-badge ${ipmi.supportedFeatures?.serialOverLanUrl ? "dedicated-ipmi-success" : "dedicated-ipmi-inactive"}`}
              >
                {ipmi.supportedFeatures?.serialOverLanUrl
                  ? t("supported")
                  : t("notSupported")}
              </span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="dedicated-ipmi-actions">
            {ipmi.supportedFeatures?.kvmoverip && (
              <button
                className="dedicated-ipmi-btn-primary"
                onClick={() => startSession("kvmipHtml5URL")}
                disabled={sessionLoading}
              >
                {sessionLoading ? tCommon("loading") : t("launchKvm")}
              </button>
            )}
            {ipmi.supportedFeatures?.serialOverLanUrl && (
              <button
                className="dedicated-ipmi-btn-secondary"
                onClick={() => startSession("serialOverLanURL")}
                disabled={sessionLoading}
              >
                {sessionLoading ? tCommon("loading") : t("launchSol")}
              </button>
            )}
          </div>

          {/* URL de session */}
          {sessionUrl && (
            <div className="dedicated-ipmi-session-url">
              <label>{t("sessionUrl")}</label>
              <a href={sessionUrl} target="_blank" rel="noopener noreferrer">
                {t("openSession")}
              </a>
            </div>
          )}
        </>
      )}

      {/* Boîte d'information */}
      <div className="dedicated-ipmi-info-box">
        <h4>{t("whatIs")}</h4>
        <p>{t("explanation")}</p>
      </div>
    </div>
  );
}

export default IpmiTab;
