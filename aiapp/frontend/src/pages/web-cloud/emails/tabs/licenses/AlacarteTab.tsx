// ============================================================
// SUB-TAB - Alacarte (Licences individuelles)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "../../components/OfferBadge";
import { EmailOffer } from "../../types";

interface AlacarteLicense {
  id: string;
  email: string;
  offer: EmailOffer;
  domain: string;
  pricePerMonth: number;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  renewalDate: string;
}

/** Sous-onglet À la carte - Gestion des licences individuelles. */
export default function AlacarteTab() {
  const { t } = useTranslation("web-cloud/emails/licenses");

  const [search, setSearch] = useState("");
  const [filterOffer, setFilterOffer] = useState<EmailOffer | "all">("all");

  // Mock data - remplacer par appel API
  const licenses: AlacarteLicense[] = useMemo(() => [
    {
      id: "1",
      email: "ceo@example.com",
      offer: "exchange",
      domain: "example.com",
      pricePerMonth: 6.99,
      status: "active",
      createdAt: "2022-01-15T00:00:00Z",
      renewalDate: "2024-02-15T00:00:00Z",
    },
    {
      id: "2",
      email: "freelance@project.io",
      offer: "email-pro",
      domain: "project.io",
      pricePerMonth: 3.99,
      status: "active",
      createdAt: "2023-06-01T00:00:00Z",
      renewalDate: "2024-06-01T00:00:00Z",
    },
    {
      id: "3",
      email: "test@dev.local",
      offer: "zimbra",
      domain: "dev.local",
      pricePerMonth: 4.99,
      status: "pending",
      createdAt: "2024-01-10T00:00:00Z",
      renewalDate: "2025-01-10T00:00:00Z",
    },
  ], []);

  const filteredLicenses = useMemo(() => {
    return licenses.filter((l) => {
      if (search && !l.email.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterOffer !== "all" && l.offer !== filterOffer) {
        return false;
      }
      return true;
    });
  }, [licenses, search, filterOffer]);

  const totalMonthly = useMemo(() => {
    return licenses.reduce((sum, l) => sum + l.pricePerMonth, 0);
  }, [licenses]);

  const handleAddLicense = () => {
    console.log("Add new license");
  };

  const handleEdit = (license: AlacarteLicense) => {
    console.log("Edit license", license.id);
  };

  const handleCancel = (license: AlacarteLicense) => {
    console.log("Cancel license", license.id);
  };

  const handleConvertToPack = () => {
    console.log("Convert to pack");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  return (
    <div className="alacarte-tab">
      {/* Summary */}
      <div className="alacarte-summary">
        <div className="summary-item">
          <span className="summary-value">{licenses.length}</span>
          <span className="summary-label">{t("alacarte.totalLicenses")}</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{totalMonthly.toFixed(2)} €</span>
          <span className="summary-label">{t("alacarte.monthlyTotal")}</span>
        </div>
        {licenses.length >= 5 && (
          <button className="btn btn-outline" onClick={handleConvertToPack}>
            📦 {t("alacarte.convertToPack")}
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-primary" onClick={handleAddLicense}>
            + {t("alacarte.actions.add")}
          </button>
        </div>
        <div className="emails-toolbar-right">
          <input
            type="text"
            className="filter-input"
            placeholder={t("alacarte.filters.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterOffer}
            onChange={(e) => setFilterOffer(e.target.value as EmailOffer | "all")}
          >
            <option value="all">{t("alacarte.filters.allOffers")}</option>
            <option value="exchange">Exchange</option>
            <option value="email-pro">Email Pro</option>
            <option value="zimbra">Zimbra</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredLicenses.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📄</div>
          <h3 className="emails-empty-title">{t("alacarte.empty.title")}</h3>
          <p className="emails-empty-text">{t("alacarte.empty.description")}</p>
          <button className="btn btn-primary" onClick={handleAddLicense}>
            + {t("alacarte.actions.add")}
          </button>
        </div>
      ) : (
        <table className="emails-table">
          <thead>
            <tr>
              <th>{t("alacarte.table.email")}</th>
              <th>{t("alacarte.table.offer")}</th>
              <th>{t("alacarte.table.domain")}</th>
              <th>{t("alacarte.table.price")}</th>
              <th>{t("alacarte.table.status")}</th>
              <th>{t("alacarte.table.renewal")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.map((license) => (
              <tr key={license.id}>
                <td>
                  <span className="email-primary">{license.email}</span>
                </td>
                <td>
                  <OfferBadge offer={license.offer} />
                </td>
                <td>
                  <span className="domain-name">{license.domain}</span>
                </td>
                <td>
                  <span className="price-cell">{license.pricePerMonth.toFixed(2)} €/mois</span>
                </td>
                <td>
                  <span className={`status-badge ${license.status === "active" ? "ok" : license.status === "pending" ? "pending" : "suspended"}`}>
                    {license.status === "active" ? "Actif" : license.status === "pending" ? "En attente" : "Suspendu"}
                  </span>
                </td>
                <td>
                  <span className="renewal-date">{formatDate(license.renewalDate)}</span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn"
                      title={t("alacarte.actions.edit")}
                      onClick={() => handleEdit(license)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn danger"
                      title={t("alacarte.actions.cancel")}
                      onClick={() => handleCancel(license)}
                    >
                      ✗
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
