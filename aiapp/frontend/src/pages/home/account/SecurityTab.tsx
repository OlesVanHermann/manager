import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../../types/auth.types";
import * as securityService from "../../../services/security.service";

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

type ModalType = "sms" | "totp" | "u2f" | "backup" | "ip" | "password" | "disable2fa" | "deleteSms" | "deleteTotp" | "deleteU2f" | null;
type SmsStep = "phone" | "code";

export default function SecurityTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<securityService.TwoFactorStatus | null>(null);
  const [ipRestrictions, setIpRestrictions] = useState<securityService.IpRestriction[]>([]);
  const [ipDefaultRule, setIpDefaultRule] = useState<securityService.IpDefaultRule | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<securityService.TotpSecret | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [smsStep, setSmsStep] = useState<SmsStep>("phone");
  const [pendingSmsId, setPendingSmsId] = useState<number | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifié");
      setLoading(false);
      return;
    }
    try {
      const [twoFactorStatus, restrictions, defaultRule] = await Promise.all([
        securityService.getTwoFactorStatus(credentials),
        securityService.getIpRestrictions(credentials),
        securityService.getIpDefaultRule(credentials),
      ]);
      setStatus(twoFactorStatus);
      setIpRestrictions(restrictions);
      setIpDefaultRule(defaultRule);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: ModalType, targetId?: number) => {
    setActiveModal(type);
    setModalError(null);
    setModalSuccess(null);
    setFormData({});
    setTotpSecret(null);
    setDeleteTargetId(targetId ?? null);
    setSmsStep("phone");
    setPendingSmsId(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalError(null);
    setModalSuccess(null);
    setFormData({});
    setTotpSecret(null);
    setDeleteTargetId(null);
    setSmsStep("phone");
    setPendingSmsId(null);
  };

  const handleChangePassword = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(null);
    try {
      await securityService.changePassword(credentials);
      setModalSuccess("Un email de réinitialisation a été envoyé à votre adresse email.");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddSmsStep1 = async () => {
    const credentials = getCredentials();
    if (!credentials || !formData.phone) return;
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(null);
    try {
      const smsEntry = await securityService.addSms(credentials, formData.phone);
      setPendingSmsId(smsEntry.id);
      await securityService.sendSmsCode(credentials, smsEntry.id);
      setSmsStep("code");
      setModalSuccess("Un code de vérification a été envoyé au " + formData.phone);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur lors de l'ajout du numéro");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddSmsStep2 = async () => {
    const credentials = getCredentials();
    if (!credentials || pendingSmsId === null || !formData.code) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.validateSms(credentials, pendingSmsId, formData.code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Code invalide");
    } finally {
      setModalLoading(false);
    }
  };

  const handleResendSmsCode = async () => {
    const credentials = getCredentials();
    if (!credentials || pendingSmsId === null) return;
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(null);
    try {
      await securityService.sendSmsCode(credentials, pendingSmsId);
      setModalSuccess("Code renvoyé avec succès");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur lors du renvoi");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSms = async () => {
    const credentials = getCredentials();
    if (!credentials || deleteTargetId === null) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.deleteSms(credentials, deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddTotp = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true);
    setModalError(null);
    try {
      if (!totpSecret) {
        const secret = await securityService.addTotp(credentials);
        setTotpSecret(secret);
      } else if (formData.code) {
        await securityService.validateTotp(credentials, totpSecret.id, formData.code);
        await loadSecurityData();
        closeModal();
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTotp = async () => {
    const credentials = getCredentials();
    if (!credentials || deleteTargetId === null) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.deleteTotp(credentials, deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddU2f = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const challenge = await securityService.addU2f(credentials);
      setModalSuccess("Clé de sécurité créée (ID: " + challenge.id + "). Utilisez WebAuthn pour finaliser.");
      await loadSecurityData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteU2f = async () => {
    const credentials = getCredentials();
    if (!credentials || deleteTargetId === null) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.deleteU2f(credentials, deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setModalLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const result = await securityService.generateBackupCodes(credentials);
      setFormData({ ...formData, codes: result.codes.join("\n") });
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setModalLoading(false);
    }
  };

  const handleValidateBackupCodes = async () => {
    const credentials = getCredentials();
    if (!credentials || !formData.code) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.validateBackupCodes(credentials, formData.code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Code invalide");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDisable2fa = async () => {
    const credentials = getCredentials();
    if (!credentials || !formData.code) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.disableBackupCodes(credentials, formData.code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Code invalide");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddIpRestriction = async () => {
    const credentials = getCredentials();
    if (!credentials || !formData.ip) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.addIpRestriction(
        credentials,
        formData.ip,
        (formData.rule || "accept") as "accept" | "deny",
        formData.warning === "true"
      );
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteIpRestriction = async (id: number) => {
    const credentials = getCredentials();
    if (!credentials) return;
    try {
      await securityService.deleteIpRestriction(credentials, id);
      await loadSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  // Icônes SVG
  const IconPassword = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );

  const IconSms = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );

  const IconTotp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const IconKey = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  );

  const IconBackup = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
    </svg>
  );

  const IconNetwork = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );

  const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="status-icon status-icon-success">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );

  const IconDots = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="security-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des paramètres de sécurité...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="security-tab">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadSecurityData} className="btn btn-primary">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="security-tab">
      {/* Section Mot de passe */}
      <div className="security-box">
        <div className="security-box-row">
          <div className="security-box-icon">
            <IconPassword />
          </div>
          <div className="security-box-content">
            <h3>Mot de passe</h3>
            <p>Modifiez votre mot de passe OVHcloud.</p>
          </div>
          <div className="security-box-action">
            <button className="btn btn-primary" onClick={() => openModal("password")}>
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>

      {/* Section Double authentification */}
      <div className="security-box">
        <div className="security-box-header">
          <div className="security-box-header-left">
            <h3>Double authentification (2FA)</h3>
            <p>Renforcez la sécurité de votre compte en activant une méthode de double authentification.</p>
          </div>
          {status?.isEnabled && (
            <span className="status-badge status-badge-success">Activée</span>
          )}
        </div>

        <div className="twofa-methods-list">
          {/* SMS */}
          <div className="twofa-method-card">
            <div className="twofa-method-header">
              <div className="twofa-method-icon"><IconSms /></div>
              <div className="twofa-method-title">
                <h4>
                  {status?.sms && status.sms.length > 0 && status.sms.some(s => s.status === "enabled") && <IconCheck />}
                  SMS
                </h4>
                <p>Recevez un code par SMS</p>
              </div>
            </div>
            
            {status?.sms && status.sms.length > 0 ? (
              <div className="twofa-method-content">
                <table className="twofa-table">
                  <thead>
                    <tr>
                      <th>Numéro de téléphone</th>
                      <th>Description</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.sms.map(s => (
                      <tr key={s.id}>
                        <td className="phone-cell">{s.phoneNumber}</td>
                        <td>
                          <span>{s.description || "-"}</span>
                          {s.lastUsedDate && (
                            <span className="last-used">Dernière utilisation : {new Date(s.lastUsedDate).toLocaleDateString()}</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <button className="btn-icon" onClick={() => openModal("deleteSms", s.id)} title="Supprimer">
                            <IconDots />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            
            <div className="twofa-method-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => openModal("sms")}>
                Ajouter un numéro
              </button>
            </div>
          </div>

          {/* TOTP */}
          <div className="twofa-method-card">
            <div className="twofa-method-header">
              <div className="twofa-method-icon"><IconTotp /></div>
              <div className="twofa-method-title">
                <h4>
                  {status?.totp && status.totp.length > 0 && status.totp.some(t => t.status === "enabled") && <IconCheck />}
                  Application TOTP
                </h4>
                <p>Google Authenticator, Authy, etc.</p>
              </div>
            </div>
            
            {status?.totp && status.totp.length > 0 ? (
              <div className="twofa-method-content">
                <table className="twofa-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.totp.map(t => (
                      <tr key={t.id}>
                        <td>
                          <span>{t.description || "Application TOTP"}</span>
                          {t.lastUsedDate && (
                            <span className="last-used">Dernière utilisation : {new Date(t.lastUsedDate).toLocaleDateString()}</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <button className="btn-icon" onClick={() => openModal("deleteTotp", t.id)} title="Supprimer">
                            <IconDots />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            
            <div className="twofa-method-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => openModal("totp")}>
                Configurer TOTP
              </button>
            </div>
          </div>

          {/* U2F */}
          <div className="twofa-method-card">
            <div className="twofa-method-header">
              <div className="twofa-method-icon"><IconKey /></div>
              <div className="twofa-method-title">
                <h4>
                  {status?.u2f && status.u2f.length > 0 && status.u2f.some(u => u.status === "enabled") && <IconCheck />}
                  Clé de sécurité
                </h4>
                <p>YubiKey, FIDO2, WebAuthn</p>
              </div>
            </div>
            
            {status?.u2f && status.u2f.length > 0 ? (
              <div className="twofa-method-content">
                <table className="twofa-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.u2f.map(u => (
                      <tr key={u.id}>
                        <td>
                          <span>{u.description || "Clé de sécurité"}</span>
                          {u.lastUsedDate && (
                            <span className="last-used">Dernière utilisation : {new Date(u.lastUsedDate).toLocaleDateString()}</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <button className="btn-icon" onClick={() => openModal("deleteU2f", u.id)} title="Supprimer">
                            <IconDots />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            
            <div className="twofa-method-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => openModal("u2f")}>
                Ajouter une clé de sécurité
              </button>
            </div>
          </div>

          {/* Codes de secours */}
          <div className="twofa-method-card">
            <div className="twofa-method-header">
              <div className="twofa-method-icon"><IconBackup /></div>
              <div className="twofa-method-title">
                <h4>
                  {status?.backupCode?.status === "enabled" && <IconCheck />}
                  Codes de secours
                </h4>
                <p>Codes à usage unique en cas de perte</p>
              </div>
            </div>
            
            {status?.backupCode && (
              <div className="twofa-method-content">
                <div className="backup-status">
                  <span className="backup-count">{status.backupCode.remaining} codes restants</span>
                  {status.backupCode.status === "enabled" && (
                    <span className="status-badge status-badge-success">Actif</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="twofa-method-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => openModal("backup")}>
                Régénérer les codes
              </button>
            </div>
          </div>
        </div>

        {status?.isEnabled && (
          <div className="twofa-disable-section">
            <button className="btn btn-danger" onClick={() => openModal("disable2fa")}>
              Désactiver la double authentification
            </button>
          </div>
        )}
      </div>

      {/* Section Restrictions IP */}
      <div className="security-box">
        <div className="security-box-header">
          <div className="security-box-header-left">
            <div className="security-box-icon"><IconNetwork /></div>
            <div>
              <h3>Restrictions IP</h3>
              <p>Limitez l'accès à votre compte depuis certaines adresses IP.</p>
            </div>
          </div>
        </div>

        {ipDefaultRule && (
          <div className="ip-default-rule">
            <span>Règle par défaut : </span>
            <strong>{ipDefaultRule.rule === "accept" ? "Autoriser" : "Refuser"}</strong>
            {ipDefaultRule.warning && (
              <span className="status-badge status-badge-info">Alertes activées</span>
            )}
          </div>
        )}

        {ipRestrictions.length > 0 && (
          <div className="ip-restrictions-content">
            <table className="twofa-table">
              <thead>
                <tr>
                  <th>Adresse IP</th>
                  <th>Alerte</th>
                  <th>Règle</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ipRestrictions.map(ip => (
                  <tr key={ip.id}>
                    <td>{ip.ip}</td>
                    <td>{ip.warning ? "Oui" : "Non"}</td>
                    <td>
                      <span className={`status-badge ${ip.rule === "accept" ? "status-badge-success" : "status-badge-danger"}`}>
                        {ip.rule === "accept" ? "Autoriser" : "Refuser"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteIpRestriction(ip.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="security-box-footer">
          <button className="btn btn-secondary" onClick={() => openModal("ip")}>
            Ajouter une restriction IP
          </button>
        </div>
      </div>

      {/* Modales */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>

            {activeModal === "password" && (
              <>
                <h3>Changer le mot de passe</h3>
                <p>Un email de réinitialisation sera envoyé à votre adresse email.</p>
                {modalError && <p className="modal-error">{modalError}</p>}
                {modalSuccess && <p className="modal-success">{modalSuccess}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Fermer</button>
                  {!modalSuccess && (
                    <button className="btn btn-primary" onClick={handleChangePassword} disabled={modalLoading}>
                      {modalLoading ? "Envoi..." : "Envoyer l'email"}
                    </button>
                  )}
                </div>
              </>
            )}

            {activeModal === "sms" && (
              <>
                <h3>Ajouter un numéro SMS</h3>
                {smsStep === "phone" ? (
                  <>
                    <p>Entrez votre numéro de téléphone pour recevoir les codes de vérification.</p>
                    <div className="form-group">
                      <label>Numéro de téléphone (format international)</label>
                      <input type="tel" placeholder="+33612345678" value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-primary" onClick={handleAddSmsStep1} disabled={modalLoading || !formData.phone}>
                        {modalLoading ? "Envoi..." : "Envoyer le code"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Un code de vérification a été envoyé au <strong>{formData.phone}</strong>.</p>
                    <div className="form-group">
                      <label>Code de vérification</label>
                      <input type="text" placeholder="123456" value={formData.code || ""} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                    </div>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    {modalSuccess && <p className="modal-success">{modalSuccess}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-secondary" onClick={handleResendSmsCode} disabled={modalLoading}>Renvoyer</button>
                      <button className="btn btn-primary" onClick={handleAddSmsStep2} disabled={modalLoading || !formData.code}>
                        {modalLoading ? "Validation..." : "Valider"}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {activeModal === "deleteSms" && (
              <>
                <h3>Supprimer le numéro SMS</h3>
                <p>Êtes-vous sûr de vouloir supprimer ce numéro de la double authentification ?</p>
                {modalError && <p className="modal-error">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-danger" onClick={handleDeleteSms} disabled={modalLoading}>
                    {modalLoading ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "totp" && (
              <>
                <h3>Ajouter une application TOTP</h3>
                {!totpSecret ? (
                  <>
                    <p>Cliquez sur "Générer" pour obtenir un QR code à scanner.</p>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-primary" onClick={handleAddTotp} disabled={modalLoading}>
                        {modalLoading ? "Génération..." : "Générer"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="totp-setup">
                      <p>Scannez ce QR code avec votre application :</p>
                      <img src={totpSecret.qrcodeUrl} alt="QR Code TOTP" className="totp-qr" />
                      <p className="totp-secret">Ou entrez manuellement : <code>{totpSecret.secret}</code></p>
                    </div>
                    <div className="form-group">
                      <label>Code de vérification</label>
                      <input type="text" placeholder="123456" value={formData.code || ""} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                    </div>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-primary" onClick={handleAddTotp} disabled={modalLoading || !formData.code}>
                        {modalLoading ? "Validation..." : "Valider"}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {activeModal === "deleteTotp" && (
              <>
                <h3>Supprimer l'application TOTP</h3>
                <p>Êtes-vous sûr de vouloir supprimer cette application de la double authentification ?</p>
                {modalError && <p className="modal-error">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-danger" onClick={handleDeleteTotp} disabled={modalLoading}>
                    {modalLoading ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "u2f" && (
              <>
                <h3>Ajouter une clé de sécurité</h3>
                <p>Cliquez sur "Ajouter" puis suivez les instructions de votre navigateur.</p>
                {modalError && <p className="modal-error">{modalError}</p>}
                {modalSuccess && <p className="modal-success">{modalSuccess}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Fermer</button>
                  <button className="btn btn-primary" onClick={handleAddU2f} disabled={modalLoading}>
                    {modalLoading ? "En cours..." : "Ajouter"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "deleteU2f" && (
              <>
                <h3>Supprimer la clé de sécurité</h3>
                <p>Êtes-vous sûr de vouloir supprimer cette clé de sécurité de la double authentification ?</p>
                {modalError && <p className="modal-error">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-danger" onClick={handleDeleteU2f} disabled={modalLoading}>
                    {modalLoading ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "backup" && (
              <>
                <h3>Codes de secours</h3>
                {!formData.codes ? (
                  <>
                    <p>Générez des codes de secours à conserver en lieu sûr.</p>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-primary" onClick={handleGenerateBackupCodes} disabled={modalLoading}>
                        {modalLoading ? "Génération..." : "Générer"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="backup-codes">
                      <p><strong>Conservez ces codes en lieu sûr :</strong></p>
                      <pre>{formData.codes}</pre>
                    </div>
                    <div className="form-group">
                      <label>Entrez un des codes pour valider</label>
                      <input type="text" placeholder="Code" value={formData.code || ""} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                    </div>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-primary" onClick={handleValidateBackupCodes} disabled={modalLoading || !formData.code}>
                        {modalLoading ? "Validation..." : "Valider"}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {activeModal === "disable2fa" && (
              <>
                <h3>Désactiver la double authentification</h3>
                <p className="warning-text">Attention : cette action va désactiver toutes les méthodes 2FA.</p>
                <div className="form-group">
                  <label>Entrez un code de secours pour confirmer</label>
                  <input type="text" placeholder="Code de secours" value={formData.code || ""} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                </div>
                {modalError && <p className="modal-error">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-danger" onClick={handleDisable2fa} disabled={modalLoading || !formData.code}>
                    {modalLoading ? "Désactivation..." : "Désactiver"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "ip" && (
              <>
                <h3>Ajouter une restriction IP</h3>
                <div className="form-group">
                  <label>Adresse IP ou CIDR</label>
                  <input type="text" placeholder="192.168.1.0/24" value={formData.ip || ""} onChange={e => setFormData({ ...formData, ip: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Règle</label>
                  <select value={formData.rule || "accept"} onChange={e => setFormData({ ...formData, rule: e.target.value })}>
                    <option value="accept">Autoriser</option>
                    <option value="deny">Refuser</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={formData.warning === "true"} onChange={e => setFormData({ ...formData, warning: e.target.checked ? "true" : "false" })} />
                    Avertissement par email
                  </label>
                </div>
                {modalError && <p className="modal-error">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-primary" onClick={handleAddIpRestriction} disabled={modalLoading || !formData.ip}>
                    {modalLoading ? "Ajout..." : "Ajouter"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
