// ============================================================
// IAM PAGE - Identity & Access Management
// Univers autonome - 4 sections: Identités, Politiques, Groupes, Logs
// ============================================================

import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as iamService from "../../services/iam.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

interface IamPageProps {
  initialTab?: string;
}

// Note: Dans l'univers IAM, les sections sont directement les tabs
// La navigation se fait via les section tabs dans App.tsx

function useCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export default function IamPage({ initialTab = "identities" }: IamPageProps) {
  // Le tab actif est contrôlé par la section active dans App.tsx
  const activeTab = initialTab;

  return (
    <div className="iam-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>IAM - Gestion des identités et accès</h1>
          <p className="page-description">
            Gérez les identités, les politiques d'accès et les groupes de ressources de votre compte OVHcloud.
          </p>
        </div>
        <a href="https://docs.ovh.com/fr/iam/" target="_blank" rel="noopener noreferrer" className="guides-link">
          Documentation IAM
        </a>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<iamService.IamUser[]>([]);
  const credentials = useCredentials();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    if (!credentials) { setError("Non authentifié"); setLoading(false); return; }
    try {
      const data = await iamService.getUsers(credentials);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      OK: { label: "Actif", className: "badge-success" },
      DISABLED: { label: "Désactivé", className: "badge-error" },
      PASSWORD_CHANGE_REQUIRED: { label: "MDP à changer", className: "badge-warning" },
    };
    return statusMap[status] || { label: status, className: "badge-neutral" };
  };

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des identités...</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadUsers} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;
  }

  return (
    <div className="tab-panel identities-tab">
      <div className="section-intro">
        <h2>Identités</h2>
        <p>Gérez les utilisateurs et les identités qui ont accès à votre compte OVHcloud.</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{users.length} identité(s)</span>
        <button className="btn btn-primary btn-sm">Ajouter une identité</button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <UserIcon />
          <h3>Aucune identité</h3>
          <p>Créez des utilisateurs pour leur donner accès à votre compte.</p>
          <button className="btn btn-primary">Ajouter une identité</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Email</th>
                <th>Groupe</th>
                <th>Statut</th>
                <th>Actions</th>
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
                      <button className="btn btn-outline btn-sm">Modifier</button>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<iamService.IamPolicy[]>([]);
  const credentials = useCredentials();

  useEffect(() => { loadPolicies(); }, []);

  const loadPolicies = async () => {
    if (!credentials) { setError("Non authentifié"); setLoading(false); return; }
    try {
      const data = await iamService.getPolicies(credentials);
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des politiques...</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadPolicies} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;
  }

  return (
    <div className="tab-panel policies-tab">
      <div className="section-intro">
        <h2>Politiques</h2>
        <p>Définissez les politiques d'accès pour contrôler les permissions sur vos ressources.</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{policies.length} politique(s)</span>
        <button className="btn btn-primary btn-sm">Créer une politique</button>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state">
          <ShieldIcon />
          <h3>Aucune politique</h3>
          <p>Créez des politiques pour définir les permissions d'accès.</p>
          <button className="btn btn-primary">Créer une politique</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Identités</th>
                <th>Ressources</th>
                <th>Date création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>
                    <strong>{policy.name}</strong>
                    {policy.readOnly && <span className="badge badge-neutral" style={{ marginLeft: "0.5rem" }}>Lecture seule</span>}
                  </td>
                  <td>{policy.description || "-"}</td>
                  <td>{policy.identities?.length || 0}</td>
                  <td>{policy.resources?.length || 0}</td>
                  <td>{formatDate(policy.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm">Modifier</button>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<iamService.IamResourceGroup[]>([]);
  const credentials = useCredentials();

  useEffect(() => { loadGroups(); }, []);

  const loadGroups = async () => {
    if (!credentials) { setError("Non authentifié"); setLoading(false); return; }
    try {
      const data = await iamService.getResourceGroups(credentials);
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des groupes...</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadGroups} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;
  }

  return (
    <div className="tab-panel groups-tab">
      <div className="section-intro">
        <h2>Groupes de ressources</h2>
        <p>Organisez vos ressources en groupes pour simplifier la gestion des accès.</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{groups.length} groupe(s)</span>
        <button className="btn btn-primary btn-sm">Créer un groupe</button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <FolderIcon />
          <h3>Aucun groupe</h3>
          <p>Créez des groupes pour organiser vos ressources.</p>
          <button className="btn btn-primary">Créer un groupe</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom du groupe</th>
                <th>Propriétaire</th>
                <th>Ressources</th>
                <th>Date création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>
                    <strong>{group.name}</strong>
                    {group.readOnly && <span className="badge badge-neutral" style={{ marginLeft: "0.5rem" }}>Lecture seule</span>}
                  </td>
                  <td>{group.owner}</td>
                  <td>{group.resources?.length || 0}</td>
                  <td>{formatDate(group.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm">Modifier</button>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<iamService.IamLog[]>([]);
  const [filter, setFilter] = useState<"all" | "allowed" | "denied">("all");
  const credentials = useCredentials();

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    if (!credentials) { setError("Non authentifié"); setLoading(false); return; }
    try {
      const data = await iamService.getLogs(credentials);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const filteredLogs = logs.filter(log => {
    if (filter === "all") return true;
    if (filter === "allowed") return log.allowed;
    if (filter === "denied") return !log.allowed;
    return true;
  });

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des logs...</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadLogs} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;
  }

  return (
    <div className="tab-panel logs-tab">
      <div className="section-intro">
        <h2>Logs d'accès</h2>
        <p>Consultez l'historique des actions effectuées sur votre compte.</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">Tous les logs</option>
            <option value="allowed">Autorisés</option>
            <option value="denied">Refusés</option>
          </select>
          <span className="result-count">{filteredLogs.length} entrée(s)</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadLogs}>Rafraîchir</button>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="empty-state">
          <LogIcon />
          <h3>Aucun log</h3>
          <p>Aucune action enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Identité</th>
                <th>Action</th>
                <th>Ressource</th>
                <th>Résultat</th>
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
                      {log.allowed ? "Autorisé" : "Refusé"}
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
