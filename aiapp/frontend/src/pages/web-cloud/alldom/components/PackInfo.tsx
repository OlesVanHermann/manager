// ============================================================
// COMPONENT: PackInfo - Informations générales du pack
// ============================================================

import { useTranslation } from "react-i18next";
import { AllDomFullInfo } from "../../../../services/web-cloud.alldom";

interface Props {
  data: AllDomFullInfo;
}

export function PackInfo({ data }: Props) {
  const { t } = useTranslation("web-cloud/alldom/index");

  const typeLabels: Record<string, string> = {
    "FRENCH": "FR",
    "FRENCH+INTERNATIONAL": "FR + International",
    "INTERNATIONAL": "International",
  };

  return (
    <div className="info-card">
      <h3>{t("info.title")}</h3>
      <div className="info-grid">
        <div className="info-item">
          <label>{t("info.packName")}</label>
          <span className="font-mono">{data.pack.name}</span>
        </div>
        <div className="info-item">
          <label>{t("info.type")}</label>
          <span className="badge info">{typeLabels[data.pack.type] || data.pack.type}</span>
        </div>
        <div className="info-item">
          <label>{t("info.extensions")}</label>
          <span>{data.pack.extensions.map(ext => `.${ext.toLowerCase()}`).join(", ")}</span>
        </div>
        <div className="info-item">
          <label>{t("info.domainsCount")}</label>
          <span className="badge success">{data.pack.domains.length}</span>
        </div>
      </div>
    </div>
  );
}
