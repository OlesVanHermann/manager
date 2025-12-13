import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as iamService from "../../services/iam.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

const tabs = [
  { id: "identities", label: "Identites" },
  { id: "policies", label: "Politiques" },
  { id: "groups", label: "Groupes" },
  { id: "logs", label: "Logs" },
];

export default function IamPage() {
  const [activeTab, setActiveTab] = useState("identities");

  return (
    <div className="iam-page">
      <div className="page-header">
        <h1>Identite, Securite & Operations</h1>
        <p className="page-description">Gerez les identites, les politiques d'acces et les groupes de votre compte OVHcloud.</p>
      </div>

      <div className="page-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content iam-content">
        {activeTab === "identities" && <IdentitiesTab />}
        {activeTab === "policies" && <PoliciesTab />}
        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "logs" && <LogsTab />}
      </div>
    </div>
  );
}

function useCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function IdentitiesTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<iamService.IamUser[]>([]);
  const credentials = useCredentials();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

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
      DISABLED: { label: "Desactive", className: "badge-error" },
      PASSWORD_CHANGE_REQUIRED: { label: "MDP a changer", className: "badge-warning" },
    };
    return statusMap[status] || { label: status, className: "badge-neutral" };
  };

  if (loading) {
    return <div className="identities-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  if (error) {
    return <div className="identities-tab"><div className="error-banner"><span>{error}</span><button onClick={loadUsers}>Reessayer</button></div></div>;
  }

  return (
    <div className="identities-tab">
      <div className="info-box">
        <p>Gerez les utilisateurs et les identites qui ont acces a votre compte OVHcloud.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Identifiant</th>
            <th>Email</th>
            <th>Groupe</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={4} className="empty-cell">Aucune identite</td></tr>
          ) : (
            users.map((user) => {
              const status = getStatusBadge(user.status);
              return (
                <tr key={user.login}>
                  <td><strong>{user.login}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.group || "-"}</td>
                  <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function PoliciesTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<iamService.IamPolicy[]>([]);
  const credentials = useCredentials();

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

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
    return <div className="policies-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  if (error) {
    return <div className="policies-tab"><div className="error-banner"><span>{error}</span><button onClick={loadPolicies}>Reessayer</button></div></div>;
  }

  return (
    <div className="policies-tab">
      <div className="info-box">
        <p>Definissez les politiques d'acces pour controler les permissions sur vos ressources.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Identites</th>
            <th>Ressources</th>
            <th>Date creation</th>
          </tr>
        </thead>
        <tbody>
          {policies.length === 0 ? (
            <tr><td colSpan={5} className="empty-cell">Aucune politique</td></tr>
          ) : (
            policies.map((policy) => (
              <tr key={policy.id}>
                <td><strong>{policy.name}</strong>{policy.readOnly && <span className="badge badge-neutral ml-2">Lecture seule</span>}</td>
                <td>{policy.description || "-"}</td>
                <td>{policy.identities?.length || 0}</td>
                <td>{policy.resources?.length || 0}</td>
                <td>{formatDate(policy.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function GroupsTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<iamService.IamResourceGroup[]>([]);
  const credentials = useCredentials();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

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
    return <div className="groups-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  if (error) {
    return <div className="groups-tab"><div className="error-banner"><span>{error}</span><button onClick={loadGroups}>Reessayer</button></div></div>;
  }

  return (
    <div className="groups-tab">
      <div className="info-box">
        <p>Organisez vos ressources en groupes pour simplifier la gestion des acces.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom du groupe</th>
            <th>Proprietaire</th>
            <th>Ressources</th>
            <th>Date creation</th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr><td colSpan={4} className="empty-cell">Aucun groupe</td></tr>
          ) : (
            groups.map((group) => (
              <tr key={group.id}>
                <td><strong>{group.name}</strong>{group.readOnly && <span className="badge badge-neutral ml-2">Lecture seule</span>}</td>
                <td>{group.owner}</td>
                <td>{group.resources?.length || 0}</td>
                <td>{formatDate(group.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function LogsTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<iamService.IamLog[]>([]);
  const credentials = useCredentials();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

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

  if (loading) {
    return <div className="logs-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  if (error) {
    return <div className="logs-tab"><div className="error-banner"><span>{error}</span><button onClick={loadLogs}>Reessayer</button></div></div>;
  }

  return (
    <div className="logs-tab">
      <div className="info-box">
        <p>Consultez l'historique des actions effectuees sur votre compte.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Identite</th>
            <th>Action</th>
            <th>Ressource</th>
            <th>Resultat</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr><td colSpan={5} className="empty-cell">Aucun log</td></tr>
          ) : (
            logs.map((log, idx) => (
              <tr key={idx}>
                <td>{formatDate(log.createdAt)}</td>
                <td className="urn-cell">{log.identityUrn}</td>
                <td>{log.action}</td>
                <td className="urn-cell">{log.resourceUrn}</td>
                <td>
                  <span className={`badge ${log.allowed ? "badge-success" : "badge-error"}`}>
                    {log.allowed ? "Autorise" : "Refuse"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
