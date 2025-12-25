// ============================================================
// PUBLIC-CLOUD / KUBERNETES / KUBECONFIG - Composant ISOLÉ
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getKubeconfig, copyToClipboard, downloadAsFile } from "./KubeconfigTab.service";
import "./KubeconfigTab.css";

interface KubeconfigTabProps {
  projectId: string;
  clusterId: string;
}

export default function KubeconfigTab({ projectId, clusterId }: KubeconfigTabProps) {
  const { t } = useTranslation("public-cloud/kubernetes/index");
  const [kubeconfig, setKubeconfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadKubeconfig = async () => {
    try {
      setLoading(true);
      const data = await getKubeconfig(projectId, clusterId);
      setKubeconfig(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (kubeconfig) {
      await copyToClipboard(kubeconfig);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (kubeconfig) {
      downloadAsFile(kubeconfig, "kubeconfig.yaml");
    }
  };

  return (
    <div className="kubeconfig-tab">
      <div className="kubeconfig-toolbar">
        <h2>{t("kubeconfig.title")}</h2>
      </div>

      <div className="kubeconfig-card">
        <p className="kubeconfig-description">{t("kubeconfig.description")}</p>

        {!kubeconfig ? (
          <button className="btn btn-primary" onClick={loadKubeconfig} disabled={loading}>
            {loading ? t("kubeconfig.generating") : t("kubeconfig.generate")}
          </button>
        ) : (
          <>
            <div className="kubeconfig-content">
              <div className="kubeconfig-box">
                <pre>{kubeconfig}</pre>
              </div>
            </div>
            <div className="kubeconfig-actions">
              <button className="btn btn-outline" onClick={handleCopy}>
                {copied ? "✓ Copié!" : t("kubeconfig.copy")}
              </button>
              <button className="btn btn-outline" onClick={handleDownload}>
                {t("kubeconfig.download")}
              </button>
              <button className="btn btn-outline" onClick={loadKubeconfig}>
                {t("kubeconfig.regenerate")}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="kubeconfig-usage-card">
        <h3>{t("kubeconfig.usage.title")}</h3>
        <p className="kubeconfig-usage-description">{t("kubeconfig.usage.description")}</p>
        <div className="kubeconfig-box">
          export KUBECONFIG=./kubeconfig.yaml && kubectl get nodes
        </div>
      </div>
    </div>
  );
}
