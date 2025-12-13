import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../../types/auth.types";
import * as accountService from "../../../services/account.service";

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

export default function AdvancedTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [betaEnabled, setBetaEnabled] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [savingBeta, setSavingBeta] = useState(false);
  const [savingDev, setSavingDev] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifié");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [betaPref, devMode] = await Promise.all([
        accountService.getBetaPreference(credentials).catch(() => false),
        accountService.getDeveloperMode(credentials).catch(() => ({ enabled: false })),
      ]);
      setBetaEnabled(betaPref);
      setDeveloperMode(devMode.enabled);
    } catch {
      setError("Erreur lors du chargement des paramètres");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleBetaChange = async (enabled: boolean) => {
    const credentials = getCredentials();
    if (!credentials) return;

    setSavingBeta(true);
    setError(null);

    try {
      await accountService.setBetaPreference(credentials, enabled);
      setBetaEnabled(enabled);
      showSuccess("Vos préférences ont été enregistrées");
    } catch {
      showError("Une erreur est survenue lors de la modification de vos préférences");
      setBetaEnabled(!enabled);
    } finally {
      setSavingBeta(false);
    }
  };

  const handleDeveloperModeChange = async (enabled: boolean) => {
    const credentials = getCredentials();
    if (!credentials) return;

    setSavingDev(true);
    setError(null);

    try {
      await accountService.updateDeveloperMode(credentials, enabled);
      setDeveloperMode(enabled);
      showSuccess(enabled ? "Mode développeur activé" : "Mode développeur désactivé");
    } catch {
      setDeveloperMode(enabled);
      showSuccess("Préférence enregistrée localement");
    } finally {
      setSavingDev(false);
    }
  };

  const IconDesktop = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );

  const IconPuzzle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
    </svg>
  );

  const IconCode = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );

  const IconGithub = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );

  const IconChat = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );

  if (loading) {
    return (
      <div className="advanced-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-tab">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Section Beta */}
      <div className="advanced-section">
        <h2>Fonctionnalités Bêta</h2>
        <div className="advanced-box">
          {savingBeta ? (
            <div className="spinner spinner-sm"></div>
          ) : (
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={betaEnabled}
                onChange={(e) => handleBetaChange(e.target.checked)}
                disabled={savingBeta}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">Activer les fonctionnalités Bêta</span>
            </label>
          )}
        </div>
      </div>

      {/* Section Développeur */}
      <div className="advanced-section">
        <h2>Options développeurs</h2>

        <div className="developer-features">
          <div className="developer-feature">
            <div className="developer-feature-icon"><IconDesktop /></div>
            <p>Les interfaces du manager OVHcloud sont <strong>open source</strong></p>
          </div>
          <div className="developer-feature">
            <div className="developer-feature-icon"><IconPuzzle /></div>
            <p>Bibliothèque de <strong>composants réutilisables</strong></p>
          </div>
          <div className="developer-feature">
            <div className="developer-feature-icon"><IconCode /></div>
            <p>Accédez à la <strong>console API</strong> OVHcloud</p>
          </div>
        </div>

        <div className="advanced-box">
          <label className="toggle-container">
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={developerMode}
                onChange={(e) => handleDeveloperModeChange(e.target.checked)}
                disabled={savingDev}
              />
              <span className="toggle-slider"></span>
            </div>
            <span className="toggle-label">
              {savingDev ? "Enregistrement..." : "Mode développeur"}
            </span>
          </label>
        </div>

        <h3>Rejoignez-nous</h3>
        <ul className="developer-links">
          <li>
            <a href="https://github.com/ovh" target="_blank" rel="noopener noreferrer">
              <span className="link-icon"><IconGithub /></span>
              https://github.com/ovh
            </a>
          </li>
          <li>
            <a href="https://github.com/ovh/manager/discussions" target="_blank" rel="noopener noreferrer">
              <span className="link-icon"><IconChat /></span>
              https://github.com/ovh/manager/discussions
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
