// ============================================================
// HOSTING TAB: EMAILS - Scripts e-mail automatisés
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

interface AutomatedEmails {
  state: string;
  email?: string;
  bounceEmail?: string;
  volume?: {
    used: number;
    max: number;
  };
}

/** Onglet Scripts e-mail pour les emails automatisés. */
export function EmailsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [emailConfig, setEmailConfig] = useState<AutomatedEmails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const config = await hostingService.getAutomatedEmails(serviceName);
      setEmailConfig(config as AutomatedEmails);
      setNewEmail(config.email || "");
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const handleSave = async () => {
    try {
      await hostingService.updateAutomatedEmails(serviceName, { email: newEmail });
      setEditing(false);
      loadConfig();
    } catch (err) {
      alert(String(err));
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  const isActive = emailConfig?.state === 'active';

  return (
    <div className="emails-tab">
      <div className="tab-header">
        <div>
          <h3>Scripts e-mail</h3>
          <p className="tab-description">
            Gérez l'envoi d'emails automatisés depuis vos scripts PHP.
          </p>
        </div>
      </div>

      {/* Info aide */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <div>
          <p>
            Les scripts e-mail permettent à vos applications PHP d'envoyer des emails via la fonction mail().
            Vous pouvez configurer une adresse de réception pour les notifications d'erreurs.
          </p>
        </div>
      </div>

      {/* État du service */}
      <div className={`status-card ${isActive ? 'success' : 'inactive'}`}>
        <div className="status-icon">{isActive ? '✓' : '○'}</div>
        <div className="status-content">
          <h4>Scripts e-mail {isActive ? 'actifs' : 'inactifs'}</h4>
          <p>
            {isActive 
              ? "Vos scripts peuvent envoyer des emails via la fonction PHP mail()."
              : "L'envoi d'emails depuis vos scripts est désactivé."
            }
          </p>
        </div>
      </div>

      {/* Configuration */}
      <section className="config-block">
        <h4>Configuration</h4>
        
        <div className="info-grid">
          <div className="info-item">
            <label>État</label>
            <span className={`badge ${isActive ? 'success' : 'inactive'}`}>
              {isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>

          <div className="info-item">
            <label>Email de notification</label>
            {editing ? (
              <div className="edit-row">
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="form-input"
                />
                <button className="btn btn-primary btn-sm" onClick={handleSave}>Enregistrer</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Annuler</button>
              </div>
            ) : (
              <div className="value-row">
                <span className="font-mono">{emailConfig?.email || 'Non configuré'}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Modifier</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Volume */}
      {emailConfig?.volume && (
        <section className="config-block">
          <h4>Volume d'envoi</h4>
          <div className="quota-display">
            <div className="quota-bar">
              <div 
                className="quota-fill" 
                style={{ width: `${Math.min((emailConfig.volume.used / emailConfig.volume.max) * 100, 100)}%` }} 
              />
            </div>
            <div className="quota-text">
              <span>{emailConfig.volume.used} / {emailConfig.volume.max} emails</span>
              <span>{Math.round((emailConfig.volume.used / emailConfig.volume.max) * 100)}%</span>
            </div>
          </div>
        </section>
      )}

      {/* Guide */}
      <section className="config-block">
        <h4>Documentation</h4>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
          Apprenez à configurer et utiliser les scripts e-mail sur votre hébergement.
        </p>
        <a 
          href="https://help.ovhcloud.com/csm/fr-web-hosting-automated-emails" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
        >
          Consulter le guide ↗
        </a>
      </section>
    </div>
  );
}

export default EmailsTab;
