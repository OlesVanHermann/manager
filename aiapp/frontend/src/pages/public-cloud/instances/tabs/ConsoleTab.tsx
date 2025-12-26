import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as consoleService from "./ConsoleTab.service";
import "./ConsoleTab.css";

interface ConsoleTabProps { projectId: string; instanceId: string; }

export default function ConsoleTab({ projectId, instanceId }: ConsoleTabProps) {
  const { t } = useTranslation("public-cloud/instances/console");
  const [consoleUrl, setConsoleUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openConsole = async () => {
    try {
      setLoading(true);
      const url = await consoleService.getConsoleUrl(projectId, instanceId);
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
      <div className="console-toolbar"><h2>{t("title")}</h2></div>
      <div className="console-info-card">
        <h3>{t("vnc.title")}</h3>
        <p className="console-description">{t("vnc.description")}</p>
        <button className="btn btn-primary" onClick={openConsole} disabled={loading}>{loading ? t("vnc.loading") : t("vnc.open")}</button>
        {consoleUrl && (
          <div style={{ marginTop: "var(--space-3)" }}>
            <p className="console-url-label">{t("vnc.urlLabel")}</p>
            <div className="console-code-box">{consoleUrl}</div>
          </div>
        )}
      </div>
      <div className="console-info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("serial.title")}</h3>
        <p className="console-description">{t("serial.description")}</p>
        <button className="btn btn-outline">{t("serial.open")}</button>
      </div>
    </div>
  );
}
