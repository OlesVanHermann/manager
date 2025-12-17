// ============================================================
// SELECT MODAL - Modal générique de sélection avec recherche
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// ============ TYPES ============

export interface SelectOption {
  id: string;
  urn: string;
  label: string;
  description?: string;
  details?: Record<string, string>;
  selected?: boolean;
}

interface SelectModalProps {
  heading: string;
  emptyMessage: string;
  searchPlaceholder: string;
  currentUrns: string[];
  loadOptions: () => Promise<SelectOption[]>;
  onAdd: (urns: string[]) => void;
  onClose: () => void;
  searchFilter?: (option: SelectOption, query: string) => boolean;
}

// ============ COMPOSANT ============

/** Modal générique de sélection multi-options avec recherche et filtrage. */
export function SelectModal({
  heading,
  emptyMessage,
  searchPlaceholder,
  currentUrns,
  loadOptions,
  onAdd,
  onClose,
  searchFilter,
}: SelectModalProps) {
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [query, setQuery] = useState("");

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadData();
  }, []);

  // ---------- LOADERS ----------
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loadOptions();
      const filtered = data
        .filter((opt) => !currentUrns.includes(opt.urn))
        .map((opt) => ({ ...opt, selected: false }));
      setOptions(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const toggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, selected: !opt.selected } : opt
      )
    );
  };

  const handleAdd = () => {
    const selectedUrns = options.filter((o) => o.selected).map((o) => o.urn);
    onAdd(selectedUrns);
    onClose();
  };

  const defaultFilter = (opt: SelectOption, q: string) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return (
      opt.label.toLowerCase().includes(lower) ||
      (opt.description?.toLowerCase().includes(lower) ?? false)
    );
  };

  const filterFn = searchFilter || defaultFilter;
  const filteredOptions = options.filter((opt) => filterFn(opt, query));
  const selectedCount = options.filter((o) => o.selected).length;

  // ---------- RENDER ----------
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{heading}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="search-box">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery("")}>×</button>
            )}
          </div>

          <div className="select-list">
            {loading && <div className="loading-state"><div className="spinner"></div></div>}
            
            {error && <div className="error-banner">{error}</div>}
            
            {!loading && !error && filteredOptions.length === 0 && (
              <div className="empty-message">{emptyMessage}</div>
            )}

            {!loading && !error && filteredOptions.map((opt) => (
              <label key={opt.id} className={`select-option ${opt.selected ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={opt.selected || false}
                  onChange={() => toggleOption(opt.id)}
                />
                <div className="option-content">
                  <div className="option-label">{opt.label}</div>
                  {opt.description && <div className="option-description">{opt.description}</div>}
                  {opt.details && (
                    <div className="option-details">
                      {Object.entries(opt.details).map(([key, val]) => (
                        <span key={key}><strong>{key}:</strong> {val}</span>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {tCommon("actions.cancel")}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={selectedCount === 0}
          >
            {tCommon("actions.add")} {selectedCount > 0 && `(${selectedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
