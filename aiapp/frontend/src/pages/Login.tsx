import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
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
        <h1 className="login-title">New Manager</h1>
        <p className="login-subtitle">Connectez-vous avec vos credentials OVH API</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Application Key</label>
            <input
              type="text"
              value={appKey}
              onChange={(e) => setAppKey(e.target.value)}
              className="login-input"
              placeholder="Votre Application Key"
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Application Secret</label>
            <input
              type="password"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              className="login-input"
              placeholder="Votre Application Secret"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">Pas encore de credentials ?</p>
          <a href="https://eu.api.ovh.com/createApp/" target="_blank" rel="noopener noreferrer" className="login-footer-link">Creer une application sur eu.api.ovh.com</a>
        </div>
      </div>
    </div>
  );
}
