// ============================================================
// GENERAL TAB - Informations générales HSM
// ============================================================

import { useTranslation } from "react-i18next";

// ============================================================
// TYPES
// ============================================================

interface HsmInfo {
  id: string;
  name: string;
  model: string;
  region: string;
  state: string;
  ip: string;
  createdAt: string;
}

interface GeneralTabProps {
  serviceId: string;
  info: HsmInfo | null;
  onRefresh: () => void;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche les informations générales du HSM. */
export default function GeneralTab({ serviceId, info, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("iam/hsm/index");
  const { t: tCommon } = useTranslation("common");

  if (!info) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="general-tab">
      <div className="tab-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="card-title">{t("general.fields.id")}</div>
          <div className="card-value mono">{info.id}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.name")}</div>
          <div className="card-value">{info.name}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.model")}</div>
          <div className="card-value">{info.model}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.region")}</div>
          <div className="card-value">{info.region}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.ip")}</div>
          <div className="card-value mono">{info.ip}</div>
        </div>

        <div className="info-card">
          <div className="card-title">{t("general.fields.created")}</div>
          <div className="card-value">{new Date(info.createdAt).toLocaleDateString("fr-FR")}</div>
        </div>
      </div>

      <div className="info-section">
        <h3>{t("general.connection.title")}</h3>
        <p className="info-description">{t("general.connection.description")}</p>
        <div className="code-block">
          <code>pkcs11-tool --module /usr/lib/liblunasa.so --slot 0 --login</code>
        </div>
      </div>

      <div className="info-section" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.documentation.title")}</h3>
        <p className="info-description">{t("general.documentation.description")}</p>
        <a href="https://docs.ovh.com/fr/dedicated-hsm/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          {t("general.documentation.link")}
        </a>
      </div>
    </div>
  );
}
