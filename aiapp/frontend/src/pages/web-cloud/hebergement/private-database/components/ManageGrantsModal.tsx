// ============================================================
// MANAGE GRANTS MODAL - Gérer les droits d'un utilisateur CloudDB
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PdbUser, PdbDatabase } from "../../../../../services/web-cloud.private-database";

interface Props {
  serviceName: string;
  user: PdbUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type GrantType = "admin" | "rw" | "ro" | "none";

interface GrantState {
  databaseName: string;
  currentGrant: GrantType;
  newGrant: GrantType;
}

/** Modal pour gérer les droits d'un utilisateur sur les bases CloudDB. */
export function ManageGrantsModal({ serviceName, user, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [databases, setDatabases] = useState<PdbDatabase[]>([]);
  const [grants, setGrants] = useState<GrantState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDatabases = useCallback(async () => {
    try {
      setLoading(true);
      const names = await privateDatabaseService.listDatabases(serviceName);
      const data = await Promise.all(names.map(n => privateDatabaseService.getDatabase(serviceName, n)));
      setDatabases(data);

      // Build grants state
      const grantsState: GrantState[] = data.map(db => {
        const existingGrant = user.databases?.find(d => d.databaseName === db.databaseName);
        const currentGrant = existingGrant?.grantType || "none";
        return {
          databaseName: db.databaseName,
          currentGrant,
          newGrant: currentGrant,
        };
      });
      setGrants(grantsState);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName, user]);

  useEffect(() => {
    if (isOpen) {
      loadDatabases();
    }
  }, [isOpen, loadDatabases]);

  const handleGrantChange = (databaseName: string, newGrant: GrantType) => {
    setGrants(prev => prev.map(g => 
      g.databaseName === databaseName ? { ...g, newGrant } : g
    ));
  };

  const handleSave = async () => {
    const changedGrants = grants.filter(g => g.currentGrant !== g.newGrant);
    if (changedGrants.length === 0) {
      onClose();
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      for (const grant of changedGrants) {
        await privateDatabaseService.setUserGrant(
          serviceName, 
          user.userName, 
          grant.databaseName, 
          grant.newGrant
        );
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const getGrantLabel = (grant: GrantType) => {
    const labels: Record<GrantType, string> = {
      admin: "Admin (tous les droits)",
      rw: "Lecture/Écriture",
      ro: "Lecture seule",
      none: "Aucun droit",
    };
    return labels[grant];
  };

  const hasChanges = grants.some(g => g.currentGrant !== g.newGrant);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("modals.manageGrants")}: {user.userName}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
            <span className="info-icon">ℹ</span>
            <div>
              <p><strong>Types de droits:</strong></p>
              <ul style={{ margin: 'var(--space-2) 0 0 var(--space-4)', padding: 0 }}>
                <li><strong>Admin:</strong> Tous les droits (CREATE, DROP, ALTER, etc.)</li>
                <li><strong>Lecture/Écriture:</strong> SELECT, INSERT, UPDATE, DELETE</li>
                <li><strong>Lecture seule:</strong> SELECT uniquement</li>
                <li><strong>Aucun:</strong> Pas d'accès à cette base</li>
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="tab-loading"><div className="skeleton-block" style={{ height: '150px' }} /></div>
          ) : databases.length === 0 ? (
            <div className="empty-state">
              <p>Aucune base de données disponible</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Base de données</th>
                  <th>Droits actuels</th>
                  <th>Nouveaux droits</th>
                </tr>
              </thead>
              <tbody>
                {grants.map(grant => (
                  <tr key={grant.databaseName} className={grant.currentGrant !== grant.newGrant ? 'row-changed' : ''}>
                    <td className="font-mono">{grant.databaseName}</td>
                    <td>
                      <span className={`grant-badge ${grant.currentGrant}`}>
                        {getGrantLabel(grant.currentGrant)}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={grant.newGrant}
                        onChange={(e) => handleGrantChange(grant.databaseName, e.target.value as GrantType)}
                      >
                        <option value="none">Aucun droit</option>
                        <option value="ro">Lecture seule</option>
                        <option value="rw">Lecture/Écriture</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saving ? "Enregistrement..." : hasChanges ? "Enregistrer les modifications" : "Aucune modification"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageGrantsModal;
