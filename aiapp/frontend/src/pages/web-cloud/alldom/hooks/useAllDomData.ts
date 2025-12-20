// ============================================================
// HOOK: useAllDomData - Données pack AllDom
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { allDomService, AllDomFullInfo } from "../../../../services/web-cloud.alldom";

export function useAllDomList() {
  const [packs, setPacks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await allDomService.listPacks();
      setPacks(list.sort());
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { packs, loading, error, reload: load };
}

export function useAllDomDetail(serviceName: string | null) {
  const [data, setData] = useState<AllDomFullInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!serviceName) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const info = await allDomService.getFullInfo(serviceName);
      setData(info);
    } catch (err) {
      setError(String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
