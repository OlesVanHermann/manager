import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
  const { t } = useTranslation('login');
  const { login, isLoading, error } = useAuth();
  const [appKey, setAppKey] = useState("");
  const [appSecret, setAppSecret] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validationUrl = await login(appKey, appSecret);
      window.location.href = validationUrl;
    } catch {
      // Error handled in context
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">{t('title')}</h1>
        <p className="login-subtitle">{t('subtitle')}</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">{t('form.appKey')}</label>
            <input
              type="text"
              value={appKey}
              onChange={(e) => setAppKey(e.target.value)}
              className="login-input"
              placeholder={t('form.appKeyPlaceholder')}
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">{t('form.appSecret')}</label>
            <input
              type="password"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              className="login-input"
              placeholder={t('form.appSecretPlaceholder')}
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? t('form.loading') : t('form.submit')}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">{t('footer.noCredentials')}</p>
          <a href="https://eu.api.ovh.com/createApp/" target="_blank" rel="noopener noreferrer" className="login-footer-link">
            {t('footer.createApp')}
          </a>
        </div>
      </div>
    </div>
  );
}
