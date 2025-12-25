// ============================================================
// MANAGED WORDPRESS INDEX - Page principale WordPress Managé
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage } from "../../../../components/ServiceListPage";
import { managedWordPressService, ManagedWordPress } from "../../../../services/web-cloud.managed-wordpress";
import { CreateWebsiteModal, ImportWebsiteModal, DeleteWebsiteModal } from "./components";
import { Onboarding } from "./Onboarding";
import "./styles.css";

// ---------- TYPES ----------
interface Website {
  id: string;
  domain: string;
  url: string;
  adminUrl: string;
  state: string;
  wordpressVersion?: string;
}

// ---------- COMPOSANT PRINCIPAL ----------
export function ManagedWordPressPage() {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [services, setServices] = useState<ManagedWordPress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ManagedWordPress | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [websitesLoading, setWebsitesLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Website | null>(null);

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const names = await managedWordPressService.listServices();
      const data = await Promise.all(names.map(n => managedWordPressService.getService(n)));
      setServices(data);
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selected]);

  // ---------- LOAD WEBSITES ----------
  const loadWebsites = useCallback(async () => {
    if (!selected) return;
    try {
      setWebsitesLoading(true);
      const sites = await managedWordPressService.listWebsites(selected.serviceName);
      setWebsites(sites || []);
      const taskList = await managedWordPressService.listTasks(selected.serviceName);
      setTasks(taskList.filter(t => t.status !== "done"));
    } catch (err) { console.error(err); setWebsites([]); }
    finally { setWebsitesLoading(false); }
  }, [selected]);

  useEffect(() => { loadServices(); }, [loadServices]);
  useEffect(() => { loadWebsites(); }, [selected, loadWebsites]);

  // ---------- HANDLERS ----------
  const handleSuccess = () => {
    loadWebsites();
    setShowCreate(false);
    setShowImport(false);
    setDeleteTarget(null);
  };

  const getStateBadge = (state: string) => {
    const map: Record<string, { class: string; label: string }> = {
      active: { class: "success", label: t("state.active") },
      creating: { class: "warning", label: t("state.creating") },
      importing: { class: "warning", label: t("state.importing") },
      deleting: { class: "warning", label: t("state.deleting") },
      error: { class: "error", label: t("state.error") },
    };
    return map[state] || { class: "inactive", label: state };
  };

  // ---------- RENDER ----------
  if (!loading && services.length === 0) {
    return <Onboarding />;
  }

  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-web-hosting-wordpress"
      i18nNamespace="web-cloud/managed-wordpress/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selected}
      onSelectService={setSelected}
      emptyIcon={<span style={{ fontSize: "3rem" }}>📝</span>}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selected && (
        <div className="service-detail">
          {/* Header */}
          <div className="detail-header">
            <div className="detail-title-row">
              <h2>{selected.displayName || selected.serviceName}</h2>
              <span className={`badge ${getStateBadge(selected.state).class}`}>
                {getStateBadge(selected.state).label}
              </span>
            </div>
            <span className="service-sublabel">{selected.offer} • {selected.datacenter}</span>
          </div>

          {/* Actions */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              {t("actions.create")}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowImport(true)}>
              {t("actions.import")}
            </button>
            <button className="btn btn-secondary" onClick={loadWebsites}>
              {t("actions.refresh")}
            </button>
          </div>

          {/* Tasks en cours */}
          {tasks.length > 0 && (
            <div className="info-banner warning">
              <span className="info-icon">⏳</span>
              <span>{t("tasks.pending", { count: tasks.length })}</span>
            </div>
          )}

          {/* Liste des sites */}
          <div className="websites-section">
            <h3>{t("websites.title")}</h3>
            {websitesLoading ? (
              <div className="loading-spinner">Chargement...</div>
            ) : websites.length === 0 ? (
              <div className="empty-state">
                <p>{t("websites.empty")}</p>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                  {t("websites.createFirst")}
                </button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t("websites.domain")}</th>
                    <th>{t("websites.version")}</th>
                    <th>{t("websites.state")}</th>
                    <th>{t("websites.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {websites.map(site => (
                    <tr key={site.id}>
                      <td>
                        <a href={site.url} target="_blank" rel="noopener noreferrer">{site.domain}</a>
                      </td>
                      <td>{site.wordpressVersion || "-"}</td>
                      <td>
                        <span className={`badge ${getStateBadge(site.state).class}`}>
                          {getStateBadge(site.state).label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <a href={site.adminUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                            {t("websites.admin")}
                          </a>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => setDeleteTarget(site)}
                          >
                            {t("websites.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Quota */}
          {selected.quota && (
            <div className="quota-section">
              <h4>{t("quota.title")}</h4>
              <div className="quota-bar">
                <div 
                  className="quota-used" 
                  style={{ width: `${(selected.quota.used / selected.quota.size) * 100}%` }}
                />
              </div>
              <span className="quota-label">
                {(selected.quota.used / 1024 / 1024 / 1024).toFixed(2)} Go / {(selected.quota.size / 1024 / 1024 / 1024).toFixed(0)} Go
              </span>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selected && (
        <>
          <CreateWebsiteModal
            serviceName={selected.serviceName}
            isOpen={showCreate}
            onClose={() => setShowCreate(false)}
            onSuccess={handleSuccess}
          />
          <ImportWebsiteModal
            serviceName={selected.serviceName}
            isOpen={showImport}
            onClose={() => setShowImport(false)}
            onSuccess={handleSuccess}
          />
          {deleteTarget && (
            <DeleteWebsiteModal
              serviceName={selected.serviceName}
              website={deleteTarget}
              isOpen={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onSuccess={handleSuccess}
            />
          )}
        </>
      )}
    </ServiceListPage>
  );
}

export default ManagedWordPressPage;
