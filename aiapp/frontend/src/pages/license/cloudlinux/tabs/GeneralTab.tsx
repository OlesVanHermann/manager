// ============================================================
// CLOUDLINUX GENERAL TAB - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { CloudLinuxLicense } from "../cloudlinux.types";
import "./GeneralTab.css";

// ============================================================
// TYPES
// ============================================================

interface GeneralTabProps {
  licenseId: string;
  license: CloudLinuxLicense | null;
  onRefresh: () => void;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche les informations générales de la licence CloudLinux. */
export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="cloudlinux-general-tab">
      <div className="cloudlinux-general-toolbar">
        <h2>{t("cloudlinux.general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="cloudlinux-general-info-card">
        <div className="cloudlinux-general-info-grid">
          <div className="cloudlinux-general-info-item">
            <span className="cloudlinux-general-info-label">{t("fields.id")}</span>
            <span className="cloudlinux-general-info-value mono">{license.id}</span>
          </div>
          <div className="cloudlinux-general-info-item">
            <span className="cloudlinux-general-info-label">{t("fields.ip")}</span>
            <span className="cloudlinux-general-info-value mono">{license.ip}</span>
          </div>
          <div className="cloudlinux-general-info-item">
            <span className="cloudlinux-general-info-label">{t("fields.version")}</span>
            <span className="cloudlinux-general-info-value">{license.version}</span>
          </div>
          <div className="cloudlinux-general-info-item">
            <span className="cloudlinux-general-info-label">{t("fields.created")}</span>
            <span className="cloudlinux-general-info-value">
              {new Date(license.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>

      <div className="cloudlinux-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="cloudlinux-general-actions">
          <button className="btn btn-outline">{t("actions.changeIp")}</button>
          <button className="btn btn-outline btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
