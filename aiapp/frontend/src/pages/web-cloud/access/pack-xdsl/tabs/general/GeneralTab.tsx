import { useTranslation } from "react-i18next";
import type { Pack } from "../../pack-xdsl.types";
import "./GeneralTab.css";

interface Props {
  packName: string;
  details: Pack | null;
}

export function GeneralTab({ packName, details }: Props) {
  const { t } = useTranslation("web-cloud/access/pack-xdsl/general");

  return (
    <div className="general-xdsl-container">
      <div className="general-xdsl-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="general-xdsl-description">{t("description")}</p>
        </div>
      </div>
      <section className="general-xdsl-info-section">
        <div className="general-xdsl-info-grid">
          <div className="general-xdsl-info-item">
            <label>{t("packName")}</label>
            <span className="general-xdsl-font-mono">{packName}</span>
          </div>
          {details && (
            <>
              <div className="general-xdsl-info-item">
                <label>{t("offer")}</label>
                <span className="xdsl-general-badge info">{details.offerDescription}</span>
              </div>
              <div className="general-xdsl-info-item">
                <label>{t("fields.description")}</label>
                <span>{details.description || '-'}</span>
              </div>
              <div className="general-xdsl-info-item">
                <label>{t("legacy")}</label>
                <span className={`xdsl-general-badge ${details.capabilities?.isLegacyOffer ? 'warning' : 'success'}`}>
                  {details.capabilities?.isLegacyOffer ? 'Oui' : 'Non'}
                </span>
              </div>
            </>
          )}
        </div>
      </section>
      <div className="general-xdsl-info-box">
        <h4>{t("tips")}</h4>
        <p>{t("tipsDesc")}</p>
      </div>
    </div>
  );
}

export default GeneralTab;
