import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as registryService from "../../../../services/public-cloud.registry";

interface Image { id: string; name: string; tagsCount: number; size: number; updatedAt: string; }
interface ImagesTabProps { projectId: string; registryId: string; }

export default function ImagesTab({ projectId, registryId }: ImagesTabProps) {
  const { t } = useTranslation("public-cloud/registry/index");
  const { t: tCommon } = useTranslation("common");
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadImages(); }, [projectId, registryId]);

  const loadImages = async () => {
    try { setLoading(true); setError(null); const data = await registryService.getImages(projectId, registryId); setImages(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatSize = (bytes: number) => bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : bytes >= 1e6 ? `${(bytes / 1e6).toFixed(2)} MB` : `${bytes} B`;

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadImages}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="images-tab">
      <div className="tab-toolbar"><h2>{t("images.title")}</h2></div>
      {images.length === 0 ? (
        <div className="empty-state"><h2>{t("images.empty.title")}</h2><p>{t("images.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("images.columns.name")}</th><th>{t("images.columns.tags")}</th><th>{t("images.columns.size")}</th><th>{t("images.columns.updated")}</th><th>{t("images.columns.actions")}</th></tr></thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.id}><td className="mono">{image.name}</td><td>{image.tagsCount}</td><td>{formatSize(image.size)}</td><td>{new Date(image.updatedAt).toLocaleDateString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("images.actions.tags")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
