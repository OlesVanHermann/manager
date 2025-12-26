// ============================================================
// MODAL: Extensions (PostgreSQL) - Private Database
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../../services/api";

interface Props {
  serviceName: string;
  databaseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = "/hosting/privateDatabase";

const AVAILABLE_EXTENSIONS = [
  { name: "pg_trgm", description: "Similarité de texte et recherche fuzzy" },
  { name: "unaccent", description: "Suppression des accents" },
  { name: "uuid-ossp", description: "Génération d'UUID" },
  { name: "hstore", description: "Stockage clé-valeur" },
  { name: "postgis", description: "Données géospatiales" },
  { name: "ltree", description: "Structures hiérarchiques" },
  { name: "pgcrypto", description: "Fonctions cryptographiques" },
];

export function ExtensionsModal({ serviceName, databaseName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [enabled, setEnabled] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExtensions = useCallback(async () => {
    try {
      setLoading(true);
      const extensions: string[] = await apiClient.get(
        `${BASE_PATH}/${serviceName}/database/${databaseName}/extension`
      );
      setEnabled(extensions);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName, databaseName]);

  useEffect(() => {
    if (isOpen) loadExtensions();
  }, [isOpen, loadExtensions]);

  const toggleExtension = (ext: string) => {
    setEnabled(prev => 
      prev.includes(ext) 
        ? prev.filter(e => e !== ext)
        : [...prev, ext]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiClient.post(
        `${BASE_PATH}/${serviceName}/database/${databaseName}/extension`,
        { extensions: enabled }
      );
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("databases.extensionsTitle", { db: databaseName })}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          
          {loading ? (
            <div className="loading-spinner">{t("common.loading")}</div>
          ) : (
            <div className="extensions-list">
              {AVAILABLE_EXTENSIONS.map(ext => (
                <div 
                  key={ext.name} 
                  className={`extension-item ${enabled.includes(ext.name) ? "enabled" : ""}`}
                >
                  <label className="extension-checkbox">
                    <input
                      type="checkbox"
                      checked={enabled.includes(ext.name)}
                      onChange={() => toggleExtension(ext.name)}
                    />
                    <span className="extension-name">{ext.name}</span>
                  </label>
                  <span className="extension-desc">{ext.description}</span>
                </div>
              ))}
            </div>
          )}

          <div className="extensions-summary">
            {enabled.length} extension(s) activée(s)
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t("common.cancel")}
          </button>
          <button 
            type="button" 
            className="privdb-modal-btn-primary" 
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExtensionsModal;
