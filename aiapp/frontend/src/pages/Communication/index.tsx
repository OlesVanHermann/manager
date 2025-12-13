import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as accountService from "../../services/account.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

const tabs = [
  { id: "communications", label: "Mes communications" },
  { id: "settings", label: "Parametres de diffusion" },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("communications");

  return (
    <div className="communication-page">
      <div className="page-header">
        <h1>Mes communications</h1>
      </div>

      <div className="page-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content communication-content">
        {activeTab === "communications" && <CommunicationsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function CommunicationsTab() {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    // API /me/notification/email/history n'est pas disponible via proxy standard
    // On affiche un message explicatif
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="communications-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="communications-tab">
      <p className="tab-description">
        Retrouvez l'ensemble des communications qu'OVHcloud vous a envoyees, exceptees les demandes d'assistance. 
        Vous pouvez les consulter via la section : <a href="https://help.ovhcloud.com/csm" target="_blank" rel="noopener noreferrer">Assistance</a>
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th>Sujet</th>
            <th>Priorite</th>
            <th>Date</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          {emails.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-cell">Aucune communication</td>
            </tr>
          ) : (
            emails.map((email, idx) => (
              <tr key={idx}>
                <td>{email.subject}</td>
                <td>{email.priority}</td>
                <td>{email.date}</td>
                <td>{email.category}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [marketing, setMarketing] = useState<accountService.MarketingConsent | null>(null);

  useEffect(() => {
    loadMarketing();
  }, []);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadMarketing = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const data = await accountService.getMarketing(credentials);
      setMarketing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (category: "newsletter" | "offerAndDiscount" | "newProductRecommendation" | "events", value: boolean) => {
    const credentials = getCredentials();
    if (!credentials || !marketing) return;

    setSaving(true);
    setError(null);

    try {
      const updatedMarketing: accountService.MarketingConsent = {
        ...marketing,
        denyAll: false,
        email: {
          ...marketing.email,
          [category]: value,
        } as any,
      };

      await accountService.updateMarketing(credentials, updatedMarketing);
      setMarketing(updatedMarketing);
      setSuccessMessage("Preferences mises a jour");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !marketing) {
    return (
      <div className="settings-tab">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadMarketing}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-tab">
      {successMessage && (
        <div className="success-banner">
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      <div className="info-box">
        <h3>Parametres de diffusion</h3>
        <p>Configurez vos preferences de reception des communications OVHcloud.</p>
      </div>

      <div className="pref-card">
        <div className="pref-item">
          <div className="pref-info">
            <h3>Newsletters</h3>
            <p>Recevez les dernieres actualites et offres OVHcloud</p>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={marketing?.email?.newsletter || false}
              onChange={(e) => handleToggle("newsletter", e.target.checked)}
              disabled={saving}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="pref-item">
          <div className="pref-info">
            <h3>Offres et reductions</h3>
            <p>Soyez informe des promotions et nouveaux produits</p>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={marketing?.email?.offerAndDiscount || false}
              onChange={(e) => handleToggle("offerAndDiscount", e.target.checked)}
              disabled={saving}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="pref-item">
          <div className="pref-info">
            <h3>Recommandations produits</h3>
            <p>Decouvrez les produits adaptes a vos besoins</p>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={marketing?.email?.newProductRecommendation || false}
              onChange={(e) => handleToggle("newProductRecommendation", e.target.checked)}
              disabled={saving}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="pref-item">
          <div className="pref-info">
            <h3>Evenements</h3>
            <p>Invitations aux webinars, salons et evenements OVHcloud</p>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={marketing?.email?.events || false}
              onChange={(e) => handleToggle("events", e.target.checked)}
              disabled={saving}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
