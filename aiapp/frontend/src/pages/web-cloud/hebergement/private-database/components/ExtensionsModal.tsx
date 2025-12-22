// ============================================================
// MODAL: Extensions PostgreSQL
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface Extension {
  name: string;
  description: string;
  enabled: boolean;
}

interface Props {
  serviceName: string;
  databaseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_EXTENSIONS: Extension[] = [
  { name: "postgis", description: "Support for geographic objects", enabled: false },
  { name: "uuid-ossp", description: "Generate universally unique identifiers (UUIDs)", enabled: false },
  { name: "hstore", description: "Key-value pair storage", enabled: false },
  { name: "pg_trgm", description: "Text similarity measurement", enabled: false },
  { name: "btree_gin", description: "GIN index operator classes", enabled: false },
  { name: "btree_gist", description: "GiST index operator classes", enabled: false },
  { name: "citext", description: "Case-insensitive character string type", enabled: false },
  { name: "cube", description: "Multi-dimensional cube data type", enabled: false },
  { name: "earthdistance", description: "Calculate great-circle distances", enabled: false },
  { name: "fuzzystrmatch", description: "Fuzzy string matching", enabled: false },
  { name: "intarray", description: "Integer array functions and operators", enabled: false },
  { name: "ltree", description: "Hierarchical tree-like data type", enabled: false },
  { name: "pg_stat_statements", description: "Track SQL statement statistics", enabled: false },
  { name: "tablefunc", description: "Table-returning functions including crosstab", enabled: false },
  { name: "unaccent", description: "Text search dictionary for unaccenting", enabled: false },
];

export function ExtensionsModal({ serviceName, databaseName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    loadExtensions();
  }, [isOpen, serviceName, databaseName]);

  const loadExtensions = async () => {
    setLoading(true);
    try {
      const enabled = await privateDatabaseService.getExtensions(serviceName, databaseName);
      const merged = COMMON_EXTENSIONS.map(ext => ({
        ...ext,
        enabled: enabled?.includes(ext.name) || false,
      }));
      setExtensions(merged);
    } catch (err) {
      console.error(err);
      setExtensions(COMMON_EXTENSIONS);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const toggleExtension = (name: string) => {
    setExtensions(exts =>
      exts.map(ext =>
        ext.name === name ? { ...ext, enabled: !ext.enabled } : ext
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const toEnable = extensions.filter(e => e.enabled).map(e => e.name);
      await privateDatabaseService.setExtensions(serviceName, databaseName, toEnable);
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const filteredExtensions = extensions.filter(ext =>
    ext.name.toLowerCase().includes(search.toLowerCase()) ||
    ext.description.toLowerCase().includes(search.toLowerCase())
  );

  const enabledCount = extensions.filter(e => e.enabled).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("extensions.title")} - {databaseName}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="info-banner error">
              <span className="info-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="info-banner info">
            <span className="info-icon">ℹ️</span>
            <span>{t("extensions.description")}</span>
          </div>

          {/* Search */}
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder={t("extensions.search")}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Extensions list */}
          {loading ? (
            <div className="loading-spinner">{t("common.loading")}</div>
          ) : (
            <div className="extensions-list">
              {filteredExtensions.map(ext => (
                <div key={ext.name} className={`extension-item ${ext.enabled ? "enabled" : ""}`}>
                  <label className="extension-checkbox">
                    <input
                      type="checkbox"
                      checked={ext.enabled}
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
            {t("extensions.enabled", { count: enabledCount })}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? t("common.saving") : t("extensions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExtensionsModal;
