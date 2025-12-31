// ============================================================
// HOOK - useEmailLists (Listes de diffusion par domaine)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { EmailList } from "../types";
import { emailsService } from "../emails.service";

interface UseEmailListsResult {
  lists: EmailList[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Hook pour charger les listes de diffusion d'un domaine. */
export function useEmailLists(domain?: string): UseEmailListsResult {
  const [lists, setLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLists = useCallback(async () => {
    if (!domain) {
      setLists([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await emailsService.getMailingLists(domain);
      setLists(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des listes");
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  return {
    lists,
    loading,
    error,
    refresh: loadLists,
  };
}
