// ============================================================
// GENERAL TAB - 4 blocs × 5 colonnes - TARGET STRICT
// Conforme target_.web-cloud.hebergement.hosting.general.svg
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab.service";
import type { Hosting } from "../../hosting.types";
import { 
  RestoreSnapshotModal, 
  OvhConfigModal, 
  TerminateModal,
  EditDisplayNameModal, 
  ConfigureSshModal, 
  OrderSslModal 
} from "./modals";
import "./GeneralTab.css";

// ============================================================
// TYPES
// ============================================================

interface Props {
  serviceName: string;
  onTabChange?: (tabId: string) => void;
  onRefresh?: () => void;
}

interface ServiceInfos {
  status?: string;
  creation?: string;
  expiration?: string;
  contactAdmin?: string;
  contactTech?: string;
  contactBilling?: string;
  renew?: { automatic: boolean };
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <button 
      className={`general-toggle-switch ${enabled ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`}
      onClick={onChange}
      disabled={disabled}
      title={enabled ? "Activé" : "Désactivé"}
    >
      <span className="general-toggle-knob" />
    </button>
  );
}

function Btn({ label, onClick, danger }: { label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button className={`general-action-btn ${danger ? 'danger' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}

function IconBtn({ icon, title, onClick }: { icon: string; title: string; onClick?: () => void }) {
  return (
    <button className="general-icon-btn" onClick={onClick} title={title}>{icon}</button>
  );
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`general-toast toast-${type}`}>
      <span>{type === "success" ? "✓" : "✗"} {message}</span>
      <button className="general-toast-close" onClick={onClose}>×</button>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function GeneralTab({ serviceName, onTabChange, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.general");
  const navigate = useNavigate();
  
  // ---------- STATE ----------
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [serviceInfos, setServiceInfos] = useState<ServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [counts, setCounts] = useState({ attachedDomains: 0, databases: 0, ftpUsers: 0, crons: 0, envVars: 0, modules: 0, emails: 0 });
  const [ssl, setSsl] = useState<any>(null);
  const [cdn, setCdn] = useState<any>(null);
  const [phpVersion, setPhpVersion] = useState("-");
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [primaryUser, setPrimaryUser] = useState<{ login: string; sshState: "active" | "none" | "sftponly" } | null>(null);
  
  // Modals
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showSshModal, setShowSshModal] = useState(false);
  const [showOrderSslModal, setShowOrderSslModal] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ---------- DATA LOADING ----------
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [h, infos] = await Promise.all([
        generalService.getHosting(serviceName),
        fetch(`/api/ovh/hosting/web/${serviceName}/serviceInfos`).then(r => r.json())
      ]);
      setHosting(h);
      setServiceInfos(infos);
      
      // PHP version
      if ((h as any).phpVersion) {
        setPhpVersion((h as any).phpVersion);
      } else {
        try { 
          const c = await fetch(`/api/ovh/hosting/web/${serviceName}/ovhConfig`).then(r => r.json());
          setPhpVersion(c?.engineVersion || "-"); 
        } catch {}
      }
      
      // Last backup
      try {
        const backups = await fetch(`/api/ovh/hosting/web/${serviceName}/dump`).then(r => r.json());
        if (Array.isArray(backups) && backups.length > 0) {
          const first = backups.find((b: string) => b.startsWith("daily.1")) || backups[0];
          const detail = await fetch(`/api/ovh/hosting/web/${serviceName}/dump/${first}`).then(r => r.json());
          if (detail?.creationDate) setLastBackupDate(detail.creationDate);
        }
      } catch {}
      
      // Primary FTP user
      try {
        const users = await generalService.listUsers(serviceName);
        if (users.length > 0) {
          const user = await generalService.getUser(serviceName, users[0]);
          if (user.isPrimaryAccount) {
            setPrimaryUser({ login: user.login, sshState: user.sshState });
          }
        }
      } catch {}
      
    } catch (err) { setError(String(err)); } 
    finally { setLoading(false); }
  }, [serviceName]);

  const loadCounts = useCallback(async () => {
    try {
      const r = await Promise.allSettled([
        generalService.listAttachedDomains(serviceName),
        generalService.listDatabases(serviceName),
        generalService.listUsers(serviceName),
        generalService.listCrons(serviceName),
        fetch(`/api/ovh/hosting/web/${serviceName}/envVar`).then(r => r.json()),
        generalService.listModules(serviceName),
      ]);
      setCounts({
        attachedDomains: r[0].status === "fulfilled" ? r[0].value.length : 0,
        databases: r[1].status === "fulfilled" ? r[1].value.length : 0,
        ftpUsers: r[2].status === "fulfilled" ? r[2].value.length : 0,
        crons: r[3].status === "fulfilled" ? r[3].value.length : 0,
        envVars: r[4].status === "fulfilled" && Array.isArray(r[4].value) ? r[4].value.length : 0,
        modules: r[5].status === "fulfilled" ? r[5].value.length : 0,
        emails: 0,
      });
    } catch {}
  }, [serviceName]);

  const loadServices = useCallback(async () => {
    try {
      const [s, c] = await Promise.allSettled([
        generalService.getSslInfo(serviceName), 
        fetch(`/api/ovh/hosting/web/${serviceName}/cdn`).then(r => r.json())
      ]);
      if (s.status === "fulfilled") setSsl(s.value);
      if (c.status === "fulfilled") setCdn(c.value);
    } catch {}
  }, [serviceName]);

  useEffect(() => { loadData(); loadCounts(); loadServices(); }, [loadData, loadCounts, loadServices]);

  // ---------- HELPERS ----------
  const formatDate = (d?: string | null) => { 
    if (!d) return "-"; 
    try { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }); } 
    catch { return d; } 
  };
  
  const formatDateTime = (d?: string | null) => { 
    if (!d) return "-"; 
    try { return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } 
    catch { return d; } 
  };
  
  const formatQuota = () => {
    const used = hosting?.quotaUsed, size = hosting?.quotaSize;
    if (!used?.value || !size?.value) return { text: "- / - Go", pct: 0 };
    const toGb = (v: number, u: string) => u === "GB" ? v : u === "MB" ? v/1024 : v/(1024*1024*1024);
    const usedGb = toGb(used.value, used.unit || "B"), sizeGb = toGb(size.value, size.unit || "B");
    const pct = sizeGb > 0 ? Math.round((usedGb / sizeGb) * 100) : 0;
    return { text: `${usedGb.toFixed(1)}/${sizeGb.toFixed(0)} Go (${pct}%)`, pct };
  };

  const copyToClipboard = (text: string) => { 
    navigator.clipboard.writeText(text); 
    setToast({ message: "Copié", type: "success" }); 
  };
  
  const goToTab = (id: string) => onTabChange?.(id);
  
  // ---------- HANDLERS ----------
  const handleFlushCache = async () => {
    if (!hosting?.hasCdn && !cdn) { 
      setToast({ message: "CDN non activé", type: "error" }); 
      return; 
    }
    try { 
      await fetch(`/api/ovh/hosting/web/${serviceName}/request`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'FLUSH_CACHE' })
      });
      setToast({ message: "Cache vidé", type: "success" }); 
    }
    catch { setToast({ message: "Erreur CDN", type: "error" }); }
  };

  const handleRegenerateSsl = async () => {
    if (!ssl) {
      setToast({ message: "Aucun SSL configuré", type: "error" });
      return;
    }
    try {
      await generalService.regenerateSsl(serviceName);
      setToast({ message: "Régénération SSL lancée", type: "success" });
      loadServices();
    } catch (err: any) {
      setToast({ message: err.message || "Erreur", type: "error" });
    }
  };

  const handleModalSuccess = (msg: string) => { 
    setToast({ message: msg, type: "success" }); 
    loadData(); 
    loadServices();
    onRefresh?.(); 
  };

  // ---------- RENDER ----------
  if (loading) return (
    <div className="general-tab">
      <div className="general-bloc-skeleton"/><div className="general-bloc-skeleton"/>
      <div className="general-bloc-skeleton"/><div className="general-bloc-skeleton"/>
    </div>
  );
  
  if (error || !hosting) return <div className="general-error-state">{error || "Erreur"}</div>;

  const quota = formatQuota();
  const sshEnabled = primaryUser?.sshState === "active";
  const sslProvider = ssl?.provider === "LETSENCRYPT" ? "Let's Encrypt" : ssl?.provider || "-";
  const cdnType = cdn?.type || (hosting.hasCdn ? "Basic" : "-");
  const cdnEnabled = !!cdn?.type || hosting.hasCdn;
  const boostEnabled = !!hosting.boostOffer;
  const renewAuto = serviceInfos?.renew?.automatic;

  return (
    <div className="general-tab">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* ========== BLOC 1: WEB ========== */}
      <div className="general-info-bloc">
        <h3 className="general-bloc-title">Web</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>
          
          <div className="general-theme-col">
            <div className="general-theme-title">STOCKAGE</div>
            <div className="general-info-line">
              <span className="lbl">Espace disque</span>
              <div className="general-progress-wrap">
                <div className="general-progress-bar"><div className="general-progress-fill" style={{ width: `${Math.min(quota.pct, 100)}%` }}/></div>
                <span className="general-progress-txt">{quota.text}</span>
              </div>
              <Btn label="Augmenter" onClick={() => navigate("/home/billing/services")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Sites web</span>
              <span className="val">{counts.attachedDomains} / 500</span>
              <Btn label="Gérer" onClick={() => goToTab("multisite")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Modules</span>
              <span className="val">{counts.modules}</span>
              <Btn label="Gérer" onClick={() => goToTab("modules")} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">CONFIGURATION PHP</div>
            <div className="general-info-line"><span className="lbl">Moteur</span><span className="val">PHP</span></div>
            <div className="general-info-line">
              <span className="lbl">Version</span>
              <span className="val">{phpVersion}</span>
              <Btn label="Changer" onClick={() => setShowConfigModal(true)} />
            </div>
            <div className="general-info-line"><span className="lbl">Environnement</span><span className="val">production</span></div>
            <div className="general-info-line">
              <span className="lbl">.ovhconfig</span>
              <Btn label="Modifier" onClick={() => setShowConfigModal(true)} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">LOGS & STATISTIQUES</div>
            <div className="general-info-line">
              <span className="lbl">Logs temps réel</span>
              <Btn label="Accéder" onClick={() => goToTab("logs")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Statistiques</span>
              <Btn label="Voir" onClick={() => window.open(`https://logs.ovh.net/${serviceName}/`, '_blank')} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">SAUVEGARDE</div>
            <div className="general-info-line">
              <span className="lbl">Dernière</span>
              <span className="val">{formatDateTime(lastBackupDate)}</span>
            </div>
            <div className="general-info-line">
              <span className="lbl">Restauration</span>
              <Btn label="Restaurer" onClick={() => setShowRestoreModal(true)} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">PERFORMANCE</div>
            <div className="general-info-line">
              <span className="lbl">Boost</span>
              <span className="val">{boostEnabled ? "Activé" : "Désactivé"}</span>
              <Btn label={boostEnabled ? "Gérer" : "Activer"} onClick={() => goToTab("boost")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">CDN</span>
              <span className="val">{cdnType}</span>
              <Btn label="Gérer" onClick={() => goToTab("cdn")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Cache</span>
              <Btn label="Vider" onClick={handleFlushCache} />
            </div>
          </div>
        </div>
      </div>

      {/* ========== BLOC 2: EXPERT ========== */}
      <div className="general-info-bloc">
        <h3 className="general-bloc-title">Expert</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>
          
          <div className="general-theme-col">
            <div className="general-theme-title">ACCÈS</div>
            <div className="general-info-line">
              <span className="lbl">SSH</span>
              <span className="val">{sshEnabled ? "Activé" : "Désactivé"}</span>
              <Btn label="Configurer" onClick={() => setShowSshModal(true)} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Comptes FTP</span>
              <span className="val">{counts.ftpUsers}</span>
              <Btn label="Gérer" onClick={() => goToTab("ftp")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Accès HTTP</span>
              <Btn label="Accéder" onClick={() => window.open(`https://${hosting.cluster}.hosting.ovh.net/`, '_blank')} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">BASES DE DONNÉES</div>
            <div className="general-info-line">
              <span className="lbl">Bases MySQL</span>
              <span className="val">{counts.databases} / 5</span>
              <Btn label="Gérer" onClick={() => goToTab("database")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">phpMyAdmin</span>
              <Btn label="Accéder" onClick={() => window.open('https://phpmyadmin.ovh.net/', '_blank')} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">TÂCHES PLANIFIÉES</div>
            <div className="general-info-line">
              <span className="lbl">Tâches Cron</span>
              <span className="val">{counts.crons} actives</span>
              <Btn label="Gérer" onClick={() => goToTab("cron")} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">VARIABLES</div>
            <div className="general-info-line">
              <span className="lbl">Environnement</span>
              <span className="val">{counts.envVars} définies</span>
              <Btn label="Gérer" onClick={() => goToTab("envvars")} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">RUNTIMES</div>
            <div className="general-info-line">
              <span className="lbl">Node.js</span>
              <span className="val">18.x</span>
              <Btn label="Configurer" onClick={() => goToTab("runtimes")} />
            </div>
          </div>
        </div>
      </div>

      {/* ========== BLOC 3: GENERAL ========== */}
      <div className="general-info-bloc">
        <h3 className="general-bloc-title">General</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>
          
          <div className="general-theme-col">
            <div className="general-theme-title">INFRASTRUCTURE</div>
            <div className="general-info-line"><span className="lbl">Datacenter</span><span className="val">{hosting.datacenter || "-"}</span></div>
            <div className="general-info-line"><span className="lbl">Cluster</span><span className="val">{hosting.cluster || "-"}</span></div>
            <div className="general-info-line"><span className="lbl">Filer</span><span className="val">{(hosting as any).filer || "-"}</span></div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">RÉSEAU</div>
            <div className="general-info-line">
              <span className="lbl">IPv4</span>
              <span className="val ip-field">{hosting.hostingIp || "-"}</span>
              <IconBtn icon="📋" title="Copier" onClick={() => copyToClipboard(hosting.hostingIp || "")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">IPv6</span>
              <span className="val ip-field">{hosting.hostingIpv6 || "-"}</span>
              <IconBtn icon="📋" title="Copier" onClick={() => copyToClipboard(hosting.hostingIpv6 || "")} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">SÉCURITÉ</div>
            <div className="general-info-line">
              <span className="lbl">SSL</span>
              <span className="val">{sslProvider}</span>
              <Btn label="Changer" onClick={() => setShowOrderSslModal(true)} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Firewall</span>
              <span className="val">Activé</span>
              <Btn label="Configurer" onClick={() => goToTab("multisite")} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">EMAILS</div>
            <div className="general-info-line"><span className="lbl">Comptes</span><span className="val">- / 100</span><Btn label="Gérer" onClick={() => goToTab("emails")} /></div>
            <div className="general-info-line"><span className="lbl">Alias</span><span className="val">-</span><Btn label="Gérer" onClick={() => goToTab("emails")} /></div>
            <div className="general-info-line"><span className="lbl">Redirections</span><span className="val">-</span><Btn label="Gérer" onClick={() => goToTab("emails")} /></div>
            <div className="general-info-line"><span className="lbl">Mailing lists</span><span className="val">-</span><Btn label="Gérer" onClick={() => goToTab("emails")} /></div>
          </div>

          <div className="general-theme-col"></div>
        </div>
      </div>

      {/* ========== BLOC 4: FACTURATION ========== */}
      <div className="general-info-bloc">
        <h3 className="general-bloc-title">Facturation</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>
          
          <div className="general-theme-col">
            <div className="general-theme-title">SERVICE</div>
            <div className="general-info-line"><span className="lbl">État</span><span className="val status-ok">{hosting.state === "active" ? "Actif" : hosting.state}</span></div>
            <div className="general-info-line">
              <span className="lbl">Expiration</span>
              <span className="val">{formatDate(serviceInfos?.expiration)}</span>
              <Btn label="Renouveler" onClick={() => navigate("/home/billing/services")} />
            </div>
            <div className="general-info-line"><span className="lbl">Création</span><span className="val">{formatDate(serviceInfos?.creation)}</span></div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">OFFRE</div>
            <div className="general-info-line">
              <span className="lbl">Formule</span>
              <span className="val">{hosting.offer || "-"}</span>
              <Btn label="Changer" onClick={() => navigate("/home/billing/services")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Nom affiché</span>
              <span className="val">{hosting.displayName || serviceName}</span>
              <Btn label="Modifier" onClick={() => setShowEditNameModal(true)} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">CONTACTS</div>
            <div className="general-info-line"><span className="lbl">Admin</span><span className="val">{serviceInfos?.contactAdmin || "-"}</span><Btn label="Modifier" onClick={() => navigate("/home/account/contacts")} /></div>
            <div className="general-info-line"><span className="lbl">Technique</span><span className="val">{serviceInfos?.contactTech || "-"}</span><Btn label="Modifier" onClick={() => navigate("/home/account/contacts")} /></div>
            <div className="general-info-line"><span className="lbl">Facturation</span><span className="val">{serviceInfos?.contactBilling || "-"}</span><Btn label="Modifier" onClick={() => navigate("/home/account/contacts")} /></div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">PAIEMENT</div>
            <div className="general-info-line">
              <span className="lbl">Renouvellement</span>
              <span className="val">{renewAuto ? "Auto" : "Manuel"}</span>
              <Btn label="Configurer" onClick={() => navigate("/home/billing/services")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Moyen</span>
              <span className="val">CB •••• 4242</span>
              <Btn label="Modifier" onClick={() => navigate("/home/billing/payment-methods")} />
            </div>
            <div className="general-info-line">
              <span className="lbl">Factures</span>
              <Btn label="Voir" onClick={() => navigate("/home/billing/invoices")} />
            </div>
          </div>

          <div className="general-theme-col">
            <div className="general-theme-title">RÉSILIATION</div>
            <div className="general-info-line"><span className="lbl">Domaine</span><Btn label="Résilier" onClick={() => navigate("/home/billing/services")} danger /></div>
            <div className="general-info-line"><span className="lbl">Hébergement</span><Btn label="Résilier" onClick={() => setShowTerminateModal(true)} danger /></div>
            <div className="general-info-line"><span className="lbl">Tous les services</span><Btn label="Supprimer" onClick={() => setShowTerminateModal(true)} danger /></div>
          </div>
        </div>
      </div>

      {/* ========== MODALS ========== */}
      <RestoreSnapshotModal serviceName={serviceName} isOpen={showRestoreModal} onClose={() => setShowRestoreModal(false)} onSuccess={() => { setShowRestoreModal(false); handleModalSuccess("Restauration lancée"); }} />
      <OvhConfigModal serviceName={serviceName} isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} onSuccess={() => { setShowConfigModal(false); handleModalSuccess("Config mise à jour"); }} />
      <TerminateModal serviceName={serviceName} isOpen={showTerminateModal} onClose={() => setShowTerminateModal(false)} />
      <EditDisplayNameModal serviceName={serviceName} currentName={hosting.displayName || serviceName} isOpen={showEditNameModal} onClose={() => setShowEditNameModal(false)} onSuccess={() => { setShowEditNameModal(false); handleModalSuccess("Nom mis à jour"); }} />
      {primaryUser && <ConfigureSshModal serviceName={serviceName} primaryLogin={primaryUser.login} currentSshState={primaryUser.sshState} isOpen={showSshModal} onClose={() => setShowSshModal(false)} onSuccess={() => { setShowSshModal(false); handleModalSuccess("SSH mis à jour"); loadData(); }} />}
      <OrderSslModal serviceName={serviceName} isOpen={showOrderSslModal} onClose={() => setShowOrderSslModal(false)} onSuccess={() => { setShowOrderSslModal(false); handleModalSuccess("Certificat SSL commandé"); }} />
    </div>
  );
}

export default GeneralTab;
