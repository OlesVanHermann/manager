// ============================================================
// PUBLIC-CLOUD / REGISTRY / IMAGES - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getImages, formatSize, formatDate } from "./ImagesTab.service";
import type { Image } from "../registry.types";
import "./ImagesTab.css";

interface ImagesTabProps {
  projectId: string;
  registryId: string;
}

export default function ImagesTab({ projectId, registryId }: ImagesTabProps) {
  const { t } = useTranslation("public-cloud/registry/images");
  const { t: tCommon } = useTranslation("common");
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, [projectId, registryId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getImages(projectId, registryId);
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="images-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="images-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadImages}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="images-tab">
      <div className="images-toolbar">
        <h2>{t("title")}</h2>
      </div>

      {images.length === 0 ? (
        <div className="images-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="images-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.tags")}</th>
              <th>{t("columns.size")}</th>
              <th>{t("columns.updated")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.id}>
                <td className="images-name">{image.name}</td>
                <td className="images-tags-count">{image.tagsCount}</td>
                <td className="images-size">{formatSize(image.size)}</td>
                <td>{formatDate(image.updatedAt)}</td>
                <td className="images-actions">
                  <button className="btn btn-sm btn-outline">{t("actions.tags")}</button>
                  <button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
