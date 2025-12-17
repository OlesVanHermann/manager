import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as objectStorageService from "../../../../services/public-cloud.object-storage";

interface StorageObject { name: string; size: number; contentType: string; lastModified: string; }
interface ObjectsTabProps { projectId: string; region: string; containerId: string; }

export default function ObjectsTab({ projectId, region, containerId }: ObjectsTabProps) {
  const { t } = useTranslation("public-cloud/object-storage/index");
  const { t: tCommon } = useTranslation("common");
  const [objects, setObjects] = useState<StorageObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("");

  useEffect(() => { loadObjects(); }, [projectId, region, containerId, prefix]);

  const loadObjects = async () => {
    try { setLoading(true); setError(null); const data = await objectStorageService.getObjects(projectId, region, containerId, prefix); setObjects(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return "🖼️";
    if (contentType.startsWith("video/")) return "🎬";
    if (contentType.startsWith("audio/")) return "🎵";
    if (contentType.includes("pdf")) return "📄";
    if (contentType.includes("zip") || contentType.includes("tar") || contentType.includes("gzip")) return "📦";
    return "📁";
  };

  const navigateToFolder = (folderName: string) => {
    setPrefix(folderName);
  };

  const goBack = () => {
    const parts = prefix.split("/").filter(Boolean);
    parts.pop();
    setPrefix(parts.length > 0 ? parts.join("/") + "/" : "");
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadObjects}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="objects-tab">
      <div className="tab-toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <h2>{t("objects.title")}</h2>
          {prefix && <span className="mono" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>/{prefix}</span>}
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {prefix && <button className="btn btn-outline" onClick={goBack}>← {t("objects.back")}</button>}
          <button className="btn btn-primary">{t("objects.upload")}</button>
        </div>
      </div>
      {objects.length === 0 ? (
        <div className="empty-state"><h2>{t("objects.empty.title")}</h2><p>{t("objects.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("objects.columns.name")}</th><th>{t("objects.columns.size")}</th><th>{t("objects.columns.type")}</th><th>{t("objects.columns.modified")}</th><th>{t("objects.columns.actions")}</th></tr></thead>
          <tbody>
            {objects.map((obj) => {
              const isFolder = obj.name.endsWith("/");
              return (
                <tr key={obj.name}>
                  <td>
                    {isFolder ? (
                      <button className="btn-link" onClick={() => navigateToFolder(obj.name)} style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>📁 {obj.name.replace(prefix, "")}</button>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>{getFileIcon(obj.contentType)} {obj.name.replace(prefix, "")}</span>
                    )}
                  </td>
                  <td>{isFolder ? "-" : formatSize(obj.size)}</td>
                  <td>{isFolder ? t("objects.folder") : obj.contentType}</td>
                  <td>{new Date(obj.lastModified).toLocaleString("fr-FR")}</td>
                  <td className="item-actions">
                    {!isFolder && <button className="btn btn-sm btn-outline">{t("objects.actions.download")}</button>}
                    <button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
