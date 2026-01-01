// ============================================================
// HOOK - useEmailAccounts (Comptes email par domaine)
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { EmailAccount, EmailOffer } from "../types";
import { emailsService } from "./emails.service";

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

  // Stabilise la référence de offers pour éviter les re-renders inutiles
  const offersKey = offers?.sort().join(",") || "";
  const offersRef = useRef(offers);
  if (offersKey !== (offersRef.current?.sort().join(",") || "")) {
    offersRef.current = offers;
  }

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

      // Filtrer par offres si spécifié (utilise ref stabilisée)
      const currentOffers = offersRef.current;
      if (currentOffers && currentOffers.length > 0) {
        result = result.filter((acc) => currentOffers.includes(acc.offer));
      }

      setAccounts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des comptes");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [domain, licenseId, offersKey]); // offersKey string au lieu de offers array

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
