// ============================================================
// HOOK - useEmailRedirections (Redirections par domaine)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { EmailRedirection } from "../types";
import { emailsService } from "./emails.service";

interface UseEmailRedirectionsResult {
  redirections: EmailRedirection[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Hook pour charger les redirections email d'un domaine. */
export function useEmailRedirections(domain?: string): UseEmailRedirectionsResult {
  const [redirections, setRedirections] = useState<EmailRedirection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRedirections = useCallback(async () => {
    if (!domain) {
      setRedirections([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await emailsService.getRedirections(domain);
      setRedirections(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des redirections");
      setRedirections([]);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadRedirections();
  }, [loadRedirections]);

  return {
    redirections,
    loading,
    error,
    refresh: loadRedirections,
  };
}
