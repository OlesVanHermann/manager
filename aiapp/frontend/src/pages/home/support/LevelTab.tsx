import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../../types/auth.types";
import * as accountService from "../../../services/account.service";

const STORAGE_KEY = "ovh_credentials";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

interface SupportLevelInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: string;
  isCurrent: boolean;
  actionType: "none" | "included" | "upgrade" | "contact";
}

const SUPPORT_LEVELS: Omit<SupportLevelInfo, "isCurrent">[] = [
  { id: "standard", name: "Standard", description: "Support de base inclus avec tous les produits OVHcloud.", features: ["Acces aux guides et documentation", "Communaute et forum", "Assistance par ticket", "Temps de reponse sous 8h ouvrees"], price: "Inclus", actionType: "included" },
  { id: "premium", name: "Premium", description: "Support prioritaire pour les besoins professionnels.", features: ["Tout le niveau Standard", "Support telephonique", "Temps de reponse sous 2h", "Suivi personnalise", "Support 24/7 pour les incidents (en anglais)"], price: "Sur devis", actionType: "contact" },
  { id: "business", name: "Business", description: "Support avance pour les entreprises exigeantes.", features: ["Tout le niveau Premium", "Technical Account Manager dedie", "Temps de reponse sous 1h", "Support 24/7 telephone et tickets", "Priorisation des demandes"], price: "Sur devis", actionType: "contact" },
  { id: "enterprise", name: "Enterprise", description: "Support sur mesure pour les grands comptes.", features: ["Tout le niveau Business", "Equipe dediee", "SLA personnalises", "Acces aux roadmaps produits", "Audits de securite (4h/an)", "Temps de reponse 15 min (P1)"], price: "Sur devis", actionType: "contact" },
];

const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
  premium: "https://www.ovhcloud.com/fr/support-levels/",
  business: "https://www.ovhcloud.com/fr/support-levels/",
  enterprise: "https://www.ovhcloud.com/fr/support-levels/",
};

export default function SupportLevelTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>("standard");

  useEffect(() => { loadSupportLevel(); }, []);

  const loadSupportLevel = async () => {
    const credentials = getCredentials();
    if (!credentials) { setError("Non authentifie"); setLoading(false); return; }
    try {
      const level = await accountService.getSupportLevel(credentials);
      const normalizedLevel = level.level?.toLowerCase().replace("-accredited", "") || "standard";
      setCurrentLevel(normalizedLevel);
    } catch { setCurrentLevel("standard"); }
    finally { setLoading(false); }
  };

  const getLevelUrl = (levelId: string): string => {
    switch (levelId) {
      case "premium": return SUPPORT_URLS.premium;
      case "business": return SUPPORT_URLS.business;
      case "enterprise": return SUPPORT_URLS.enterprise;
      default: return SUPPORT_URLS.comparison;
    }
  };

  if (loading) {
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>Chargement du niveau de support...</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-state"><p>{error}</p><button onClick={loadSupportLevel} className="btn btn-primary">Reessayer</button></div></div>;
  }

  const levels: SupportLevelInfo[] = SUPPORT_LEVELS.map(level => ({ ...level, isCurrent: level.id === currentLevel }));
  const currentLevelInfo = levels.find(l => l.isCurrent);

  return (
    <div className="tab-content support-level-tab">
      <div className="support-header">
        <h2>Mon niveau de support</h2>
        <p>Choisissez le niveau de support adapte a vos besoins.</p>
        <a href={SUPPORT_URLS.comparison} target="_blank" rel="noopener noreferrer" className="comparison-link">
          Voir le comparatif complet des niveaux de support
        </a>
      </div>

      {currentLevelInfo && (
        <div className="current-level-banner">
          <div className="current-level-info">
            <span className="current-label">Votre niveau actuel</span>
            <span className="current-name">{currentLevelInfo.name}</span>
          </div>
          <span className="badge badge-primary">Actif</span>
        </div>
      )}

      <div className="support-levels-grid">
        {levels.map((level) => (
          <div key={level.id} className={`support-level-card ${level.isCurrent ? "current" : ""}`}>
            <div className="level-header">
              <h3>{level.name}</h3>
              {level.isCurrent && <span className="badge badge-success">Actuel</span>}
            </div>
            <p className="level-description">{level.description}</p>
            <div className="level-price">{level.price}</div>
            <ul className="level-features">
              {level.features.map((feature, idx) => (<li key={idx}>{feature}</li>))}
            </ul>
            <div className="level-actions">
              {level.isCurrent ? (
                <button className="btn btn-secondary" disabled>Niveau actuel</button>
              ) : level.actionType === "included" ? (
                <span className="included-text">Inclus par defaut</span>
              ) : (
                <a href={getLevelUrl(level.id)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">En savoir plus</a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="support-contact">
        <h3>Besoin d'aide pour choisir ?</h3>
        <p>Contactez nos equipes commerciales.</p>
        <a href={SUPPORT_URLS.contact} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Contacter un conseiller</a>
      </div>

      <div className="support-help">
        <h4>Liens utiles</h4>
        <div className="help-links">
          <a href="https://help.ovhcloud.com/" target="_blank" rel="noopener noreferrer">Centre d'aide OVHcloud</a>
          <a href="https://community.ovh.com/c/fr" target="_blank" rel="noopener noreferrer">Communaute OVHcloud</a>
          <a href="https://docs.ovh.com/fr/" target="_blank" rel="noopener noreferrer">Documentation technique</a>
          <a href="https://status.ovhcloud.com/" target="_blank" rel="noopener noreferrer">Statut des services</a>
        </div>
      </div>
    </div>
  );
}
