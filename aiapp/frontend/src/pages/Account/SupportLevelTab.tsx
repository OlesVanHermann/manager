import { useState, useEffect } from "react";
import type { OvhCredentials, OvhUser } from "../../types/auth.types";
import * as accountService from "../../services/account.service";

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

function getUser(): OvhUser | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

interface SupportLevelInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: string;
  isCurrent: boolean;
}

const SUPPORT_LEVELS: Omit<SupportLevelInfo, "isCurrent">[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Support de base inclus avec tous les produits OVHcloud.",
    features: [
      "Acces aux guides et documentation",
      "Communaute et forum",
      "Assistance par ticket",
      "Temps de reponse sous 8h ouvrees",
    ],
    price: "Inclus",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Support prioritaire pour les besoins professionnels.",
    features: [
      "Tout le niveau Standard",
      "Support telephonique",
      "Temps de reponse sous 2h",
      "Suivi personnalise",
    ],
    price: "Sur devis",
  },
  {
    id: "business",
    name: "Business",
    description: "Support avance pour les entreprises exigeantes.",
    features: [
      "Tout le niveau Premium",
      "Technical Account Manager dedie",
      "Temps de reponse sous 1h",
      "Support 24/7",
      "Revues trimestrielles",
    ],
    price: "Sur devis",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Support sur mesure pour les grands comptes.",
    features: [
      "Tout le niveau Business",
      "Equipe dediee",
      "SLA personnalises",
      "Acces aux roadmaps produits",
      "Support proactif",
    ],
    price: "Sur devis",
  },
];

export default function SupportLevelTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>("standard");
  const user = getUser();

  useEffect(() => {
    loadSupportLevel();
  }, []);

  const loadSupportLevel = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const level = await accountService.getSupportLevel(credentials);
      setCurrentLevel(level.level || "standard");
    } catch (err) {
      setCurrentLevel("standard");
    } finally {
      setLoading(false);
    }
  };

  const getOrderUrl = (levelId: string): string => {
    const subsidiary = user?.ovhSubsidiary || "FR";
    const baseUrl = `https://www.ovh.com/${subsidiary.toLowerCase()}/order/express/`;
    return `${baseUrl}#/express/review?products=~(~(planCode~'support-${levelId}~quantity~1))`;
  };

  const handleContactSales = () => {
    window.open("https://www.ovhcloud.com/fr/contact/", "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement du niveau de support...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadSupportLevel} className="btn btn-primary">Reessayer</button>
        </div>
      </div>
    );
  }

  const levels: SupportLevelInfo[] = SUPPORT_LEVELS.map(level => ({
    ...level,
    isCurrent: level.id === currentLevel,
  }));

  const currentLevelInfo = levels.find(l => l.isCurrent);

  return (
    <div className="tab-content support-level-tab">
      <div className="support-header">
        <h2>Mon niveau de support</h2>
        <p>
          Choisissez le niveau de support adapte a vos besoins.
          Plus le niveau est eleve, plus vous beneficiez d'un accompagnement personnalise.
        </p>
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
              {level.features.map((feature, idx) => (
                <li key={idx}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="check-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="level-actions">
              {level.isCurrent ? (
                <button className="btn btn-secondary" disabled>Niveau actuel</button>
              ) : level.id === "standard" ? (
                <span className="included-text">Inclus par defaut</span>
              ) : (
                <a
                  href={getOrderUrl(level.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Souscrire
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="support-contact">
        <h3>Besoin d'aide pour choisir ?</h3>
        <p>Nos equipes commerciales sont disponibles pour vous conseiller sur le niveau de support le plus adapte a vos besoins.</p>
        <button className="btn btn-secondary" onClick={handleContactSales}>
          Contacter un conseiller
        </button>
      </div>
    </div>
  );
}
