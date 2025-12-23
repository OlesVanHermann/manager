// ============================================================
// GENERAL TAB - 4 blocs × 5 colonnes - VERSION MODALES
// Conforme OLD Manager avec vrais modals
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { hostingService, HostingInfo } from "../../../../../services/web-cloud.hosting";
import { RestoreSnapshotModal, OvhConfigModal, TerminateModal } from "../components";
import { 
  EditDisplayNameModal, 
  ConfigureSshModal, 
  OrderSslModal 
} from "../components/modals";

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

// Toggle Switch Component
function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <button 
      className={`toggle ${enabled ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`}
      onClick={onChange}
      disabled={disabled}
      title={enabled ? "Activé" : "Désactivé"}
    >
      <span className="toggle-knob" />
    </button>
  );
}

// Icon Button Component
function IconBtn({ icon, title, onClick, danger }: { icon: string; title: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button 
      className={`icon-btn ${danger ? 'danger' : ''}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  );
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`toast toast-${type}`}>
      <span>{type === "success" ? "✓" : "✗"} {message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export function GeneralTab({ serviceName, onTabChange, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const navigate = useNavigate();
  
  const [hosting, setHosting] = useState<HostingInfo | null>(null);
  const [serviceInfos, setServiceInfos] = useState<ServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [counts, setCounts] = useState({ attachedDomains: 0, databases: 0, ftpUsers: 0, crons: 0, envVars: 0, modules: 0 });
  const [ssl, setSsl] = useState<any>(null);
  const [cdn, setCdn] = useState<any>(null);
  const [phpVersion, setPhpVersion] = useState("-");
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [primaryUser, setPrimaryUser] = useState<{ login: string; sshState: "active" | "none" | "sftponly" } | null>(null);
  
  // Modals existants
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  
  // Nouveaux modals
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showSshModal, setShowSshModal] = useState(false);
  const [showOrderSslModal, setShowOrderSslModal] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [h, infos] = await Promise.all([
        hostingService.getHostingInfo(serviceName),
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
      
      // Primary FTP user (pour SSH state)
      try {
        const users = await hostingService.listUsers(serviceName);
        if (users.length > 0) {
          const user = await hostingService.getUser(serviceName, users[0]);
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
        hostingService.listAttachedDomains(serviceName),
        hostingService.listDatabases(serviceName),
        hostingService.listUsers(serviceName),
        hostingService.listCrons(serviceName),
        fetch(`/api/ovh/hosting/web/${serviceName}/envVar`).then(r => r.json()),
        hostingService.listModules(serviceName),
      ]);
      setCounts({
        attachedDomains: r[0].status === "fulfilled" ? r[0].value.length : 0,
        databases: r[1].status === "fulfilled" ? r[1].value.length : 0,
        ftpUsers: r[2].status === "fulfilled" ? r[2].value.length : 0,
        crons: r[3].status === "fulfilled" ? r[3].value.length : 0,
        envVars: r[4].status === "fulfilled" && Array.isArray(r[4].value) ? r[4].value.length : 0,
        modules: r[5].status === "fulfilled" ? r[5].value.length : 0,
      });
    } catch {}
  }, [serviceName]);

  const loadServices = useCallback(async () => {
    try {
      const [s, c] = await Promise.allSettled([
        hostingService.getSslInfo(serviceName), 
        fetch(`/api/ovh/hosting/web/${serviceName}/cdn`).then(r => r.json())
      ]);
      if (s.status === "fulfilled") setSsl(s.value);
      if (c.status === "fulfilled") setCdn(c.value);
    } catch {}
  }, [serviceName]);

  useEffect(() => { loadData(); loadCounts(); loadServices(); }, [loadData, loadCounts, loadServices]);

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
    return { text: `${usedGb.toFixed(1)}/${sizeGb.toFixed(0)}Go`, pct };
  };

  const copyToClipboard = (text: string) => { 
    navigator.clipboard.writeText(text); 
    setToast({ message: t("common.copied", "Copié"), type: "success" }); 
  };
  
  const goToTab = (id: string) => onTabChange?.(id);
  
  const handleFlushCache = async () => {
    if (!hosting?.hasCdn && !cdn) { 
      setToast({ message: t("general.cdn.notEnabled", "CDN non activé"), type: "error" }); 
      return; 
    }
    try { 
      await fetch(`/api/ovh/hosting/web/${serviceName}/cdn/flush`, { method: 'POST' });
      setToast({ message: t("general.cdn.flushed", "Cache vidé"), type: "success" }); 
    }
    catch { setToast({ message: t("general.cdn.error", "CDN non disponible"), type: "error" }); }
  };

  const handleRegenerateSsl = async () => {
    if (!ssl) {
      setToast({ message: t("general.ssl.notConfigured", "Aucun SSL configuré"), type: "error" });
      return;
    }
    try {
      await hostingService.regenerateSsl(serviceName);
      setToast({ message: t("general.ssl.regenerating", "Régénération SSL lancée"), type: "success" });
      loadServices();
    } catch (err: any) {
      setToast({ message: err.message || t("common.error", "Erreur"), type: "error" });
    }
  };

  const handleModalSuccess = (msg: string) => { 
    setToast({ message: msg, type: "success" }); 
    loadData(); 
    loadServices();
    onRefresh?.(); 
  };

  if (loading) return (
    <div className="general-tab">
      <div className="bloc-skeleton"/>
      <div className="bloc-skeleton"/>
      <div className="bloc-skeleton"/>
      <div className="bloc-skeleton"/>
    </div>
  );
  
  if (error || !hosting) return <div className="error-state">{error || "Erreur"}</div>;

  const quota = formatQuota();
  const sshEnabled = primaryUser?.sshState === "active";
  const sslProvider = ssl?.provider === "LETSENCRYPT" ? "LE" : ssl?.provider || "-";
  const cdnEnabled = !!cdn?.type || hosting.hasCdn;
  const boostEnabled = !!hosting.boostOffer;
  const renewAuto = serviceInfos?.renew?.automatic;

  return (
    <div className="general-tab">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* BLOC 1: WEB */}
      <div className="info-bloc">
        <h3 className="bloc-title">{t("general.bloc.web", "Web")}</h3>
        <div className="bloc-dividers"><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/></div>
        <div className="bloc-columns">
          <div className="theme-col">
            <div className="theme-title">{t("general.storage", "STOCKAGE")}</div>
            <div className="info-row">
              <span className="info-label">{t("general.space", "Espace")}</span>
              <div className="progress-container">
                <div className="progress-bar"><div className={`progress-fill ${quota.pct > 90 ? 'danger' : quota.pct > 70 ? 'warning' : ''}`} style={{ width: `${Math.min(quota.pct, 100)}%` }}/></div>
                <span className="progress-text">{quota.text}</span>
              </div>
            </div>
            <div className="info-row"><span className="info-label">{t("general.sites", "Sites")}</span><span className="info-value">{counts.attachedDomains}</span><IconBtn icon="⚙" title={t("general.manageSites", "Gérer les sites")} onClick={() => goToTab("multisite")} /></div>
            <div className="info-row"><span className="info-label">{t("general.modules", "Modules")}</span><span className="info-value">{counts.modules}</span><IconBtn icon="⚙" title={t("general.manageModules", "Gérer les modules")} onClick={() => goToTab("modules")} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">PHP</div>
            <div className="info-row"><span className="info-label">{t("general.version", "Version")}</span><span className="info-value">{phpVersion}</span><IconBtn icon="⇄" title={t("general.changeVersion", "Changer version")} onClick={() => setShowConfigModal(true)} /></div>
            <div className="info-row"><span className="info-label">.ovhconfig</span><IconBtn icon="✎" title={t("common.edit", "Modifier")} onClick={() => setShowConfigModal(true)} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.logs", "LOGS")}</div>
            <div className="info-row"><span className="info-label">{t("general.realtime", "Temps réel")}</span><IconBtn icon="↗" title={t("general.accessLogs", "Accéder aux logs")} onClick={() => goToTab("logs")} /></div>
            <div className="info-row"><span className="info-label">{t("general.stats", "Stats")}</span><IconBtn icon="📊" title={t("general.viewStats", "Voir statistiques")} onClick={() => window.open(`https://logs.ovh.net/${serviceName}/`, '_blank')} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.backup", "BACKUP")}</div>
            <div className="info-row"><span className="info-label">{t("general.lastBackup", "Dernière")}</span><span className="info-value">{formatDateTime(lastBackupDate)}</span></div>
            <div className="info-row"><span className="info-label">{t("general.restore", "Restore")}</span><IconBtn icon="↺" title={t("general.restoreSnapshot", "Restaurer un snapshot")} onClick={() => setShowRestoreModal(true)} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.perf", "PERF")}</div>
            <div className="info-row"><span className="info-label">{t("general.boost", "Boost")}</span><Toggle enabled={boostEnabled} onChange={() => goToTab("boost")} /></div>
            <div className="info-row"><span className="info-label">{t("general.cdn.title", "CDN")}</span><Toggle enabled={cdnEnabled} onChange={() => goToTab("cdn")} /></div>
            <div className="info-row"><span className="info-label">{t("general.cache", "Cache")}</span><IconBtn icon="🗑" title={t("general.flushCache", "Vider le cache")} onClick={handleFlushCache} /></div>
          </div>
        </div>
      </div>

      {/* BLOC 2: EXPERT */}
      <div className="info-bloc">
        <h3 className="bloc-title">{t("general.bloc.expert", "Expert")}</h3>
        <div className="bloc-dividers"><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/></div>
        <div className="bloc-columns">
          <div className="theme-col">
            <div className="theme-title">{t("general.access", "ACCÈS")}</div>
            <div className="info-row">
              <span className="info-label">SSH</span>
              <Toggle enabled={sshEnabled} onChange={() => setShowSshModal(true)} />
              <IconBtn icon="⚙" title={t("general.configureSsh", "Configurer SSH")} onClick={() => setShowSshModal(true)} />
            </div>
            <div className="info-row"><span className="info-label">FTP</span><span className="info-value">{counts.ftpUsers}</span><IconBtn icon="⚙" title={t("general.manageFtp", "Gérer FTP")} onClick={() => goToTab("ftp")} /></div>
            <div className="info-row"><span className="info-label">HTTP</span><IconBtn icon="↗" title={t("general.accessHttp", "Accéder HTTP")} onClick={() => window.open(`https://${hosting.cluster}.hosting.ovh.net/`, '_blank')} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.database", "BDD")}</div>
            <div className="info-row"><span className="info-label">MySQL</span><span className="info-value">{counts.databases}/5</span><IconBtn icon="⚙" title={t("general.manageDb", "Gérer BDD")} onClick={() => goToTab("database")} /></div>
            <div className="info-row"><span className="info-label">phpMyAdmin</span><IconBtn icon="↗" title={t("general.openPma", "Ouvrir phpMyAdmin")} onClick={() => window.open('https://phpmyadmin.ovh.net/', '_blank')} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.cron", "CRON")}</div>
            <div className="info-row"><span className="info-label">{t("general.tasks", "Tâches")}</span><span className="info-value">{counts.crons}</span><IconBtn icon="⚙" title={t("general.manageCron", "Gérer Cron")} onClick={() => goToTab("cron")} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.variables", "VARIABLES")}</div>
            <div className="info-row"><span className="info-label">Env</span><span className="info-value">{counts.envVars}</span><IconBtn icon="⚙" title={t("general.manageVars", "Gérer variables")} onClick={() => goToTab("envvars")} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.runtimes", "RUNTIMES")}</div>
            <div className="info-row"><span className="info-label">Node.js</span><IconBtn icon="⚙" title={t("general.configure", "Configurer")} onClick={() => goToTab("runtimes")} /></div>
          </div>
        </div>
      </div>

      {/* BLOC 3: GENERAL */}
      <div className="info-bloc">
        <h3 className="bloc-title">{t("general.bloc.general", "General")}</h3>
        <div className="bloc-dividers"><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/></div>
        <div className="bloc-columns">
          <div className="theme-col">
            <div className="theme-title">{t("general.infra", "INFRA")}</div>
            <div className="info-row"><span className="info-label">DC</span><span className="info-value">{hosting.datacenter || "-"}</span></div>
            <div className="info-row"><span className="info-label">Cluster</span><span className="info-value">{hosting.cluster || "-"}</span></div>
            <div className="info-row"><span className="info-label">Filer</span><span className="info-value">{(hosting as any).filer || "-"}</span></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.network", "RÉSEAU")}</div>
            <div className="info-row"><span className="info-label">IPv4</span><span className="info-value ip-compact">{hosting.hostingIp || "-"}</span><IconBtn icon="📋" title={t("common.copy", "Copier")} onClick={() => copyToClipboard(hosting.hostingIp || "")} /></div>
            <div className="info-row"><span className="info-label">IPv6</span><span className="info-value ip-compact">{hosting.hostingIpv6 || "-"}</span><IconBtn icon="📋" title={t("common.copy", "Copier")} onClick={() => copyToClipboard(hosting.hostingIpv6 || "")} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.security", "SÉCURITÉ")}</div>
            <div className="info-row">
              <span className="info-label">SSL</span>
              <span className="info-value">{sslProvider}</span>
              <IconBtn icon="↺" title={t("general.ssl.regenerate", "Régénérer")} onClick={handleRegenerateSsl} />
              <IconBtn icon="⇄" title={t("general.ssl.order", "Commander")} onClick={() => setShowOrderSslModal(true)} />
            </div>
            <div className="info-row"><span className="info-label">Firewall</span><Toggle enabled={true} onChange={() => goToTab("multisite")} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.emails", "EMAILS")}</div>
            <div className="info-row"><span className="info-label">{t("general.accounts", "Comptes")}</span><span className="info-value">-</span><IconBtn icon="⚙" title={t("common.manage", "Gérer")} onClick={() => goToTab("emails")} /></div>
            <div className="info-row"><span className="info-label">{t("general.alias", "Alias")}</span><span className="info-value">-</span><IconBtn icon="⚙" title={t("common.manage", "Gérer")} onClick={() => goToTab("emails")} /></div>
            <div className="info-row"><span className="info-label">{t("general.redirect", "Redir")}</span><span className="info-value">-</span><IconBtn icon="⚙" title={t("common.manage", "Gérer")} onClick={() => goToTab("emails")} /></div>
          </div>
          <div className="theme-col"></div>
        </div>
      </div>

      {/* BLOC 4: FACTURATION */}
      <div className="info-bloc">
        <h3 className="bloc-title">{t("general.bloc.billing", "Facturation")}</h3>
        <div className="bloc-dividers"><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/><div className="bloc-divider"/></div>
        <div className="bloc-columns">
          <div className="theme-col">
            <div className="theme-title">{t("general.service", "SERVICE")}</div>
            <div className="info-row"><span className="info-label">{t("general.state", "État")}</span><span className="info-value status-ok">{hosting.state === "active" ? t("general.active", "Actif") : hosting.state}</span></div>
            <div className="info-row"><span className="info-label">{t("general.expiration", "Expiration")}</span><span className="info-value">{formatDate(serviceInfos?.expiration)}</span><IconBtn icon="↻" title={t("general.renew", "Renouveler")} onClick={() => navigate("/home/billing/services")} /></div>
            <div className="info-row"><span className="info-label">{t("general.creation", "Création")}</span><span className="info-value">{formatDate(serviceInfos?.creation)}</span></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.offer", "OFFRE")}</div>
            <div className="info-row"><span className="info-label">{t("general.plan", "Formule")}</span><span className="info-value">{hosting.offer || "-"}</span><IconBtn icon="⇄" title={t("general.changeOffer", "Changer offre")} onClick={() => navigate("/home/billing/services")} /></div>
            <div className="info-row">
              <span className="info-label">{t("general.name", "Nom")}</span>
              <span className="info-value">{hosting.displayName || serviceName}</span>
              <IconBtn icon="✎" title={t("general.editName", "Modifier nom")} onClick={() => setShowEditNameModal(true)} />
            </div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.contacts", "CONTACTS")}</div>
            <div className="info-row"><span className="info-label">Admin</span><span className="info-value">{serviceInfos?.contactAdmin || "-"}</span><IconBtn icon="✎" title={t("common.edit", "Modifier")} onClick={() => navigate("/home/account/contacts")} /></div>
            <div className="info-row"><span className="info-label">Tech</span><span className="info-value">{serviceInfos?.contactTech || "-"}</span><IconBtn icon="✎" title={t("common.edit", "Modifier")} onClick={() => navigate("/home/account/contacts")} /></div>
            <div className="info-row"><span className="info-label">Billing</span><span className="info-value">{serviceInfos?.contactBilling || "-"}</span><IconBtn icon="✎" title={t("common.edit", "Modifier")} onClick={() => navigate("/home/account/contacts")} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.payment", "PAIEMENT")}</div>
            <div className="info-row"><span className="info-label">Auto</span><Toggle enabled={!!renewAuto} onChange={() => navigate("/home/billing/services")} /></div>
            <div className="info-row"><span className="info-label">CB</span><span className="info-value">••••</span><IconBtn icon="✎" title={t("common.edit", "Modifier")} onClick={() => navigate("/home/billing/payment-methods")} /></div>
            <div className="info-row"><span className="info-label">{t("general.invoices", "Factures")}</span><IconBtn icon="↗" title={t("general.viewInvoices", "Voir factures")} onClick={() => navigate("/home/billing/invoices")} /></div>
          </div>
          <div className="theme-col">
            <div className="theme-title">{t("general.termination", "RÉSILIATION")}</div>
            <div className="info-row"><span className="info-label">{t("general.domain", "Domaine")}</span><IconBtn icon="×" title={t("general.terminateDomain", "Résilier domaine")} onClick={() => navigate("/home/billing/services")} danger /></div>
            <div className="info-row"><span className="info-label">Hosting</span><IconBtn icon="×" title={t("general.terminateHosting", "Résilier hébergement")} onClick={() => setShowTerminateModal(true)} danger /></div>
            <div className="info-row"><span className="info-label">{t("general.all", "Tout")}</span><IconBtn icon="×" title={t("general.deleteAll", "Supprimer tout")} onClick={() => setShowTerminateModal(true)} danger /></div>
          </div>
        </div>
      </div>

      {/* === MODALS EXISTANTS === */}
      <RestoreSnapshotModal 
        serviceName={serviceName} 
        isOpen={showRestoreModal} 
        onClose={() => setShowRestoreModal(false)} 
        onSuccess={() => { setShowRestoreModal(false); handleModalSuccess(t("general.restoreStarted", "Restauration lancée")); }} 
      />
      <OvhConfigModal 
        serviceName={serviceName} 
        isOpen={showConfigModal} 
        onClose={() => setShowConfigModal(false)} 
        onSuccess={() => { setShowConfigModal(false); handleModalSuccess(t("general.configUpdated", "Config mise à jour")); }} 
      />
      <TerminateModal 
        serviceName={serviceName} 
        isOpen={showTerminateModal} 
        onClose={() => setShowTerminateModal(false)} 
      />

      {/* === NOUVEAUX MODALS === */}
      <EditDisplayNameModal
        serviceName={serviceName}
        currentName={hosting.displayName || serviceName}
        isOpen={showEditNameModal}
        onClose={() => setShowEditNameModal(false)}
        onSuccess={() => { setShowEditNameModal(false); handleModalSuccess(t("general.nameUpdated", "Nom mis à jour")); }}
      />

      {primaryUser && (
        <ConfigureSshModal
          serviceName={serviceName}
          primaryLogin={primaryUser.login}
          currentSshState={primaryUser.sshState}
          isOpen={showSshModal}
          onClose={() => setShowSshModal(false)}
          onSuccess={() => { setShowSshModal(false); handleModalSuccess(t("general.sshUpdated", "SSH mis à jour")); loadData(); }}
        />
      )}

      <OrderSslModal
        serviceName={serviceName}
        isOpen={showOrderSslModal}
        onClose={() => setShowOrderSslModal(false)}
        onSuccess={() => { setShowOrderSslModal(false); handleModalSuccess(t("general.sslOrdered", "Certificat SSL commandé")); }}
      />
    </div>
  );
}

export default GeneralTab;
