// ============================================================
// PRIVATE DATABASE TAB: WHITELIST - IPs autorisées
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PdbWhitelist } from "../../../../../services/web-cloud.private-database";
import { AddWhitelistModal } from "../components/AddWhitelistModal";

interface Props { serviceName: string; }

/** Onglet Whitelist (IPs autorisées) CloudDB. */
export function WhitelistTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [entries, setEntries] = useState<PdbWhitelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const ips = await privateDatabaseService.listWhitelist(serviceName);
      const data = await Promise.all(ips.map(ip => privateDatabaseService.getWhitelistEntry(serviceName, ip)));
      setEntries(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const handleDelete = async (ip: string) => {
    if (!confirm(t("whitelist.confirmDelete", { ip }))) return;
    try {
      await privateDatabaseService.deleteWhitelistEntry(serviceName, ip);
      loadEntries();
    } catch (err) { alert(String(err)); }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="pdb-whitelist-tab">
      <div className="tab-header">
        <div>
          <h3>{t("whitelist.title")}</h3>
          <p className="tab-description">{t("whitelist.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{entries.length} {t("whitelist.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            + {t("whitelist.add")}
          </button>
        </div>
      </div>

      {/* Info aide */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <div>
          <p>{t("whitelist.info")}</p>
          <p style={{ marginTop: 'var(--space-2)' }}>
            <strong>Votre IP actuelle:</strong>{' '}
            <code id="current-ip">Chargement...</code>
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>{t("whitelist.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            {t("whitelist.addFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("whitelist.ip")}</th>
              <th>{t("whitelist.name")}</th>
              <th>{t("whitelist.options")}</th>
              <th>{t("whitelist.status")}</th>
              <th>{t("whitelist.creationDate")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.ip}>
                <td className="font-mono">{entry.ip}</td>
                <td>{entry.name || '-'}</td>
                <td>
                  <div className="whitelist-options">
                    {entry.service && <span className="badge success">Service</span>}
                    {entry.sftp && <span className="badge info">SFTP</span>}
                    {!entry.service && !entry.sftp && <span className="text-muted">-</span>}
                  </div>
                </td>
                <td>
                  <span className={`badge ${entry.status === 'ok' ? 'success' : 'warning'}`}>
                    {entry.status === 'ok' ? 'Actif' : entry.status || 'En attente'}
                  </span>
                </td>
                <td>{entry.creationDate ? new Date(entry.creationDate).toLocaleDateString() : '-'}</td>
                <td>
                  <button 
                    className="btn-icon btn-danger-icon" 
                    onClick={() => handleDelete(entry.ip)}
                    title={t("whitelist.delete")}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AddWhitelistModal
        serviceName={serviceName}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadEntries}
      />
    </div>
  );
}

export default WhitelistTab;
