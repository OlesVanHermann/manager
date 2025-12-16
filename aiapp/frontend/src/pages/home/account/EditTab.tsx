import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhUser, OvhCredentials } from "../../../types/auth.types";
import * as accountService from "../../../services/home.account";

interface ProfileEditTabProps {
  user: OvhUser | null;
}

const STORAGE_KEY = "ovh_credentials";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export default function ProfileEditTab({ user }: ProfileEditTabProps) {
  const { t } = useTranslation('home/account/edit');
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
    const credentials = getCredentials();
    if (!credentials) {
      setError(t('errors.notAuthenticated'));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await accountService.updateProfile(credentials, {
        firstname: formData.firstname,
        name: formData.name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        zip: formData.zip || undefined,
      });
      setSuccess(t('success'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.updateFailed'));
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
    <div className="tab-content profile-edit-tab">
      <div className="profile-edit-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-section">
          <h3>{t('sections.identity')}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname">{t('fields.firstname')} *</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">{t('fields.name')} *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('fields.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="input-disabled"
            />
            <small>{t('hints.emailDisabled')}</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t('fields.phone')}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33612345678"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>{t('sections.address')}</h3>

          <div className="form-group">
            <label htmlFor="address">{t('fields.address')}</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 rue Example"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zip">{t('fields.zip')}</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="75001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">{t('fields.city')}</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">{t('fields.country')}</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              disabled
              className="input-disabled"
            />
            <small>{t('hints.countryDisabled')}</small>
          </div>
        </div>

        <div className="form-section">
          <h3>{t('sections.preferences')}</h3>

          <div className="form-group">
            <label htmlFor="language">{t('fields.language')}</label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              disabled
              className="input-disabled"
            />
            <small>{t('hints.languageDisabled')}</small>
          </div>

          <div className="form-group">
            <label>{t('fields.nichandle')}</label>
            <input
              type="text"
              value={user?.nichandle || ""}
              disabled
              className="input-disabled"
            />
            <small>{t('hints.nichandleDisabled')}</small>
          </div>
        </div>

        {error && (
          <div className="form-message error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="form-message success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>
            {t('buttons.reset')}
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('buttons.saving') : t('buttons.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
