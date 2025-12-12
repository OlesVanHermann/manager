import { useState, useEffect } from "react";
import * as securityService from "../../services/security.service";
import type { OvhCredentials } from "../../types/auth.types";

const STORAGE_KEY = "ovh_credentials";

export default function SecurityTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorStatus, setTwoFactorStatus] = useState<securityService.TwoFactorStatus | null>(null);

  useEffect(() => {
    loadSecurityData();
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

  const loadSecurityData = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const status = await securityService.getTwoFactorStatus(credentials);
      setTwoFactorStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
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
          <button onClick={loadSecurityData}>Reessayer</button>
        </div>
      </div>
    );
  }

  const enabledSms = twoFactorStatus?.sms.filter(s => s.status === "enabled") || [];
  const enabledTotp = twoFactorStatus?.totp.filter(t => t.status === "enabled") || [];
  const enabledU2f = twoFactorStatus?.u2f.filter(u => u.status === "enabled") || [];

  return (
    <div className="tab-content security-tab">
      {/* Warning Banner */}
      <div className="security-warning">
        <div className="warning-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <div className="warning-content">
          <strong>Attention !</strong>
          <p>
            Les actions effectuees sur cette page modifient les parametres de securite de votre compte.
            En cas de perte ou de vol de votre smartphone ou de votre ordinateur, stockez vos mots de passe 
            et la liste de vos codes de secours a usage unique dans un endroit securise. 
            Ne divulguez aucune information confidentielle.
          </p>
        </div>
      </div>

      {/* Password Section */}
      <div className="security-card">
        <div className="security-card-header">
          <div className="security-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3>Mot de passe</h3>
          <a 
            href="https://www.ovh.com/manager/#/useraccount/security/password" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Modifier
          </a>
        </div>
      </div>

      {/* Double Authentication Section */}
      <div className="security-card">
        <div className="security-card-header">
          <div className="security-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h3>Double authentification</h3>
          <span className={`status-text ${twoFactorStatus?.isEnabled ? "status-active" : "status-inactive"}`}>
            {twoFactorStatus?.isEnabled ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        {/* SMS */}
        <div className="two-factor-method">
          <div className="method-header">
            <div className="method-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              <span className="method-label">1234</span>
            </div>
            <div className="method-info">
              <h4>
                {enabledSms.length > 0 && <span className="check-icon">✓</span>}
                SMS
              </h4>
              <p>S'authentifier a l'aide d'un code de securite recu par SMS.</p>
            </div>
          </div>

          {enabledSms.length > 0 && (
            <div className="method-details">
              <table className="method-table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {enabledSms.map((sms) => (
                    <tr key={sms.id}>
                      <td>{sms.phoneNumber}</td>
                      <td>
                        {sms.description || "-"}
                        {sms.lastUsedDate && (
                          <span className="last-used">(Derniere utilisation : {formatDate(sms.lastUsedDate)})</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button className="btn-icon" title="Actions">•••</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <a 
            href="https://www.ovh.com/manager/#/useraccount/security/sms/add" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Ajouter un numero
          </a>
        </div>

        {/* TOTP - Application Mobile */}
        <div className="two-factor-method">
          <div className="method-header">
            <div className="method-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="method-info">
              <h4>
                {enabledTotp.length > 0 && <span className="check-icon">✓</span>}
                Application Mobile
              </h4>
              <p>S'authentifier a l'aide d'une application mobile gratuite (compatible Android / iPhone / Windows Phone).</p>
            </div>
          </div>

          {enabledTotp.length > 0 && (
            <div className="method-details">
              <table className="method-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Derniere utilisation</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {enabledTotp.map((totp) => (
                    <tr key={totp.id}>
                      <td>{totp.description || "Application TOTP"}</td>
                      <td>{formatDate(totp.lastUsedDate)}</td>
                      <td className="actions-cell">
                        <button className="btn-icon" title="Actions">•••</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <a 
            href="https://www.ovh.com/manager/#/useraccount/security/totp/add" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Ajouter une application
          </a>
        </div>

        {/* U2F - Security Key */}
        <div className="two-factor-method">
          <div className="method-header">
            <div className="method-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <div className="method-info">
              <h4>
                {enabledU2f.length > 0 && <span className="check-icon">✓</span>}
                Cle de securite
              </h4>
              <p>S'authentifier a l'aide d'une cle de securite compatible U2F.</p>
            </div>
          </div>

          {enabledU2f.length > 0 && (
            <div className="method-details">
              <table className="method-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Derniere utilisation</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {enabledU2f.map((u2f) => (
                    <tr key={u2f.id}>
                      <td>{u2f.description || "Cle U2F"}</td>
                      <td>{formatDate(u2f.lastUsedDate)}</td>
                      <td className="actions-cell">
                        <button className="btn-icon" title="Actions">•••</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <a 
            href="https://www.ovh.com/manager/#/useraccount/security/u2f/add" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Ajouter une cle
          </a>
        </div>

        {/* Backup Codes */}
        <div className="two-factor-method">
          <div className="method-header">
            <div className="method-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="method-info">
              <h4>
                {twoFactorStatus?.backupCode && <span className="check-icon">✓</span>}
                Codes de secours
              </h4>
              <p>Utilisez ces codes si vous perdez ou n'avez pas acces a votre telephone.</p>
            </div>
          </div>

          {twoFactorStatus?.backupCode && (
            <p className="backup-codes-info">
              Vous disposez de <strong>{twoFactorStatus.backupCode.remaining}</strong> codes de secours valides.
            </p>
          )}

          <div className="method-actions">
            <a 
              href="https://www.ovh.com/manager/#/useraccount/security/backup-code" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Regenerer les codes
            </a>
            {twoFactorStatus?.backupCode && (
              <a 
                href="https://www.ovh.com/manager/#/useraccount/security/backup-code/disable" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Desactiver les codes 2FA
              </a>
            )}
          </div>
        </div>
      </div>

      {/* IP Restriction Section */}
      <div className="security-card">
        <div className="security-card-header">
          <div className="security-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3>Restriction d'acces par IP</h3>
          <a 
            href="https://www.ovh.com/manager/#/useraccount/ip-restriction" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Activer
          </a>
        </div>
      </div>
    </div>
  );
}
