// ============================================================
// GENERAL TAB - Informations générales HSM
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useTranslation } from "react-i18next";
import * as generalService from "./GeneralTab.service";
import type { Hsm } from "../hsm.types";
import "./GeneralTab.css";

// ============================================================
// TYPES
// ============================================================

interface GeneralTabProps {
  serviceId: string;
  info: Hsm | null;
  onRefresh: () => void;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche les informations générales du HSM. */
export default function GeneralTab({ serviceId, info, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("iam/hsm/general");
  const { t: tCommon } = useTranslation("common");

  if (!info) {
    return <div className="hsm-general-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="hsm-general-tab">
      <div className="hsm-general-toolbar">
        <h2>{t("info.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="hsm-general-info-grid">
        <div className="hsm-general-info-card">
          <div className="hsm-general-card-title">{t("info.fields.id")}</div>
          <div className="hsm-general-card-value mono">{info.id}</div>
        </div>

        <div className="hsm-general-info-card">
          <div className="hsm-general-card-title">{t("info.fields.name")}</div>
          <div className="hsm-general-card-value">{info.name}</div>
        </div>

        <div className="hsm-general-info-card">
          <div className="hsm-general-card-title">{t("info.fields.model")}</div>
          <div className="hsm-general-card-value">{info.model}</div>
        </div>

        <div className="hsm-general-info-card">
          <div className="hsm-general-card-title">{t("info.fields.region")}</div>
          <div className="hsm-general-card-value">{info.region}</div>
        </div>

        <div className="hsm-general-info-card">
          <div className="hsm-general-card-title">{t("info.fields.ip")}</div>
          <div className="hsm-general-card-value mono">{info.ip}</div>
        </div>

        <div className="hsm-general-info-card">
          <div className="hsm-general-card-title">{t("info.fields.created")}</div>
          <div className="hsm-general-card-value">{generalService.formatDate(info.createdAt)}</div>
        </div>
      </div>

      <div className="hsm-general-info-section">
        <h3>{t("info.connection.title")}</h3>
        <p className="hsm-general-info-description">{t("info.connection.description")}</p>
        <div className="hsm-general-code-block">
          <code>pkcs11-tool --module /usr/lib/liblunasa.so --slot 0 --login</code>
        </div>
      </div>

      <div className="hsm-general-info-section" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("info.documentation.title")}</h3>
        <p className="hsm-general-info-description">{t("info.documentation.description")}</p>
        <a href="https://docs.ovh.com/fr/dedicated-hsm/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          {t("info.documentation.link")}
        </a>
      </div>
    </div>
  );
}
