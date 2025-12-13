import { useState, useEffect } from "react";
import type { OvhUser, OvhCredentials } from "../../../types/auth.types";
import * as accountService from "../../../services/account.service";

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
      setError("Non authentifie");
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
      setSuccess("Profil mis a jour avec succes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise a jour");
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
        <h2>Editer mon profil</h2>
        <p>Modifiez vos informations personnelles. Certains champs ne peuvent pas etre modifies directement.</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-section">
          <h3>Identite</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname">Prenom *</label>
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
              <label htmlFor="name">Nom *</label>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="input-disabled"
            />
            <small>L'email ne peut pas etre modifie ici. Contactez le support pour changer d'email.</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telephone</label>
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
          <h3>Adresse</h3>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
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
              <label htmlFor="zip">Code postal</label>
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
              <label htmlFor="city">Ville</label>
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
            <label htmlFor="country">Pays</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              disabled
              className="input-disabled"
            />
            <small>Le pays ne peut pas etre modifie. Contactez le support si necessaire.</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Preferences</h3>

          <div className="form-group">
            <label htmlFor="language">Langue</label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              disabled
              className="input-disabled"
            />
            <small>La langue est geree dans les parametres du Manager.</small>
          </div>

          <div className="form-group">
            <label>Nichandle</label>
            <input
              type="text"
              value={user?.nichandle || ""}
              disabled
              className="input-disabled"
            />
            <small>Votre identifiant client OVHcloud (non modifiable).</small>
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
            Reinitialiser
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
