// ============================================================
// HOOK - useEmailAccounts (Comptes email par domaine)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { EmailAccount, EmailOffer } from "../types";
import { emailsService } from "../emails.service";

interface UseEmailAccountsResult {
  accounts: EmailAccount[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseEmailAccountsOptions {
  domain?: string;
  licenseId?: string;
  offers?: EmailOffer[];
}

/** Hook pour charger les comptes email d'un domaine. */
export function useEmailAccounts({
  domain,
  licenseId,
  offers,
}: UseEmailAccountsOptions): UseEmailAccountsResult {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    if (!domain && !licenseId) {
      setAccounts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result: EmailAccount[] = [];

      if (domain) {
        result = await emailsService.getAccountsByDomain(domain);
      } else if (licenseId) {
        result = await emailsService.getAccountsByLicense(licenseId);
      }

      // Filtrer par offres si spécifié
      if (offers && offers.length > 0) {
        result = result.filter((acc) => offers.includes(acc.offer));
      }

      setAccounts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des comptes");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [domain, licenseId, offers]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return {
    accounts,
    loading,
    error,
    refresh: loadAccounts,
  };
}
