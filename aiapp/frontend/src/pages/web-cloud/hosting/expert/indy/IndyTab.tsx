// ============================================================
// INDY TAB - Multi-domaines indépendants
// NAV3: Expert > NAV4: Indy
// Features: table with search, state badges, domain tags
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { indyService, type Indy } from "./IndyTab.service";
import type { Hosting } from "../../hosting.types";
import "./IndyTab.css";

interface IndyTabProps {
  serviceName: string;
  details: Hosting;
  onRefresh?: () => void;
  onNavigateToDomain?: (domain: string) => void;
}

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_DOMAINS = 3;

export function IndyTab({
  serviceName,
  details,
  onRefresh,
  onNavigateToDomain,
}: IndyTabProps) {
  const { t } = useTranslation("web-cloud/hosting/index");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indys, setIndys] = useState<Indy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Load Indys
  const loadIndys = useCallback(
    async (searchFilter?: string) => {
      try {
        setLoading(true);
        setError(null);

        const params = searchFilter ? { login: `%${searchFilter}%` } : undefined;
        const data = await indyService.getAllIndysWithDetails(serviceName, params);
        setIndys(data);
        setCurrentPage(1);
      } catch (err) {
        setError("Erreur lors du chargement des multi-domaines indépendants");
        console.error("[IndyTab] Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [serviceName]
  );

  useEffect(() => {
    loadIndys();
  }, [loadIndys]);

  // Handle search
  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    loadIndys(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearch("");
    loadIndys();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Pagination
  const totalPages = Math.ceil(indys.length / ITEMS_PER_PAGE);
  const paginatedIndys = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return indys.slice(start, start + ITEMS_PER_PAGE);
  }, [indys, currentPage]);

  // Handle domain click
  const handleDomainClick = (domain: string) => {
    if (onNavigateToDomain) {
      onNavigateToDomain(domain);
    }
  };

  // Render state badge
  const renderStateBadge = (state: "rw" | "off") => {
    if (state === "rw") {
      return (
        <span className="indytab-state active">
          <span className="indytab-state-dot" />
          Actif (rw)
        </span>
      );
    }
    return (
      <span className="indytab-state disabled">
        <span className="indytab-state-dot" />
        Désactivé
      </span>
    );
  };

  // Render domains
  const renderDomains = (domains: string[]) => {
    if (!domains || domains.length === 0) {
      return <span style={{ color: "#9CA3AF", fontSize: 12 }}>Aucun domaine</span>;
    }

    const visibleDomains = domains.slice(0, MAX_VISIBLE_DOMAINS);
    const remainingCount = domains.length - MAX_VISIBLE_DOMAINS;

    return (
      <div className="indytab-domains">
        {visibleDomains.map((domain) => (
          <button
            key={domain}
            className="indytab-domain-tag"
            onClick={() => handleDomainClick(domain)}
            title={`Voir ${domain} dans Multisite`}
          >
            {domain}
          </button>
        ))}
        {remainingCount > 0 && (
          <span className="indytab-domain-more">+{remainingCount}</span>
        )}
      </div>
    );
  };

  // Loading state
  if (loading && indys.length === 0) {
    return (
      <div className="indytab">
        <div className="indytab-skeleton">
          <div className="indytab-skeleton-header">
            <div className="indytab-skeleton-title" />
            <div className="indytab-skeleton-search" />
          </div>
          <div className="indytab-skeleton-table" />
        </div>
      </div>
    );
  }

  // Empty state (no indys at all)
  if (!loading && indys.length === 0 && !appliedSearch) {
    return (
      <div className="indytab">
        <div className="indytab-empty">
          <div className="indytab-empty-icon">📦</div>
          <h3>Aucun multi-domaine indépendant</h3>
          <p>
            Cet hébergement ne dispose pas de multi-domaines indépendants configurés.
            Les multi-domaines indépendants (Indy) permettent de gérer plusieurs sites
            avec des accès FTP séparés.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="indytab">
      {/* Header with search */}
      <div className="indytab-header">
        <h3 className="indytab-title">
          Multi-domaines indépendants
          <span className="indytab-count">{indys.length}</span>
        </h3>

        <div className="indytab-search">
          <input
            type="text"
            className="indytab-search-input"
            placeholder="Rechercher par login..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="indytab-btn-search" onClick={handleSearch}>
            Rechercher
          </button>
          {appliedSearch && (
            <button className="indytab-btn-clear" onClick={handleClearSearch}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="indytab-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Empty search results */}
      {!loading && indys.length === 0 && appliedSearch && (
        <div className="indytab-empty">
          <div className="indytab-empty-icon">🔍</div>
          <h3>Aucun résultat</h3>
          <p>
            Aucun multi-domaine indépendant ne correspond à la recherche "{appliedSearch}".
          </p>
        </div>
      )}

      {/* Table */}
      {indys.length > 0 && (
        <div className="indytab-table-container">
          <table className="indytab-table">
            <thead>
              <tr>
                <th>Login</th>
                <th>Répertoire racine</th>
                <th>État</th>
                <th>Domaines attachés</th>
                <th style={{ width: 60 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIndys.map((indy) => (
                <tr key={indy.login}>
                  <td>
                    <span className="indytab-login">{indy.login}</span>
                  </td>
                  <td>
                    <span className="indytab-home">{indy.home}</span>
                  </td>
                  <td>{renderStateBadge(indy.state)}</td>
                  <td>{renderDomains(indy.attachedDomains)}</td>
                  <td>
                    <div className="indytab-actions">
                      <button
                        className="indytab-btn-refresh"
                        onClick={() => loadIndys(appliedSearch)}
                        title="Rafraîchir"
                      >
                        ↻
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="indytab-pagination">
              <div className="indytab-pagination-info">
                Affichage {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, indys.length)} sur {indys.length}
              </div>
              <div className="indytab-pagination-controls">
                <button
                  className="indytab-pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Précédent
                </button>
                <span className="indytab-pagination-current">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  className="indytab-pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IndyTab;
