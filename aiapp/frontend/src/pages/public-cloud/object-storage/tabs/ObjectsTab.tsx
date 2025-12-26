// ============================================================
// PUBLIC-CLOUD / OBJECT-STORAGE / OBJECTS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getObjects, formatSize, getFileIcon, formatDate } from "./ObjectsTab.service";
import type { StorageObject } from "../object-storage.types";
import "./ObjectsTab.css";

interface ObjectsTabProps {
  projectId: string;
  region: string;
  containerId: string;
}

export default function ObjectsTab({ projectId, region, containerId }: ObjectsTabProps) {
  const { t } = useTranslation("public-cloud/object-storage/objects");
  const { t: tCommon } = useTranslation("common");
  const [objects, setObjects] = useState<StorageObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    loadObjects();
  }, [projectId, region, containerId, prefix]);

  const loadObjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getObjects(projectId, region, containerId, prefix);
      setObjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const navigateToFolder = (folderName: string) => {
    setPrefix(folderName);
  };

  const goBack = () => {
    const parts = prefix.split("/").filter(Boolean);
    parts.pop();
    setPrefix(parts.length > 0 ? parts.join("/") + "/" : "");
  };

  if (loading) {
    return <div className="objects-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="objects-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadObjects}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="objects-tab">
      <div className="objects-toolbar">
        <div className="objects-toolbar-left">
          <h2>{t("title")}</h2>
          {prefix && <span className="objects-prefix">/{prefix}</span>}
        </div>
        <div className="objects-toolbar-right">
          {prefix && (
            <button className="btn btn-outline" onClick={goBack}>
              ← {t("back")}
            </button>
          )}
          <button className="btn btn-primary">{t("upload")}</button>
        </div>
      </div>

      {objects.length === 0 ? (
        <div className="objects-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="objects-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.size")}</th>
              <th>{t("columns.type")}</th>
              <th>{t("columns.modified")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {objects.map((obj) => {
              const isFolder = obj.name.endsWith("/");
              return (
                <tr key={obj.name}>
                  <td>
                    {isFolder ? (
                      <button
                        className="objects-folder-link"
                        onClick={() => navigateToFolder(obj.name)}
                      >
                        📁 {obj.name.replace(prefix, "")}
                      </button>
                    ) : (
                      <span className="objects-name">
                        {getFileIcon(obj.contentType)} {obj.name.replace(prefix, "")}
                      </span>
                    )}
                  </td>
                  <td className="objects-size">{isFolder ? "-" : formatSize(obj.size)}</td>
                  <td>{isFolder ? t("folder") : obj.contentType}</td>
                  <td>{formatDate(obj.lastModified)}</td>
                  <td className="objects-actions">
                    {!isFolder && (
                      <button className="btn btn-sm btn-outline">
                        {t("actions.download")}
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline btn-danger">
                      {tCommon("actions.delete")}
                    </button>
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
