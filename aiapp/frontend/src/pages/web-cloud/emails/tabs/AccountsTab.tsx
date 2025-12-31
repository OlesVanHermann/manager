// ============================================================
// TAB - Accounts (Liste des comptes email)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer, EmailAccount } from "../types";
import { OfferBadge } from "../components/OfferBadge";
import { useEmailAccounts } from "../hooks/useEmailAccounts";
import {
  CreateAccountModal,
  EditAccountModal,
  DeleteAccountModal,
} from "../modals";

interface AccountsTabProps {
  domain?: string;
  licenseId?: string;
  offers: EmailOffer[];
}

/** Onglet Comptes - Liste et gestion des boîtes email. */
export default function AccountsTab({ domain, licenseId, offers }: AccountsTabProps) {
  const { t } = useTranslation("web-cloud/emails/accounts");

  // ---------- DATA LOADING ----------
  const { accounts, loading, error, refresh } = useEmailAccounts({
    domain,
    licenseId,
    offers,
  });

  // ---------- STATE ----------
  const [search, setSearch] = useState("");
  const [filterOffer, setFilterOffer] = useState<EmailOffer | "all">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null);

  // ---------- FILTERING ----------
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      if (search && !acc.email.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterOffer !== "all" && acc.offer !== filterOffer) {
        return false;
      }
      if (filterStatus !== "all" && acc.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [accounts, search, filterOffer, filterStatus]);

  // ---------- HANDLERS ----------
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (account: EmailAccount) => {
    setSelectedAccount(account);
    setShowEditModal(true);
  };

  const handleDelete = (account: EmailAccount) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const handleWebmail = (account: EmailAccount) => {
    window.open(`https://webmail.ovh.net/?email=${account.email}`, "_blank");
  };

  // Modal submit handlers
  const handleCreateSubmit = async (data: {
    localPart: string;
    displayName: string;
    offer: EmailOffer;
    password: string;
    quota: number;
    sendWelcomeEmail: boolean;
  }) => {
    // TODO: Appel API pour créer le compte
    console.log("Create account:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refresh();
  };

  const handleEditSubmit = async (data: {
    displayName: string;
    quota: number;
    newPassword?: string;
  }) => {
    // TODO: Appel API pour modifier le compte
    console.log("Edit account:", selectedAccount?.id, data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refresh();
  };

  const handleDeleteSubmit = async () => {
    // TODO: Appel API pour supprimer le compte
    console.log("Delete account:", selectedAccount?.id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refresh();
  };

  // ---------- LOADING STATE ----------
  if (loading) {
    return (
      <div className="accounts-tab">
        <div className="emails-loading">
          <div className="loading-spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- ERROR STATE ----------
  if (error) {
    return (
      <div className="accounts-tab">
        <div className="emails-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button className="btn btn-outline" onClick={refresh}>
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="accounts-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("actions.create")}
          </button>
        </div>
        <div className="emails-toolbar-right">
          <input
            type="text"
            className="filter-input"
            placeholder={t("filters.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-chips">
            <button
              className={`filter-chip ${filterOffer === "all" ? "active" : ""}`}
              onClick={() => setFilterOffer("all")}
            >
              {t("filters.allOffers")}
            </button>
            {offers.map((offer) => (
              <button
                key={offer}
                className={`filter-chip ${filterOffer === offer ? "active" : ""}`}
                onClick={() => setFilterOffer(offer)}
              >
                <OfferBadge offer={offer} size="sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Domain indicator */}
      {domain && (
        <div className="domain-indicator">
          <span className="domain-label">{t("currentDomain")}:</span>
          <span className="domain-value">{domain}</span>
          <span className="accounts-count">({accounts.length} {t("table.accounts")})</span>
        </div>
      )}

      {/* Table */}
      {filteredAccounts.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📭</div>
          <h3 className="emails-empty-title">{t("empty.title")}</h3>
          <p className="emails-empty-text">{t("empty.description")}</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("actions.create")}
          </button>
        </div>
      ) : (
        <table className="emails-table">
          <thead>
            <tr>
              <th>{t("table.email")}</th>
              <th>{t("table.offer")}</th>
              <th>{t("table.quota")}</th>
              <th>{t("table.status")}</th>
              <th>{t("table.lastLogin")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <div className="email-cell">
                    <span className="email-primary">{account.email}</span>
                    <span className="email-secondary">
                      {account.displayName || `${account.firstName || ""} ${account.lastName || ""}`.trim() || "-"}
                    </span>
                  </div>
                </td>
                <td>
                  <OfferBadge offer={account.offer} />
                </td>
                <td>
                  <QuotaCell used={account.quotaUsed} total={account.quota} />
                </td>
                <td>
                  <StatusBadge status={account.status} />
                </td>
                <td>
                  {account.lastLogin
                    ? new Date(account.lastLogin).toLocaleDateString("fr-FR")
                    : "-"}
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn"
                      title={t("actions.webmail")}
                      onClick={() => handleWebmail(account)}
                    >
                      ↗
                    </button>
                    <button
                      className="action-btn"
                      title={t("actions.edit")}
                      onClick={() => handleEdit(account)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn danger"
                      title={t("actions.delete")}
                      onClick={() => handleDelete(account)}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modals */}
      <CreateAccountModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        domain={domain || "example.com"}
        availableOffers={offers}
        onSubmit={handleCreateSubmit}
      />

      <EditAccountModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount ? {
          id: selectedAccount.id,
          email: selectedAccount.email,
          displayName: selectedAccount.displayName || "",
          offer: selectedAccount.offer,
          quota: { used: selectedAccount.quotaUsed * 1024 * 1024, total: selectedAccount.quota * 1024 * 1024 },
        } : null}
        onSubmit={handleEditSubmit}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount ? {
          id: selectedAccount.id,
          email: selectedAccount.email,
          displayName: selectedAccount.displayName || "",
        } : null}
        onConfirm={handleDeleteSubmit}
      />
    </div>
  );
}

// ---------- SUB-COMPONENTS ----------

function QuotaCell({ used, total }: { used: number; total: number }) {
  // Convert from MB to bytes for display
  const usedBytes = used * 1024 * 1024;
  const totalBytes = total * 1024 * 1024;
  const percent = total > 0 ? (used / total) * 100 : 0;
  const color = percent > 90 ? "#EF4444" : percent > 70 ? "#F59E0B" : "#10B981";

  return (
    <div className="quota-cell">
      <div className="quota-bar">
        <div
          className="quota-bar-fill"
          style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="quota-text">
        {formatBytes(usedBytes)} / {formatBytes(totalBytes)}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    ok: "Actif",
    pending: "En attente",
    suspended: "Suspendu",
    deleting: "Suppression",
  };

  return <span className={`status-badge ${status}`}>{labels[status] || status}</span>;
}

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} Go`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} Mo`;
}
