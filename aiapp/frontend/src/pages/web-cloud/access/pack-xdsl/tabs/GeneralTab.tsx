import { useTranslation } from "react-i18next";
import { Pack } from "../../../../../services/web-cloud.pack-xdsl";

interface Props { packName: string; details: Pack | null; }

export function GeneralTab({ packName, details }: Props) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");

  return (
    <div className="general-tab">
      <div className="tab-header"><div><h3>{t("general.title")}</h3><p className="tab-description">{t("general.description")}</p></div></div>
      <section className="info-section">
        <div className="info-grid">
          <div className="info-item"><label>{t("general.packName")}</label><span className="font-mono">{packName}</span></div>
          {details && (
            <>
              <div className="info-item"><label>{t("general.offer")}</label><span className="badge info">{details.offerDescription}</span></div>
              <div className="info-item"><label>{t("general.description")}</label><span>{details.description || '-'}</span></div>
              <div className="info-item"><label>{t("general.legacy")}</label><span className={`badge ${details.capabilities?.isLegacyOffer ? 'warning' : 'success'}`}>{details.capabilities?.isLegacyOffer ? 'Oui' : 'Non'}</span></div>
            </>
          )}
        </div>
      </section>
      <div className="info-box"><h4>{t("general.tips")}</h4><p>{t("general.tipsDesc")}</p></div>
    </div>
  );
}
export default GeneralTab;
