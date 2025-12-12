import { useState, useEffect } from "react";
import * as accountService from "../../services/account.service";
import type { OvhCredentials } from "../../types/auth.types";

const STORAGE_KEY = "ovh_credentials";

const supportLevels = [
  {
    id: "standard",
    name: "Standard",
    description: "Une assistance numerique toujours disponible, et un acces a nos experts dans les moments critiques.",
    color: "var(--color-support-standard)",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Un acces direct a nos experts pour un accompagnement a la configuration et a l'utilisation de votre solution au quotidien, et dans les moments critiques.",
    recommended: true,
    color: "var(--color-support-premium)",
  },
  {
    id: "business",
    name: "Business",
    description: "Un service client 24/7 avec un temps de reponse optimise adapte a des enjeux majeurs.",
    color: "var(--color-support-business)",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Un service client 24/7 au travers d'une relation privilegiee avec une equipe dediee pour vous accompagner a relever vos defis business.",
    color: "var(--color-support-enterprise)",
  },
];

export default function SupportLevelTab() {
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSupportLevel();
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

  const loadSupportLevel = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const level = await accountService.getSupportLevel(credentials);
      setCurrentLevel(level.level);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadSupportLevel}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content support-tab">
      <div className="support-intro">
        <h2>Mon niveau de support</h2>
        <h3>Quels sont les differents niveaux de support ?</h3>
        <p>
          Pour repondre a chacune de vos specificites, OVHcloud a mis en place 4 niveaux d'accompagnement. 
          Par defaut, nos solutions sont livrees avec le niveau Standard. Selon les solutions auxquelles vous souscrivez, 
          nous vous recommandons un niveau de support qui vous fera beneficier au mieux d'un accompagnement de nos experts. 
          Vous avez neanmoins le choix de garder votre niveau de support actuel, ou de souscrire a un niveau autre que celui recommande.
        </p>
      </div>

      <div className="support-levels-grid">
        {supportLevels.map((level) => {
          const isCurrentLevel = currentLevel === level.id;
          return (
            <div 
              key={level.id} 
              className={`support-level-card ${isCurrentLevel ? "current" : ""}`}
              style={{ borderTopColor: level.color }}
            >
              <div className="level-header">
                <h4>{level.name}</h4>
                {level.recommended && (
                  <span className="recommended-badge" style={{ backgroundColor: level.color }}>
                    Niveau recommande
                  </span>
                )}
              </div>
              
              <div className="level-illustration">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={level.color}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>

              <p className="level-description">{level.description}</p>

              <div className="level-actions">
                {isCurrentLevel ? (
                  <span className="current-level-badge">Votre niveau actuel</span>
                ) : (
                  <a 
                    href={`https://www.ovh.com/manager/#/billing/autorenew/supportLevel?level=${level.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Souscrire
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
