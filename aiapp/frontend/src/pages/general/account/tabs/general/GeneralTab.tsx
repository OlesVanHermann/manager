// ============================================================
// GENERAL TAB - Édition du profil utilisateur
// Styles: ./GeneralTab.css (préfixe .account-general-)
// Service: ./GeneralTab.service.ts (ISOLÉ)
// Types: ../../account.types.ts (niveau NAV2 uniquement)
// ============================================================

import "./GeneralTab.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhUser } from "../../account.types";
import * as generalService from "./GeneralTab.service";

// ============ TYPES LOCAUX ============

interface GeneralTabProps {
  user: OvhUser | null;
}

// ============ COMPOSANT ============

export function GeneralTab({ user }: GeneralTabProps) {
  const { t } = useTranslation("general/account/general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    language: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        zip: user.zip || "",
        country: user.country || "",
        language: user.language || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await generalService.updateProfile({
        firstname: formData.firstname,
        name: formData.name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        zip: formData.zip || undefined,
      });
      setSuccess(t("success"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        zip: user.zip || "",
        country: user.country || "",
        language: user.language || "",
      });
    }
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="account-general-content">
      <div className="account-general-header">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      <form onSubmit={handleSubmit} className="account-general-form">
        {/* Section Identité */}
        <div className="account-general-section">
          <h3>{t("sections.identity")}</h3>

          <div className="account-general-form-row">
            <div className="account-general-form-group">
              <label htmlFor="account-general-firstname">{t("fields.firstname")} *</label>
              <input
                type="text"
                id="account-general-firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="account-general-form-group">
              <label htmlFor="account-general-name">{t("fields.name")} *</label>
              <input
                type="text"
                id="account-general-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="account-general-form-group">
            <label htmlFor="account-general-email">{t("fields.email")}</label>
            <input
              type="email"
              id="account-general-email"
              name="email"
              value={formData.email}
              disabled
              className="account-general-input-disabled"
            />
            <small>{t("hints.emailDisabled")}</small>
          </div>

          <div className="account-general-form-group">
            <label htmlFor="account-general-phone">{t("fields.phone")}</label>
            <input
              type="tel"
              id="account-general-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33612345678"
            />
          </div>
        </div>

        {/* Section Adresse */}
        <div className="account-general-section">
          <h3>{t("sections.address")}</h3>

          <div className="account-general-form-group">
            <label htmlFor="account-general-address">{t("fields.address")}</label>
            <input
              type="text"
              id="account-general-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 rue Example"
            />
          </div>

          <div className="account-general-form-row">
            <div className="account-general-form-group">
              <label htmlFor="account-general-zip">{t("fields.zip")}</label>
              <input
                type="text"
                id="account-general-zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="75001"
              />
            </div>
            <div className="account-general-form-group">
              <label htmlFor="account-general-city">{t("fields.city")}</label>
              <input
                type="text"
                id="account-general-city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="account-general-form-group">
            <label htmlFor="account-general-country">{t("fields.country")}</label>
            <input
              type="text"
              id="account-general-country"
              name="country"
              value={formData.country}
              disabled
              className="account-general-input-disabled"
            />
            <small>{t("hints.countryDisabled")}</small>
          </div>
        </div>

        {/* Section Préférences */}
        <div className="account-general-section">
          <h3>{t("sections.preferences")}</h3>

          <div className="account-general-form-group">
            <label htmlFor="account-general-language">{t("fields.language")}</label>
            <input
              type="text"
              id="account-general-language"
              name="language"
              value={formData.language}
              disabled
              className="account-general-input-disabled"
            />
            <small>{t("hints.languageDisabled")}</small>
          </div>

          <div className="account-general-form-group">
            <label>{t("fields.nichandle")}</label>
            <input
              type="text"
              value={user?.nichandle || ""}
              disabled
              className="account-general-input-disabled"
            />
            <small>{t("hints.nichandleDisabled")}</small>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="account-general-message general-message-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="account-general-message general-message-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Actions */}
        <div className="account-general-actions">
          <button
            type="button"
            className="account-general-btn general-btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            {t("buttons.reset")}
          </button>
          <button
            type="submit"
            className="account-general-btn general-btn-primary"
            disabled={loading}
          >
            {loading ? t("buttons.saving") : t("buttons.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
