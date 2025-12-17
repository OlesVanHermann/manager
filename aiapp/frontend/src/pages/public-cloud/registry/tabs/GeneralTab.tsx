import { useTranslation } from "react-i18next";

interface RegistryInfo { id: string; name: string; region: string; status: string; url: string; size: number; createdAt: string; }
interface GeneralTabProps { projectId: string; registryId: string; registry: RegistryInfo | null; onRefresh: () => void; }

export default function GeneralTab({ projectId, registryId, registry, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/registry/index");
  const { t: tCommon } = useTranslation("common");
  if (!registry) return <div className="loading-state">{tCommon("loading")}</div>;

  const formatSize = (bytes: number) => bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : bytes >= 1e6 ? `${(bytes / 1e6).toFixed(2)} MB` : `${bytes} B`;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{registry.name}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{registry.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.size")}</div><div className="card-value">{formatSize(registry.size)}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.created")}</div><div className="card-value">{new Date(registry.createdAt).toLocaleDateString("fr-FR")}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <div className="card-title">{t("general.fields.url")}</div>
        <div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{registry.url}</div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.docker.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-2)" }}>{t("general.docker.description")}</p>
        <div className="kubeconfig-box">docker login {registry.url}</div>
      </div>
    </div>
  );
}
