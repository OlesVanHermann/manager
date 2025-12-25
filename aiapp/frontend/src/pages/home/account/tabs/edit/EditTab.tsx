// ============================================================
// EDIT TAB - Édition du profil utilisateur
// Styles: ./EditTab.css (préfixe .edit-)
// Service: ./EditTab.service.ts (ISOLÉ)
// ============================================================

import "./EditTab.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhUser } from "../../../../../types/auth.types";
import * as editService from "./EditTab.service";

// ============ TYPES LOCAUX ============

interface EditTabProps {
  user: OvhUser | null;
}

// ============ COMPOSANT ============

export default function EditTab({ user }: EditTabProps) {
  const { t } = useTranslation("home/account/edit");
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
      await editService.updateProfile({
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
    <div className="edit-content">
      <div className="edit-header">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Section Identité */}
        <div className="edit-section">
          <h3>{t("sections.identity")}</h3>

          <div className="edit-form-row">
            <div className="edit-form-group">
              <label htmlFor="edit-firstname">{t("fields.firstname")} *</label>
              <input
                type="text"
                id="edit-firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="edit-name">{t("fields.name")} *</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-email">{t("fields.email")}</label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              disabled
              className="edit-input-disabled"
            />
            <small>{t("hints.emailDisabled")}</small>
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-phone">{t("fields.phone")}</label>
            <input
              type="tel"
              id="edit-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33612345678"
            />
          </div>
        </div>

        {/* Section Adresse */}
        <div className="edit-section">
          <h3>{t("sections.address")}</h3>

          <div className="edit-form-group">
            <label htmlFor="edit-address">{t("fields.address")}</label>
            <input
              type="text"
              id="edit-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 rue Example"
            />
          </div>

          <div className="edit-form-row">
            <div className="edit-form-group">
              <label htmlFor="edit-zip">{t("fields.zip")}</label>
              <input
                type="text"
                id="edit-zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="75001"
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="edit-city">{t("fields.city")}</label>
              <input
                type="text"
                id="edit-city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-country">{t("fields.country")}</label>
            <input
              type="text"
              id="edit-country"
              name="country"
              value={formData.country}
              disabled
              className="edit-input-disabled"
            />
            <small>{t("hints.countryDisabled")}</small>
          </div>
        </div>

        {/* Section Préférences */}
        <div className="edit-section">
          <h3>{t("sections.preferences")}</h3>

          <div className="edit-form-group">
            <label htmlFor="edit-language">{t("fields.language")}</label>
            <input
              type="text"
              id="edit-language"
              name="language"
              value={formData.language}
              disabled
              className="edit-input-disabled"
            />
            <small>{t("hints.languageDisabled")}</small>
          </div>

          <div className="edit-form-group">
            <label>{t("fields.nichandle")}</label>
            <input
              type="text"
              value={user?.nichandle || ""}
              disabled
              className="edit-input-disabled"
            />
            <small>{t("hints.nichandleDisabled")}</small>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="edit-message edit-message-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="edit-message edit-message-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Actions */}
        <div className="edit-actions">
          <button
            type="button"
            className="edit-btn edit-btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            {t("buttons.reset")}
          </button>
          <button
            type="submit"
            className="edit-btn edit-btn-primary"
            disabled={loading}
          >
            {loading ? t("buttons.saving") : t("buttons.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
