// ============================================================
// HOOK - useEmailDomains (Liste des domaines multi-offres)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { EmailDomain, EmailOffer } from "../types";
import { emailsService } from "../emails.service";

interface UseEmailDomainsResult {
  domains: EmailDomain[];
  loading: boolean;
  error: string | null;
  selectedDomain: EmailDomain | null;
  selectDomain: (name: string) => void;
  refresh: () => Promise<void>;
  filterByOffer: (offer: EmailOffer | null) => void;
  filteredDomains: EmailDomain[];
}

/** Hook pour gérer la liste des domaines email multi-offres. */
export function useEmailDomains(): UseEmailDomainsResult {
  const [domains, setDomains] = useState<EmailDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomainName, setSelectedDomainName] = useState<string | null>(null);
  const [offerFilter, setOfferFilter] = useState<EmailOffer | null>(null);

  // ---------- CHARGEMENT ----------

  const loadDomains = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await emailsService.getDomains();
      setDomains(result);
      if (result.length > 0 && !selectedDomainName) {
        setSelectedDomainName(result[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [selectedDomainName]);

  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  // ---------- SÉLECTION ----------

  const selectDomain = useCallback((name: string) => {
    setSelectedDomainName(name);
  }, []);

  const selectedDomain = domains.find(d => d.name === selectedDomainName) || null;

  // ---------- FILTRAGE ----------

  const filterByOffer = useCallback((offer: EmailOffer | null) => {
    setOfferFilter(offer);
  }, []);

  const filteredDomains = offerFilter
    ? domains.filter(d => d.offers.includes(offerFilter))
    : domains;

  // ---------- REFRESH ----------

  const refresh = useCallback(async () => {
    await loadDomains();
  }, [loadDomains]);

  return {
    domains,
    loading,
    error,
    selectedDomain,
    selectDomain,
    refresh,
    filterByOffer,
    filteredDomains,
  };
}
