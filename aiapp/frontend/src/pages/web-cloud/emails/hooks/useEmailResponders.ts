// ============================================================
// HOOK - useEmailResponders (Répondeurs par domaine)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { EmailResponder } from "../types";
import { emailsService } from "../emails.service";

interface UseEmailRespondersResult {
  responders: EmailResponder[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Hook pour charger les répondeurs email d'un domaine. */
export function useEmailResponders(domain?: string): UseEmailRespondersResult {
  const [responders, setResponders] = useState<EmailResponder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResponders = useCallback(async () => {
    if (!domain) {
      setResponders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await emailsService.getResponders(domain);
      setResponders(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des répondeurs");
      setResponders([]);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadResponders();
  }, [loadResponders]);

  return {
    responders,
    loading,
    error,
    refresh: loadResponders,
  };
}
