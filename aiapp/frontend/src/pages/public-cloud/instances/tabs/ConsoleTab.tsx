import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as instancesService from "../../../../services/public-cloud.instances";

interface ConsoleTabProps { projectId: string; instanceId: string; }

export default function ConsoleTab({ projectId, instanceId }: ConsoleTabProps) {
  const { t } = useTranslation("public-cloud/instances/index");
  const [consoleUrl, setConsoleUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openConsole = async () => {
    try {
      setLoading(true);
      const url = await instancesService.getConsoleUrl(projectId, instanceId);
      setConsoleUrl(url);
      window.open(url, "_blank", "width=1024,height=768");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="console-tab">
      <div className="tab-toolbar"><h2>{t("console.title")}</h2></div>
      <div className="info-card">
        <h3>{t("console.vnc.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>{t("console.vnc.description")}</p>
        <button className="btn btn-primary" onClick={openConsole} disabled={loading}>{loading ? t("console.vnc.loading") : t("console.vnc.open")}</button>
        {consoleUrl && (
          <div style={{ marginTop: "var(--space-3)" }}>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{t("console.vnc.urlLabel")}</p>
            <div className="kubeconfig-box" style={{ wordBreak: "break-all" }}>{consoleUrl}</div>
          </div>
        )}
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("console.serial.title")}</h3>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>{t("console.serial.description")}</p>
        <button className="btn btn-outline">{t("console.serial.open")}</button>
      </div>
    </div>
  );
}
