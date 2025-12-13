import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as securityService from "../../services/security.service";

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

type ModalType = "sms" | "totp" | "u2f" | "backup" | "ip" | "password" | "disable2fa" | null;

export default function SecurityTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<securityService.TwoFactorStatus | null>(null);
  const [ipRestrictions, setIpRestrictions] = useState<securityService.IpRestriction[]>([]);
  const [ipDefaultRule, setIpDefaultRule] = useState<securityService.IpDefaultRule | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<securityService.TotpSecret | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
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

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setModalError(null);
    setFormData({});
    setTotpSecret(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalError(null);
    setFormData({});
    setTotpSecret(null);
  };

  const handleAddSms = async () => {
    const credentials = getCredentials();
    if (!credentials || !formData.phone) return;

    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.addSms(credentials, formData.phone);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur");
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

  const handleAddU2f = async () => {
    const credentials = getCredentials();
    if (!credentials) return;

    setModalLoading(true);
    setModalError(null);
    try {
      const challenge = await securityService.addU2f(credentials);
      setModalError("Clé de sécurité créée (ID: " + challenge.id + "). Utilisez WebAuthn pour finaliser.");
      await loadSecurityData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erreur");
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
      setFormData({ codes: result.codes.join("\n") });
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
      setModalError(err instanceof Error ? err.message : "Erreur");
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
      setModalError(err instanceof Error ? err.message : "Erreur");
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
      const rule = (formData.rule as "accept" | "deny") || "accept";
      const warning = formData.warning === "true";
      await securityService.addIpRestriction(credentials, formData.ip, rule, warning);
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

  const handleChangePassword = async () => {
    setModalError("Un email de reinitialisation va vous etre envoye.");
  };

  const getStatusBadge = (methodStatus: string) => {
    if (methodStatus === "enabled" || methodStatus === "active") {
      return <span className="badge badge-success">Active</span>;
    }
    if (methodStatus === "disabled") {
      return <span className="badge badge-warning">Desactive</span>;
    }
    return <span className="badge badge-info">En attente</span>;
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des parametres de securite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadSecurityData} className="btn btn-primary">Reessayer</button>
        </div>
      </div>
    );
  }

  const smsStatus = status?.sms.some(s => s.status === "enabled") ? "active" : (status?.sms.length ? "enabled" : "disabled");
  const totpStatus = status?.totp.some(t => t.status === "enabled") ? "active" : (status?.totp.length ? "enabled" : "disabled");
  const u2fStatus = status?.u2f.some(u => u.status === "enabled") ? "active" : (status?.u2f.length ? "enabled" : "disabled");
  const backupStatus = status?.backupCode ? "active" : "disabled";

  return (
    <div className="tab-content security-tab">
      <div className="security-header">
        <h2>Securite du compte</h2>
        <p>Gerez les methodes d'authentification et les restrictions d'acces a votre compte.</p>
      </div>

      <div className="security-section">
        <h3>Mot de passe</h3>
        <div className="security-card">
          <div className="security-card-content">
            <p>Modifiez votre mot de passe de connexion OVHcloud.</p>
          </div>
          <div className="security-card-actions">
            <button className="btn btn-secondary" onClick={() => openModal("password")}>
              Modifier le mot de passe
            </button>
          </div>
        </div>
      </div>

      <div className="security-section">
        <h3>Double authentification (2FA)</h3>
        <p className="section-description">
          Renforcez la securite de votre compte en activant une ou plusieurs methodes de double authentification.
        </p>

        <div className="security-cards">
          <div className="security-card">
            <div className="security-card-header">
              <span className="method-name">SMS</span>
              {getStatusBadge(smsStatus)}
            </div>
            <div className="security-card-content">
              <p>Recevez un code par SMS pour vous connecter.</p>
              {status?.sms && status.sms.length > 0 && (
                <ul className="method-list">
                  {status.sms.map(sms => (
                    <li key={sms.id}>{sms.phoneNumber} - {sms.status}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="security-card-actions">
              <button className="btn btn-primary" onClick={() => openModal("sms")}>
                Ajouter un numero
              </button>
            </div>
          </div>

          <div className="security-card">
            <div className="security-card-header">
              <span className="method-name">Application mobile (TOTP)</span>
              {getStatusBadge(totpStatus)}
            </div>
            <div className="security-card-content">
              <p>Utilisez une application comme Google Authenticator ou Authy.</p>
              {status?.totp && status.totp.length > 0 && (
                <ul className="method-list">
                  {status.totp.map(totp => (
                    <li key={totp.id}>{totp.description || `TOTP #${totp.id}`} - {totp.status}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="security-card-actions">
              <button className="btn btn-primary" onClick={() => openModal("totp")}>
                Ajouter une application
              </button>
            </div>
          </div>

          <div className="security-card">
            <div className="security-card-header">
              <span className="method-name">Cle de securite (U2F/WebAuthn)</span>
              {getStatusBadge(u2fStatus)}
            </div>
            <div className="security-card-content">
              <p>Utilisez une cle physique comme YubiKey.</p>
              {status?.u2f && status.u2f.length > 0 && (
                <ul className="method-list">
                  {status.u2f.map(u2f => (
                    <li key={u2f.id}>{u2f.description || `U2F #${u2f.id}`} - {u2f.status}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="security-card-actions">
              <button className="btn btn-primary" onClick={() => openModal("u2f")}>
                Ajouter une cle
              </button>
            </div>
          </div>

          <div className="security-card">
            <div className="security-card-header">
              <span className="method-name">Codes de secours</span>
              {getStatusBadge(backupStatus)}
            </div>
            <div className="security-card-content">
              <p>Codes a usage unique en cas de perte d'acces.</p>
              {status?.backupCode && (
                <p className="backup-remaining">Codes restants : {status.backupCode.remaining}</p>
              )}
            </div>
            <div className="security-card-actions">
              <button className="btn btn-primary" onClick={() => openModal("backup")}>
                {status?.backupCode ? "Regenerer les codes" : "Generer des codes"}
              </button>
              {status?.isEnabled && (
                <button className="btn btn-danger" onClick={() => openModal("disable2fa")}>
                  Desactiver la 2FA
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="security-section">
        <h3>Restrictions IP</h3>
        <p className="section-description">
          Limitez l'acces a votre compte depuis certaines adresses IP.
        </p>

        <div className="security-card">
          <div className="security-card-content">
            {ipDefaultRule && (
              <p>Regle par defaut : <strong>{ipDefaultRule.rule === "accept" ? "Autoriser" : "Refuser"}</strong></p>
            )}
            {ipRestrictions.length > 0 ? (
              <table className="ip-table">
                <thead>
                  <tr>
                    <th>IP</th>
                    <th>Regle</th>
                    <th>Avertissement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ipRestrictions.map(ip => (
                    <tr key={ip.id}>
                      <td>{ip.ip}</td>
                      <td>{ip.rule === "accept" ? "Autoriser" : "Refuser"}</td>
                      <td>{ip.warning ? "Oui" : "Non"}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteIpRestriction(ip.id)}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune restriction IP configuree.</p>
            )}
          </div>
          <div className="security-card-actions">
            <button className="btn btn-primary" onClick={() => openModal("ip")}>
              Ajouter une restriction
            </button>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>

            {activeModal === "password" && (
              <>
                <h3>Modifier le mot de passe</h3>
                <p>Vous allez recevoir un email pour reinitialiser votre mot de passe.</p>
                {modalError && <p className="modal-info">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-primary" onClick={handleChangePassword} disabled={modalLoading}>
                    {modalLoading ? "Envoi..." : "Envoyer l'email"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "sms" && (
              <>
                <h3>Ajouter un numero SMS</h3>
                <div className="form-group">
                  <label>Numero de telephone (format international)</label>
                  <input
                    type="tel"
                    placeholder="+33612345678"
                    value={formData.phone || ""}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                {modalError && <p className="modal-error">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-primary" onClick={handleAddSms} disabled={modalLoading || !formData.phone}>
                    {modalLoading ? "Ajout..." : "Ajouter"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "totp" && (
              <>
                <h3>Ajouter une application TOTP</h3>
                {!totpSecret ? (
                  <>
                    <p>Cliquez sur "Generer" pour obtenir un QR code a scanner.</p>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-primary" onClick={handleAddTotp} disabled={modalLoading}>
                        {modalLoading ? "Generation..." : "Generer"}
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
                      <label>Code de verification</label>
                      <input
                        type="text"
                        placeholder="123456"
                        value={formData.code || ""}
                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                      />
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

            {activeModal === "u2f" && (
              <>
                <h3>Ajouter une cle de securite</h3>
                <p>Cliquez sur "Ajouter" puis suivez les instructions de votre navigateur.</p>
                {modalError && <p className="modal-info">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-primary" onClick={handleAddU2f} disabled={modalLoading}>
                    {modalLoading ? "En cours..." : "Ajouter"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "backup" && (
              <>
                <h3>Codes de secours</h3>
                {!formData.codes ? (
                  <>
                    <p>Generez des codes de secours a conserver en lieu sur.</p>
                    {modalError && <p className="modal-error">{modalError}</p>}
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                      <button className="btn btn-primary" onClick={handleGenerateBackupCodes} disabled={modalLoading}>
                        {modalLoading ? "Generation..." : "Generer"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="backup-codes">
                      <p><strong>Conservez ces codes en lieu sur :</strong></p>
                      <pre>{formData.codes}</pre>
                    </div>
                    <div className="form-group">
                      <label>Entrez un des codes pour valider</label>
                      <input
                        type="text"
                        placeholder="Code"
                        value={formData.code || ""}
                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                      />
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
                <h3>Desactiver la double authentification</h3>
                <p className="warning-text">Attention : cette action va desactiver toutes les methodes 2FA.</p>
                <div className="form-group">
                  <label>Entrez un code de secours pour confirmer</label>
                  <input
                    type="text"
                    placeholder="Code de secours"
                    value={formData.code || ""}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                {modalError && <p className="modal-error">{modalError}</p>}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                  <button className="btn btn-danger" onClick={handleDisable2fa} disabled={modalLoading || !formData.code}>
                    {modalLoading ? "Desactivation..." : "Desactiver"}
                  </button>
                </div>
              </>
            )}

            {activeModal === "ip" && (
              <>
                <h3>Ajouter une restriction IP</h3>
                <div className="form-group">
                  <label>Adresse IP ou CIDR</label>
                  <input
                    type="text"
                    placeholder="192.168.1.0/24"
                    value={formData.ip || ""}
                    onChange={e => setFormData({ ...formData, ip: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Regle</label>
                  <select
                    value={formData.rule || "accept"}
                    onChange={e => setFormData({ ...formData, rule: e.target.value })}
                  >
                    <option value="accept">Autoriser</option>
                    <option value="deny">Refuser</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.warning === "true"}
                      onChange={e => setFormData({ ...formData, warning: e.target.checked ? "true" : "false" })}
                    />
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
