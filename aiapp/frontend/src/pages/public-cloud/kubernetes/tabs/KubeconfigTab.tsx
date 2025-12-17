import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as k8sService from "../../../../services/public-cloud.kubernetes";

interface KubeconfigTabProps { projectId: string; clusterId: string; }

export default function KubeconfigTab({ projectId, clusterId }: KubeconfigTabProps) {
  const { t } = useTranslation("public-cloud/kubernetes/index");
  const [kubeconfig, setKubeconfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadKubeconfig = async () => {
    try { setLoading(true); const data = await k8sService.getKubeconfig(projectId, clusterId); setKubeconfig(data); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const copyToClipboard = () => {
    if (kubeconfig) { navigator.clipboard.writeText(kubeconfig); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const downloadKubeconfig = () => {
    if (kubeconfig) {
      const blob = new Blob([kubeconfig], { type: "text/yaml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "kubeconfig.yaml"; a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="kubeconfig-tab">
      <div className="tab-toolbar"><h2>{t("kubeconfig.title")}</h2></div>
      <div className="info-card">
        <p style={{ marginBottom: "var(--space-3)", color: "var(--color-text-secondary)" }}>{t("kubeconfig.description")}</p>
        {!kubeconfig ? (
          <button className="btn btn-primary" onClick={loadKubeconfig} disabled={loading}>{loading ? t("kubeconfig.generating") : t("kubeconfig.generate")}</button>
        ) : (
          <>
            <div className="kubeconfig-box" style={{ maxHeight: "300px", overflow: "auto", marginBottom: "var(--space-3)" }}><pre>{kubeconfig}</pre></div>
            <div className="item-actions">
              <button className="btn btn-outline" onClick={copyToClipboard}>{copied ? "✓ Copié!" : t("kubeconfig.copy")}</button>
              <button className="btn btn-outline" onClick={downloadKubeconfig}>{t("kubeconfig.download")}</button>
              <button className="btn btn-outline" onClick={loadKubeconfig}>{t("kubeconfig.regenerate")}</button>
            </div>
          </>
        )}
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("kubeconfig.usage.title")}</h3>
        <p style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>{t("kubeconfig.usage.description")}</p>
        <div className="kubeconfig-box">export KUBECONFIG=./kubeconfig.yaml && kubectl get nodes</div>
      </div>
    </div>
  );
}
