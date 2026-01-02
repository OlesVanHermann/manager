// ============================================================
// SUB-TAB - Alacarte (Comptes individuels avec facturation)
// ============================================================

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "../OfferBadge";
import { services, billing } from "../api";
import type { EmailServiceSummary, EmailServiceType, AccountBilling, RenewPeriod } from "../api";
import type { EmailOffer } from "../types";

interface AccountDisplay {
  id: string;
  email: string;
  displayName?: string;
  offer: EmailOffer;
  serviceId: string;
  serviceType: EmailServiceType;
  organization?: string;
  domain: string;
  license: string;
  renewPeriod: RenewPeriod;
  deleteAtExpiration: boolean;
  quota: number;
  usedQuota: number;
  status: "active" | "suspended" | "pending";
  createdAt?: string;
  expirationDate?: string;
}

/** Sous-onglet À la carte - Gestion des comptes individuels. */
export default function AlacarteTab() {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [accounts, setAccounts] = useState<AccountDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterOffer, setFilterOffer] = useState<EmailOffer | "all">("all");
  const [filterRenew, setFilterRenew] = useState<RenewPeriod | "all">("all");

  // Chargement des comptes avec facturation
  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Récupérer tous les services
      const allServices = await services.getAllEmailServices();

      // 2. Pour chaque service, récupérer les comptes avec facturation
      const allAccounts: AccountDisplay[] = [];

      for (const svc of allServices) {
        try {
          if (svc.type === "exchange" || svc.type === "emailpro" || svc.type === "mxplan") {
            const billingAccounts = await billing.getAccountsBillingForService(
              svc.type,
              svc.id,
              svc.organization,
              { count: 1000 }
            );

            // Mapper l'offre
            let offer: EmailOffer = "mx-plan";
            if (svc.type === "exchange") offer = "exchange";
            else if (svc.type === "emailpro") offer = "email-pro";

            for (const acc of billingAccounts) {
              allAccounts.push({
                id: `${svc.id}-${acc.primaryEmailAddress}`,
                email: acc.primaryEmailAddress,
                displayName: acc.displayName,
                offer,
                serviceId: svc.id,
                serviceType: svc.type,
                organization: svc.organization,
                domain: acc.domain,
                license: acc.accountLicense,
                renewPeriod: acc.renewPeriod,
                deleteAtExpiration: acc.deleteAtExpiration,
                quota: acc.quota,
                usedQuota: acc.usedQuota,
                status: acc.state === "ok" ? "active" : acc.state === "suspended" ? "suspended" : "pending",
                createdAt: acc.creationDate,
                expirationDate: acc.expirationDate,
              });
            }
          }
        } catch (err) {
          console.warn(`Failed to get accounts for service ${svc.id}:`, err);
        }
      }

      setAccounts(allAccounts);
    } catch (err) {
      console.error("Failed to load accounts:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Filtrage des comptes
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      if (search && !acc.email.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterOffer !== "all" && acc.offer !== filterOffer) {
        return false;
      }
      if (filterRenew !== "all" && acc.renewPeriod !== filterRenew) {
        return false;
      }
      return true;
    });
  }, [accounts, search, filterOffer, filterRenew]);

  // Stats
  const stats = useMemo(() => {
    const byRenew = {
      MONTHLY: accounts.filter(a => a.renewPeriod === "MONTHLY").length,
      YEARLY: accounts.filter(a => a.renewPeriod === "YEARLY").length,
      DELETE_AT_EXPIRATION: accounts.filter(a => a.renewPeriod === "DELETE_AT_EXPIRATION").length,
    };
    return {
      total: accounts.length,
      active: accounts.filter(a => a.status === "active").length,
      byRenew,
    };
  }, [accounts]);

  const handleEdit = async (account: AccountDisplay) => {
    // TODO: Ouvrir modal d'édition du renouvellement
    console.log("Edit account:", account.email);
  };

  const handleToggleRenew = async (account: AccountDisplay) => {
    // Toggle entre renouvellement auto et résiliation
    const newPeriod: RenewPeriod = account.deleteAtExpiration ? "MONTHLY" : "DELETE_AT_EXPIRATION";

    try {
      await billing.updateAccountsRenewForService(
        account.serviceType,
        account.serviceId,
        [{ primaryEmailAddress: account.email, renewPeriod: newPeriod, deleteAtExpiration: !account.deleteAtExpiration }],
        account.organization
      );
      // Refresh
      loadAccounts();
    } catch (err) {
      console.error("Failed to update renew:", err);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  const formatQuota = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} Go`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} Mo`;
    return `${bytes} o`;
  };

  const getRenewLabel = (period: RenewPeriod) => {
    switch (period) {
      case "MONTHLY": return t("renew.monthly", "Mensuel");
      case "YEARLY": return t("renew.yearly", "Annuel");
      case "DELETE_AT_EXPIRATION": return t("renew.delete", "Résiliation");
      default: return period;
    }
  };

  if (loading) {
    return (
      <div className="alacarte-tab">
        <div className="emails-loading">
          <div className="loading-spinner" />
          <p>{t("loading", "Chargement des comptes...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alacarte-tab">
        <div className="emails-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadAccounts}>
            {t("retry", "Réessayer")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="alacarte-tab">
      {/* Summary */}
      <div className="alacarte-summary">
        <div className="summary-item">
          <span className="summary-value">{stats.total}</span>
          <span className="summary-label">{t("alacarte.totalAccounts", "Comptes")}</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{stats.active}</span>
          <span className="summary-label">{t("alacarte.activeAccounts", "Actifs")}</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{stats.byRenew.MONTHLY}</span>
          <span className="summary-label">{t("alacarte.monthlyRenew", "Mensuels")}</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{stats.byRenew.DELETE_AT_EXPIRATION}</span>
          <span className="summary-label text-warning">{t("alacarte.toDelete", "À résilier")}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-outline" onClick={loadAccounts}>
            ↻ {t("refresh", "Actualiser")}
          </button>
        </div>
        <div className="emails-toolbar-right">
          <input
            type="text"
            className="filter-input"
            placeholder={t("alacarte.filters.search", "Rechercher...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterOffer}
            onChange={(e) => setFilterOffer(e.target.value as EmailOffer | "all")}
          >
            <option value="all">{t("alacarte.filters.allOffers", "Toutes les offres")}</option>
            <option value="exchange">Exchange</option>
            <option value="email-pro">Email Pro</option>
            <option value="mx-plan">MX Plan</option>
          </select>
          <select
            className="filter-select"
            value={filterRenew}
            onChange={(e) => setFilterRenew(e.target.value as RenewPeriod | "all")}
          >
            <option value="all">{t("alacarte.filters.allRenew", "Tous les types")}</option>
            <option value="MONTHLY">{t("renew.monthly", "Mensuel")}</option>
            <option value="YEARLY">{t("renew.yearly", "Annuel")}</option>
            <option value="DELETE_AT_EXPIRATION">{t("renew.delete", "Résiliation")}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredAccounts.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📄</div>
          <h3 className="emails-empty-title">{t("alacarte.empty.title", "Aucun compte")}</h3>
          <p className="emails-empty-text">{t("alacarte.empty.description", "Aucun compte ne correspond à vos critères.")}</p>
        </div>
      ) : (
        <table className="emails-table">
          <thead>
            <tr>
              <th>{t("alacarte.table.email", "Email")}</th>
              <th>{t("alacarte.table.offer", "Offre")}</th>
              <th>{t("alacarte.table.license", "Licence")}</th>
              <th>{t("alacarte.table.quota", "Quota")}</th>
              <th>{t("alacarte.table.renew", "Renouvellement")}</th>
              <th>{t("alacarte.table.status", "Statut")}</th>
              <th>{t("alacarte.table.expiration", "Expiration")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <div className="email-cell">
                    <span className="email-primary">{account.email}</span>
                    {account.displayName && (
                      <span className="email-display">{account.displayName}</span>
                    )}
                  </div>
                </td>
                <td>
                  <OfferBadge offer={account.offer} />
                </td>
                <td>
                  <span className="license-badge">{account.license}</span>
                </td>
                <td>
                  <div className="quota-cell">
                    <span>{formatQuota(account.usedQuota)}</span>
                    <span className="quota-separator">/</span>
                    <span>{formatQuota(account.quota)}</span>
                  </div>
                </td>
                <td>
                  <span className={`renew-badge ${account.deleteAtExpiration ? "delete" : "active"}`}>
                    {getRenewLabel(account.renewPeriod)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${account.status === "active" ? "ok" : account.status === "pending" ? "pending" : "suspended"}`}>
                    {account.status === "active" ? t("status.active", "Actif") : account.status === "pending" ? t("status.pending", "En attente") : t("status.suspended", "Suspendu")}
                  </span>
                </td>
                <td>
                  <span className={`expiration-date ${account.deleteAtExpiration ? "text-warning" : ""}`}>
                    {formatDate(account.expirationDate)}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn"
                      title={t("alacarte.actions.edit", "Modifier")}
                      onClick={() => handleEdit(account)}
                    >
                      ✎
                    </button>
                    <button
                      className={`action-btn ${account.deleteAtExpiration ? "success" : "danger"}`}
                      title={account.deleteAtExpiration ? t("alacarte.actions.enableRenew", "Réactiver") : t("alacarte.actions.disableRenew", "Résilier")}
                      onClick={() => handleToggleRenew(account)}
                    >
                      {account.deleteAtExpiration ? "↻" : "✗"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination info */}
      <div className="table-footer">
        <span className="table-count">
          {filteredAccounts.length} {t("alacarte.results", "résultat(s)")}
          {filteredAccounts.length !== accounts.length && ` / ${accounts.length} ${t("alacarte.total", "total")}`}
        </span>
      </div>
    </div>
  );
}
