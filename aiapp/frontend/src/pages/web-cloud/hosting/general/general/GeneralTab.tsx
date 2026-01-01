// ============================================================
// GENERAL TAB - 4 blocs × 5 colonnes - TARGET STRICT
// Conforme target_.web-cloud.hosting.general.svg
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab.service";
import type { Hosting } from "../../hosting.types";
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

function Badge({ status }: { status: "active" | "disabled" }) {
  return (
    <span className={`general-badge general-badge-${status}`}>
      {status === "active" ? "Actif" : "Désactivé"}
    </span>
  );
}

function Link({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <span className="general-link" onClick={() => { console.log('[GeneralTab] Action: clic lien', { label }); onClick?.(); }}>{label}</span>
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

export function GeneralTab({ serviceName, onTabChange }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.general");
  const navigate = useNavigate();

  // ---------- STATE ----------
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [serviceInfos, setServiceInfos] = useState<ServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [counts, setCounts] = useState({ attachedDomains: 0, databases: 0, modules: 0 });
  const [ssl, setSsl] = useState<any>(null);
  const [cdn, setCdn] = useState<any>(null);
  const [phpVersion, setPhpVersion] = useState("-");
  const [phpEnv, setPhpEnv] = useState("production");
  const [primaryLogin, setPrimaryLogin] = useState("-");
  const [boost, setBoost] = useState(false);
  const [firewall, setFirewall] = useState(true);
  const [emailsAuto, setEmailsAuto] = useState(true);

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
      setPrimaryLogin(h.primaryLogin || "-");
      setBoost(!!h.boostOffer);

      // PHP version & env
      try {
        const c = await fetch(`/api/ovh/hosting/web/${serviceName}/ovhConfig`).then(r => r.json());
        setPhpVersion(c?.engineVersion || "-");
        setPhpEnv(c?.environment || "production");
      } catch {}

    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  const loadCounts = useCallback(async () => {
    try {
      const r = await Promise.allSettled([
        generalService.listAttachedDomains(serviceName),
        generalService.listDatabases(serviceName),
        generalService.listModules(serviceName),
      ]);
      setCounts({
        attachedDomains: r[0].status === "fulfilled" ? r[0].value.length : 0,
        databases: r[1].status === "fulfilled" ? r[1].value.length : 0,
        modules: r[2].status === "fulfilled" ? r[2].value.length : 0,
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

  const formatQuota = () => {
    const used = hosting?.quotaUsed, size = hosting?.quotaSize;
    if (!used?.value || !size?.value) return { text: "- / - Go", pct: 0 };
    const toGb = (v: number, u: string) => u === "GB" ? v : u === "MB" ? v/1024 : v/(1024*1024*1024);
    const usedGb = toGb(used.value, used.unit || "B"), sizeGb = toGb(size.value, size.unit || "B");
    const pct = sizeGb > 0 ? Math.round((usedGb / sizeGb) * 100) : 0;
    return { text: `${usedGb.toFixed(1)} Go / ${sizeGb.toFixed(0)} Go`, pct };
  };

  const goToTab = (id: string) => onTabChange?.(id);

  // ---------- RENDER ----------
  if (loading) return (
    <div className="general-tab">
      <div className="general-bloc-skeleton"/><div className="general-bloc-skeleton"/>
      <div className="general-bloc-skeleton"/><div className="general-bloc-skeleton"/>
    </div>
  );

  if (error || !hosting) return <div className="general-error-state">{error || t("error")}</div>;

  const quota = formatQuota();
  const ftpServer = hosting.cluster ? `ftp.${hosting.cluster}.ovh.net` : "-";
  const sslActive = ssl?.status === "ok" || ssl?.provider;
  const sslProvider = ssl?.provider === "LETSENCRYPT" ? "Let's Encrypt" : ssl?.provider || "-";
  const cdnActive = !!cdn?.type || hosting.hasCdn;
  const cdnType = cdn?.type || (hosting.hasCdn ? "Basic" : "-");
  const renewAuto = serviceInfos?.renew?.automatic;

  return (
    <div className="general-tab">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ========== BLOC 1: Hébergement ========== */}
      <div className="general-bloc">
        <h3 className="general-bloc-title">{t("bloc.hosting")}</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>

          {/* Col 1: STOCKAGE */}
          <div className="general-col">
            <div className="general-col-title">{t("col.storage")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("storage.disk")}</span>
              <span className="general-val">{quota.text}</span>
            </div>
            <div className="general-progress">
              <div className="general-progress-bar">
                <div className="general-progress-fill" style={{ width: `${Math.min(quota.pct, 100)}%` }}/>
              </div>
            </div>
            <div className="general-row">
              <span className="general-lbl">{t("storage.inodes")}</span>
              <span className="general-val">- / 500 000</span>
            </div>
          </div>

          {/* Col 2: FTP/SSH */}
          <div className="general-col">
            <div className="general-col-title">{t("col.ftpSsh")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("ftp.server")}</span>
              <span className="general-val">{ftpServer}</span>
            </div>
            <div className="general-row">
              <span className="general-lbl">{t("ftp.login")}</span>
              <span className="general-val">{primaryLogin}</span>
            </div>
          </div>

          {/* Col 3: BASE DE DONNÉES */}
          <div className="general-col">
            <div className="general-col-title">{t("col.database")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("db.included")}</span>
              <span className="general-val">{counts.databases} / 5</span>
            </div>
            <div className="general-row">
              <span className="general-lbl">{t("db.cloud")}</span>
              <Link label={t("db.order")} onClick={() => navigate("/web-cloud/order/clouddb")} />
            </div>
          </div>

          {/* Col 4: MULTISITE */}
          <div className="general-col">
            <div className="general-col-title">{t("col.multisite")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("multisite.domains")}</span>
              <span className="general-val">{counts.attachedDomains}</span>
            </div>
            <div className="general-row">
              <span className="general-lbl">{t("multisite.modules")}</span>
              <span className="general-val">{counts.modules}</span>
            </div>
          </div>

          {/* Col 5: CONFIG */}
          <div className="general-col">
            <div className="general-col-title">{t("col.config")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("config.php")}</span>
              <span className="general-val">{phpVersion} <span className="general-dot-ok">●</span></span>
            </div>
            <div className="general-row">
              <span className="general-lbl">{t("config.env")}</span>
              <span className="general-val">{phpEnv}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BLOC 2: Configuration ========== */}
      <div className="general-bloc">
        <h3 className="general-bloc-title">{t("bloc.configuration")}</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>

          {/* Col 1: SSL */}
          <div className="general-col">
            <div className="general-col-title">{t("col.ssl")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("ssl.certificate")}</span>
            </div>
            <div className="general-row">
              <Badge status={sslActive ? "active" : "disabled"} />
              <span className="general-val">{sslProvider}</span>
            </div>
          </div>

          {/* Col 2: CDN */}
          <div className="general-col">
            <div className="general-col-title">{t("col.cdn")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("cdn.option")}</span>
            </div>
            <div className="general-row">
              <Badge status={cdnActive ? "active" : "disabled"} />
              <span className="general-val">{cdnType}</span>
            </div>
          </div>

          {/* Col 3: BOOST */}
          <div className="general-col">
            <div className="general-col-title">{t("col.boost")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("boost.performance")}</span>
            </div>
            <div className="general-row">
              <Badge status={boost ? "active" : "disabled"} />
            </div>
          </div>

          {/* Col 4: FIREWALL */}
          <div className="general-col">
            <div className="general-col-title">{t("col.firewall")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("firewall.application")}</span>
            </div>
            <div className="general-row">
              <Badge status={firewall ? "active" : "disabled"} />
            </div>
          </div>

          {/* Col 5: EMAILS AUTO */}
          <div className="general-col">
            <div className="general-col-title">{t("col.emailsAuto")}</div>
            <div className="general-row">
              <span className="general-lbl">{t("emails.outgoing")}</span>
            </div>
            <div className="general-row">
              <Badge status={emailsAuto ? "active" : "disabled"} />
            </div>
          </div>
        </div>
      </div>

      {/* ========== BLOC 3: Infrastructure ========== */}
      <div className="general-bloc general-bloc-small">
        <h3 className="general-bloc-title">{t("bloc.infrastructure")}</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>

          {/* Col 1: DATACENTER */}
          <div className="general-col">
            <div className="general-col-title">{t("col.datacenter")}</div>
            <div className="general-row">
              <span className="general-val">{hosting.datacenter || "-"}</span>
            </div>
          </div>

          {/* Col 2: CLUSTER */}
          <div className="general-col">
            <div className="general-col-title">{t("col.cluster")}</div>
            <div className="general-row">
              <span className="general-val">{hosting.cluster ? `${hosting.cluster}.ovh.net` : "-"}</span>
            </div>
          </div>

          {/* Col 3: IPv4 */}
          <div className="general-col">
            <div className="general-col-title">IPv4</div>
            <div className="general-row">
              <span className="general-val general-mono">{hosting.hostingIp || "-"}</span>
            </div>
          </div>

          {/* Col 4: IPv6 */}
          <div className="general-col">
            <div className="general-col-title">IPv6</div>
            <div className="general-row">
              <span className="general-val general-mono">{hosting.hostingIpv6 ? `${hosting.hostingIpv6.substring(0, 20)}...` : "-"}</span>
            </div>
          </div>

          {/* Col 5: FILER */}
          <div className="general-col">
            <div className="general-col-title">{t("col.filer")}</div>
            <div className="general-row">
              <span className="general-val">{(hosting as any).filer || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BLOC 4: Abonnement ========== */}
      <div className="general-bloc">
        <h3 className="general-bloc-title">{t("bloc.subscription")}</h3>
        <div className="general-bloc-grid">
          <div className="general-bloc-dividers"><span/><span/><span/><span/></div>

          {/* Col 1: OFFRE */}
          <div className="general-col">
            <div className="general-col-title">{t("col.offer")}</div>
            <div className="general-row">
              <span className="general-val">{hosting.offer || "-"}</span>
            </div>
            <div className="general-row">
              <Link label={t("offer.change")} onClick={() => navigate("/home/billing/services")} />
            </div>
          </div>

          {/* Col 2: CRÉATION */}
          <div className="general-col">
            <div className="general-col-title">{t("col.creation")}</div>
            <div className="general-row">
              <span className="general-val">{formatDate(serviceInfos?.creation)}</span>
            </div>
          </div>

          {/* Col 3: EXPIRATION */}
          <div className="general-col">
            <div className="general-col-title">{t("col.expiration")}</div>
            <div className="general-row">
              <span className="general-val">{formatDate(serviceInfos?.expiration)}</span>
            </div>
            <div className="general-row">
              <Link label={t("expiration.renew")} onClick={() => navigate("/home/billing/services")} />
            </div>
          </div>

          {/* Col 4: RENOUVELLEMENT */}
          <div className="general-col">
            <div className="general-col-title">{t("col.renewal")}</div>
            <div className="general-row">
              <span className="general-val">{renewAuto ? t("renewal.auto") : t("renewal.manual")}</span>
            </div>
          </div>

          {/* Col 5: CONTACTS */}
          <div className="general-col">
            <div className="general-col-title">{t("col.contacts")}</div>
            <div className="general-row-compact">
              <span className="general-lbl-small">Admin:</span>
              <span className="general-val-small">{serviceInfos?.contactAdmin || "-"}</span>
            </div>
            <div className="general-row-compact">
              <span className="general-lbl-small">Tech:</span>
              <span className="general-val-small">{serviceInfos?.contactTech || "-"}</span>
            </div>
            <div className="general-row-compact">
              <span className="general-lbl-small">Billing:</span>
              <span className="general-val-small">{serviceInfos?.contactBilling || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralTab;
