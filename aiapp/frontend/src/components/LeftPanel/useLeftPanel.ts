// ============================================================
// HOOK useLeftPanel - Gestion d'etat pour Left Panel
// Ref: prompt_target_sidecar_left.txt
// ============================================================

import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ============ CACHE ============

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============ TYPES ============

export interface UseLeftPanelOptions<T, D = unknown> {
  // Data fetching
  fetchList: () => Promise<T[]>;
  fetchDetails?: (id: string) => Promise<D>;

  // Item identification
  getItemId: (item: T) => string;

  // Filtering
  filterFn?: (item: T, query: string, filterValue: string) => boolean;

  // Cache
  cacheKey?: string;
  cacheTTL?: number; // ms, default 60000 (60s)

  // Pagination
  pageSize?: number; // default 20

  // Initial state
  initialSelectedId?: string | null;
}

export interface UseLeftPanelResult<T, D = unknown> {
  // Liste
  items: T[];
  loading: boolean;
  error: string | null;

  // Selection
  selectedId: string | null;
  selectedItem: T | null;
  setSelectedId: (id: string | null) => void;

  // Details (lazy loaded)
  details: D | null;
  detailsLoading: boolean;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterValue: string;
  setFilterValue: (v: string) => void;
  filteredItems: T[];

  // Pagination
  currentPage: number;
  totalPages: number;
  setCurrentPage: (p: number) => void;
  paginatedItems: T[];
  totalItems: number;

  // Actions
  refresh: () => Promise<void>;
  refreshDetails: () => Promise<void>;
}

// ============ HOOK ============

export function useLeftPanel<T, D = unknown>(
  options: UseLeftPanelOptions<T, D>
): UseLeftPanelResult<T, D> {
  const {
    fetchList,
    fetchDetails,
    getItemId,
    filterFn,
    cacheKey,
    cacheTTL = 60000,
    pageSize = 20,
    initialSelectedId = null,
  } = options;

  // -------- State --------
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [details, setDetails] = useState<D | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Ref pour eviter les race conditions
  const mountedRef = useRef(true);
  const detailsAbortRef = useRef<AbortController | null>(null);

  // Ref pour l'auto-selection (evite boucle infinie)
  const hasAutoSelectedRef = useRef(false);

  // -------- Load List --------
  const loadList = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache
      if (useCache && cacheKey) {
        const cached = getCached<T[]>(cacheKey, cacheTTL);
        if (cached) {
          setItems(cached);
          // Auto-select first item if none selected (une seule fois)
          if (cached.length > 0 && !hasAutoSelectedRef.current) {
            hasAutoSelectedRef.current = true;
            setSelectedId(getItemId(cached[0]));
          }
          setLoading(false);
          return;
        }
      }

      const data = await fetchList();

      if (!mountedRef.current) return;

      setItems(data);

      // Store in cache
      if (cacheKey) {
        setCache(cacheKey, data);
      }

      // Auto-select first item if none selected (une seule fois)
      if (data.length > 0 && !hasAutoSelectedRef.current) {
        hasAutoSelectedRef.current = true;
        setSelectedId(getItemId(data[0]));
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchList, cacheKey, cacheTTL, getItemId]);

  // -------- Load Details (lazy) --------
  const loadDetails = useCallback(async (id: string) => {
    if (!fetchDetails) return;

    // Cancel previous request
    if (detailsAbortRef.current) {
      detailsAbortRef.current.abort();
    }
    detailsAbortRef.current = new AbortController();

    try {
      setDetailsLoading(true);
      const data = await fetchDetails(id);

      if (!mountedRef.current) return;
      setDetails(data);
    } catch (err) {
      if (!mountedRef.current) return;
      // Don't set error for aborted requests
      if (err instanceof Error && err.name === "AbortError") return;
      setDetails(null);
    } finally {
      if (mountedRef.current) {
        setDetailsLoading(false);
      }
    }
  }, [fetchDetails]);

  // -------- Effects --------
  useEffect(() => {
    mountedRef.current = true;
    loadList();
    return () => {
      mountedRef.current = false;
    };
  }, [loadList]);

  useEffect(() => {
    if (selectedId) {
      loadDetails(selectedId);
    } else {
      setDetails(null);
    }
  }, [selectedId, loadDetails]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterValue]);

  // -------- Computed --------
  const selectedItem = useMemo(
    () => items.find((item) => getItemId(item) === selectedId) ?? null,
    [items, selectedId, getItemId]
  );

  const filteredItems = useMemo(() => {
    if (!filterFn && !searchQuery.trim()) return items;

    return items.filter((item) => {
      if (filterFn) {
        return filterFn(item, searchQuery, filterValue);
      }
      // Default: search in item ID
      const id = getItemId(item).toLowerCase();
      return id.includes(searchQuery.toLowerCase());
    });
  }, [items, searchQuery, filterValue, filterFn, getItemId]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, pageSize]);

  // -------- Actions --------
  const refresh = useCallback(async () => {
    // Clear cache and reload
    if (cacheKey) {
      cache.delete(cacheKey);
    }
    await loadList(false);
  }, [cacheKey, loadList]);

  const refreshDetails = useCallback(async () => {
    if (selectedId) {
      await loadDetails(selectedId);
    }
  }, [selectedId, loadDetails]);

  // -------- Return --------
  return {
    // Liste
    items,
    loading,
    error,

    // Selection
    selectedId,
    selectedItem,
    setSelectedId,

    // Details
    details,
    detailsLoading,

    // Search & Filter
    searchQuery,
    setSearchQuery,
    filterValue,
    setFilterValue,
    filteredItems,

    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedItems,
    totalItems: filteredItems.length,

    // Actions
    refresh,
    refreshDetails,
  };
}

export default useLeftPanel;
