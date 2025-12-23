// ============================================================
// HOSTING TAB: MULTISITE - Domaines attachés (Design OVH)
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { AddDomainModal } from "../components";
import { EditPathModal } from "../components/EditPathModal";

interface Props {
  serviceName: string;
}

const PAGE_SIZE = 10;

export function MultisiteTab({ serviceName }: Props) {
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPathDomain, setEditPathDomain] = useState<AttachedDomain | null>(null);

  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listAttachedDomains(serviceName);
      const data = await Promise.all(names.map(n => hostingService.getAttachedDomain(serviceName, n)));
      setDomains(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadDomains(); }, [loadDomains]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDomains();
    setRefreshing(false);
  };

  const handleDelete = async (domain: string) => {
    if (!confirm(`Supprimer le domaine ${domain} ?`)) return;
    try {
      await hostingService.deleteAttachedDomain(serviceName, domain);
      loadDomains();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleToggle = async (domain: AttachedDomain, field: string, value: boolean) => {
    try {
      const payload: Record<string, unknown> = {};
      if (field === "cdn" || field === "firewall") {
        payload[field] = value ? "active" : "none";
      } else if (field === "ownLog") {
        payload.ownLog = value ? domain.domain : null;
      } else if (field === "ssl") {
        payload.ssl = value;
      } else {
        payload[field] = value;
      }
      await hostingService.updateAttachedDomain(serviceName, domain.domain, payload);
      loadDomains();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleRegenerateSsl = async () => {
    try {
      await hostingService.regenerateSsl(serviceName);
      alert("Régénération SSL lancée");
      loadDomains();
    } catch (err) {
      alert(String(err));
    }
  };

  const filteredDomains = useMemo(() => {
    if (!searchTerm) return domains;
    const term = searchTerm.toLowerCase();
    return domains.filter(d => d.domain.toLowerCase().includes(term));
  }, [domains, searchTerm]);

  const totalPages = Math.ceil(filteredDomains.length / PAGE_SIZE);
  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDomains.slice(start, start + PAGE_SIZE);
  }, [filteredDomains, currentPage]);

  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredDomains.length);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const getSslType = (d: AttachedDomain): string => d.ssl ? "Let's Encrypt" : "—";
  const isStatusOn = (d: AttachedDomain): boolean => d.status === "created" || d.status === "ok" || !d.status;

  if (loading) return <div className="multisite-loading">Chargement des domaines...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="multisite-tab">
      <div className="multisite-toolbar">
        <button className="btn-refresh" onClick={handleRefresh} disabled={refreshing} title="Actualiser">
          {refreshing ? "⏳" : "↻"}
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un domaine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-add" onClick={() => setShowAddModal(true)}>+ Ajouter</button>
        <span className="domain-count">{domains.length} domaine(s)</span>
      </div>

      {paginatedDomains.length === 0 ? (
        <div className="multisite-empty">
          <p>{searchTerm ? "Aucun domaine trouvé" : "Aucun domaine attaché"}</p>
          {!searchTerm && <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>Ajouter un domaine</button>}
        </div>
      ) : (
        <>
          <div className="multisite-table-wrapper">
            <table className="multisite-table">
              <thead>
                <tr>
                  <th>DOMAINE</th>
                  <th>DOSSIER</th>
                  <th>STATUT</th>
                  <th>SSL</th>
                  <th>CDN</th>
                  <th>FIREWALL</th>
                  <th>LOGS</th>
                  <th>GIT</th>
                  <th>IPV6</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDomains.map(domain => {
                  const statusOn = isStatusOn(domain);
                  return (
                    <tr key={domain.domain}>
                      <td>
                        <div className="cell-domain">
                          <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer" className="domain-name">{domain.domain}</a>
                          <button className="btn-delete" onClick={() => handleDelete(domain.domain)} title="Supprimer">×</button>
                        </div>
                      </td>
                      <td>
                        <div className="cell-path">
                          <span className="path-value">{domain.path || "./www"}</span>
                          <button className="btn-edit" onClick={() => setEditPathDomain(domain)} title="Modifier">✎</button>
                        </div>
                      </td>
                      <td><div className="cell-toggle"><ToggleSwitch checked={statusOn} onChange={() => {}} disabled={true} /></div></td>
                      <td>
                        {statusOn ? (
                          <div className="cell-ssl">
                            <span className="ssl-type">{getSslType(domain)}</span>
                            {domain.ssl ? (
                              <div className="ssl-actions">
                                <button className="btn-ssl" onClick={handleRegenerateSsl} title="Régénérer">↺</button>
                                <button className="btn-ssl" onClick={() => handleToggle(domain, "ssl", false)} title="Désactiver">⇄</button>
                              </div>
                            ) : (
                              <button className="btn-ssl" onClick={() => handleToggle(domain, "ssl", true)} title="Activer SSL">+</button>
                            )}
                          </div>
                        ) : <div className="cell-empty">—</div>}
                      </td>
                      <td>{statusOn ? <div className="cell-toggle"><ToggleSwitch checked={domain.cdn === "active"} onChange={(v) => handleToggle(domain, "cdn", v)} /></div> : <div className="cell-empty">—</div>}</td>
                      <td>{statusOn ? <div className="cell-toggle"><ToggleSwitch checked={domain.firewall === "active"} onChange={(v) => handleToggle(domain, "firewall", v)} /></div> : <div className="cell-empty">—</div>}</td>
                      <td>{statusOn ? <div className="cell-toggle"><ToggleSwitch checked={!!domain.ownLog} onChange={(v) => handleToggle(domain, "ownLog", v)} /></div> : <div className="cell-empty">—</div>}</td>
                      <td>{statusOn ? <div className="cell-toggle"><ToggleSwitch checked={!!domain.git} onChange={() => {}} disabled={true} /></div> : <div className="cell-empty">—</div>}</td>
                      <td>{statusOn ? <div className="cell-toggle"><ToggleSwitch checked={!!(domain as any).ipv6} onChange={(v) => handleToggle(domain, "ipv6", v)} /></div> : <div className="cell-empty">—</div>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="multisite-pagination">
              <span className="pagination-info">Affichage {startIndex}-{endIndex} sur {filteredDomains.length}</span>
              <div className="pagination-buttons">
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} className={`page-btn ${page === currentPage ? "active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="multisite-info">
        <h4>Multisite</h4>
        <p>Gérez les domaines attachés à votre hébergement. Chaque domaine peut avoir son propre dossier racine, certificat SSL et configuration CDN.</p>
      </div>

      <AddDomainModal serviceName={serviceName} isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={loadDomains} />
      {editPathDomain && <EditPathModal serviceName={serviceName} domain={editPathDomain} isOpen={!!editPathDomain} onClose={() => setEditPathDomain(null)} onSuccess={loadDomains} />}
    </div>
  );
}

export default MultisiteTab;
