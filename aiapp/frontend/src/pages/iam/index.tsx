// ============================================================
// IAM PAGE - Identity & Access Management
// Univers autonome - Section Accueil avec 4 tabs (NAV3)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhCredentials } from "../../types/auth.types";
import * as iamService from "../../services/iam.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

const tabIdMap: Record<string, string> = {
  "iam-identities": "identities",
  "iam-policies": "policies",
  "iam-groups": "groups",
  "iam-logs": "logs",
};

interface IamPageProps {
  initialTab?: string;
}

function useCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export default function IamPage({ initialTab = "identities" }: IamPageProps) {
  const { t } = useTranslation('iam/index');
  const [activeTab, setActiveTab] = useState("identities");

  const tabs = [
    { id: "identities", label: t('tabs.identities') },
    { id: "policies", label: t('tabs.policies') },
    { id: "groups", label: t('tabs.groups') },
    { id: "logs", label: t('tabs.logs') },
  ];

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.some((t) => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  return (
    <div className="iam-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>{t('title')}</h1>
          <p className="page-description">{t('description')}</p>
        </div>
        <a href="https://docs.ovh.com/fr/iam/" target="_blank" rel="noopener noreferrer" className="guides-link">
          {t('docsLink')}
        </a>
      </div>

      <div className="tabs-container">
        <nav className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="iam-content">
        {activeTab === "identities" && <IdentitiesTab />}
        {activeTab === "policies" && <PoliciesTab />}
        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "logs" && <LogsTab />}
      </div>
    </div>
  );
}

