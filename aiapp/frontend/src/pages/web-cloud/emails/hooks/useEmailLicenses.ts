// ============================================================
// HOOK - useEmailLicenses (Gestion des licences/packs)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { EmailLicense, EmailOffer, LicenseHistory } from "../types";
import { emailsService } from "../emails.service";

interface UseEmailLicensesResult {
  licenses: EmailLicense[];
  packs: EmailLicense[];
  alacarte: EmailLicense[];
  included: EmailLicense[];
  history: LicenseHistory[];
  loading: boolean;
  error: string | null;
  selectedLicense: EmailLicense | null;
  selectLicense: (id: string) => void;
  refresh: () => Promise<void>;
  getTotalCost: () => number;
  getAvailableLicenses: (offer?: EmailOffer) => EmailLicense[];
}

/** Hook pour gérer les licences et packs email. */
export function useEmailLicenses(): UseEmailLicensesResult {
  const [licenses, setLicenses] = useState<EmailLicense[]>([]);
  const [history, setHistory] = useState<LicenseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(null);

  // ---------- CHARGEMENT ----------

  const loadLicenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [licensesResult, historyResult] = await Promise.all([
        emailsService.getLicenses(),
        emailsService.getLicenseHistory(),
      ]);
      setLicenses(licensesResult);
      setHistory(historyResult);
      if (licensesResult.length > 0 && !selectedLicenseId) {
        setSelectedLicenseId(licensesResult[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [selectedLicenseId]);

  useEffect(() => {
    loadLicenses();
  }, [loadLicenses]);

  // ---------- FILTRAGE PAR TYPE ----------

  const packs = licenses.filter(l => l.type === "pack");
  const alacarte = licenses.filter(l => l.type === "alacarte");
  const included = licenses.filter(l => l.type === "included");

  // ---------- SÉLECTION ----------

  const selectLicense = useCallback((id: string) => {
    setSelectedLicenseId(id);
  }, []);

  const selectedLicense = licenses.find(l => l.id === selectedLicenseId) || null;

  // ---------- CALCULS ----------

  const getTotalCost = useCallback(() => {
    return licenses.reduce((sum, l) => sum + l.pricePerMonth, 0);
  }, [licenses]);

  const getAvailableLicenses = useCallback((offer?: EmailOffer) => {
    return licenses.filter(l => {
      const hasAvailable = l.usedLicenses < l.totalLicenses;
      const matchesOffer = !offer || l.offer === offer;
      return hasAvailable && matchesOffer;
    });
  }, [licenses]);

  // ---------- REFRESH ----------

  const refresh = useCallback(async () => {
    await loadLicenses();
  }, [loadLicenses]);

  return {
    licenses,
    packs,
    alacarte,
    included,
    history,
    loading,
    error,
    selectedLicense,
    selectLicense,
    refresh,
    getTotalCost,
    getAvailableLicenses,
  };
}
