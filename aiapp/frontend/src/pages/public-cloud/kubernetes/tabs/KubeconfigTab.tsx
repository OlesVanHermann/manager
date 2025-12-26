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
  const { t } = useTranslation("public-cloud/kubernetes/kubeconfig");
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
        <h2>{t("title")}</h2>
      </div>

      <div className="kubeconfig-card">
        <p className="kubeconfig-description">{t("description")}</p>

        {!kubeconfig ? (
          <button className="btn btn-primary" onClick={loadKubeconfig} disabled={loading}>
            {loading ? t("generating") : t("generate")}
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
                {copied ? "✓ Copié!" : t("copy")}
              </button>
              <button className="btn btn-outline" onClick={handleDownload}>
                {t("download")}
              </button>
              <button className="btn btn-outline" onClick={loadKubeconfig}>
                {t("regenerate")}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="kubeconfig-usage-card">
        <h3>{t("usage.title")}</h3>
        <p className="kubeconfig-usage-description">{t("usage.description")}</p>
        <div className="kubeconfig-box">
          export KUBECONFIG=./kubeconfig.yaml && kubectl get nodes
        </div>
      </div>
    </div>
  );
}