// ============================================================
// IDENTITIES TAB
// ============================================================
function IdentitiesTab() {
  const { t } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<iamService.IamUser[]>([]);
  const credentials = useCredentials();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getUsers(credentials);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      OK: { label: t('identities.status.active'), className: "badge-success" },
      DISABLED: { label: t('identities.status.disabled'), className: "badge-error" },
      PASSWORD_CHANGE_REQUIRED: { label: t('identities.status.passwordChange'), className: "badge-warning" },
    };
    return statusMap[status] || { label: status, className: "badge-neutral" };
  };

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('identities.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadUsers} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel identities-tab">
      <div className="section-intro">
        <h2>{t('identities.title')}</h2>
        <p>{t('identities.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('identities.count', { count: users.length })}</span>
        <button className="btn btn-primary btn-sm">{t('identities.addButton')}</button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <UserIcon />
          <h3>{t('identities.empty.title')}</h3>
          <p>{t('identities.empty.description')}</p>
          <button className="btn btn-primary">{t('identities.addButton')}</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('identities.columns.login')}</th>
                <th>{t('identities.columns.email')}</th>
                <th>{t('identities.columns.group')}</th>
                <th>{t('identities.columns.status')}</th>
                <th>{t('identities.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const status = getStatusBadge(user.status);
                return (
                  <tr key={user.login}>
                    <td><strong>{user.login}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.group || "-"}</td>
                    <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                    <td className="actions-cell">
                      <button className="btn btn-outline btn-sm">{t('actions.edit')}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// POLICIES TAB
// ============================================================
function PoliciesTab() {
  const { t, i18n } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<iamService.IamPolicy[]>([]);
  const credentials = useCredentials();

  useEffect(() => { loadPolicies(); }, []);

  const loadPolicies = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getPolicies(credentials);
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('policies.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadPolicies} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel policies-tab">
      <div className="section-intro">
        <h2>{t('policies.title')}</h2>
        <p>{t('policies.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('policies.count', { count: policies.length })}</span>
        <button className="btn btn-primary btn-sm">{t('policies.createButton')}</button>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state">
          <ShieldIcon />
          <h3>{t('policies.empty.title')}</h3>
          <p>{t('policies.empty.description')}</p>
          <button className="btn btn-primary">{t('policies.createButton')}</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('policies.columns.name')}</th>
                <th>{t('policies.columns.description')}</th>
                <th>{t('policies.columns.identities')}</th>
                <th>{t('policies.columns.resources')}</th>
                <th>{t('policies.columns.createdAt')}</th>
                <th>{t('policies.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>
                    <strong>{policy.name}</strong>
                    {policy.readOnly && <span className="badge badge-neutral" style={{ marginLeft: "0.5rem" }}>{t('common.readOnly')}</span>}
                  </td>
                  <td>{policy.description || "-"}</td>
                  <td>{policy.identities?.length || 0}</td>
                  <td>{policy.resources?.length || 0}</td>
                  <td>{formatDate(policy.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm">{t('actions.edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// GROUPS TAB
// ============================================================
function GroupsTab() {
  const { t, i18n } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<iamService.IamResourceGroup[]>([]);
  const credentials = useCredentials();

  useEffect(() => { loadGroups(); }, []);

  const loadGroups = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getResourceGroups(credentials);
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('groups.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadGroups} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel groups-tab">
      <div className="section-intro">
        <h2>{t('groups.title')}</h2>
        <p>{t('groups.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('groups.count', { count: groups.length })}</span>
        <button className="btn btn-primary btn-sm">{t('groups.createButton')}</button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <FolderIcon />
          <h3>{t('groups.empty.title')}</h3>
          <p>{t('groups.empty.description')}</p>
          <button className="btn btn-primary">{t('groups.createButton')}</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('groups.columns.name')}</th>
                <th>{t('groups.columns.owner')}</th>
                <th>{t('groups.columns.resources')}</th>
                <th>{t('groups.columns.createdAt')}</th>
                <th>{t('groups.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>
                    <strong>{group.name}</strong>
                    {group.readOnly && <span className="badge badge-neutral" style={{ marginLeft: "0.5rem" }}>{t('common.readOnly')}</span>}
                  </td>
                  <td>{group.owner}</td>
                  <td>{group.resources?.length || 0}</td>
                  <td>{formatDate(group.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm">{t('actions.edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// LOGS TAB
// ============================================================
function LogsTab() {
  const { t, i18n } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<iamService.IamLog[]>([]);
  const [filter, setFilter] = useState<"all" | "allowed" | "denied">("all");
  const credentials = useCredentials();

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getLogs(credentials);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const filteredLogs = logs.filter(log => {
    if (filter === "all") return true;
    if (filter === "allowed") return log.allowed;
    if (filter === "denied") return !log.allowed;
    return true;
  });

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('logs.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadLogs} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel logs-tab">
      <div className="section-intro">
        <h2>{t('logs.title')}</h2>
        <p>{t('logs.description')}</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">{t('logs.filters.all')}</option>
            <option value="allowed">{t('logs.filters.allowed')}</option>
            <option value="denied">{t('logs.filters.denied')}</option>
          </select>
          <span className="result-count">{t('logs.count', { count: filteredLogs.length })}</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadLogs}>{tCommon('actions.refresh')}</button>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="empty-state">
          <LogIcon />
          <h3>{t('logs.empty.title')}</h3>
          <p>{t('logs.empty.description')}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('logs.columns.date')}</th>
                <th>{t('logs.columns.identity')}</th>
                <th>{t('logs.columns.action')}</th>
                <th>{t('logs.columns.resource')}</th>
                <th>{t('logs.columns.result')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>{formatDate(log.createdAt)}</td>
                  <td className="urn-cell" title={log.identityUrn}>{log.identityUrn.split("/").pop()}</td>
                  <td>{log.action}</td>
                  <td className="urn-cell" title={log.resourceUrn}>{log.resourceUrn.split("/").pop()}</td>
                  <td>
                    <span className={`badge ${log.allowed ? "badge-success" : "badge-error"}`}>
                      {log.allowed ? t('logs.result.allowed') : t('logs.result.denied')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ICONS
// ============================================================
function UserIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
}

function ShieldIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
}

function FolderIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
}

function LogIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
}
