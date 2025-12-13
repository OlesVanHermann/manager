import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import type { BillingService, ServiceStatusFilter, ServiceStateFilter } from "../../types/services.types";
import * as servicesService from "../../services/services.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "ok":
      return { label: "Actif", className: "badge-success" };
    case "expired":
      return { label: "Expiré", className: "badge-error" };
    case "unPaid":
      return { label: "Impayé", className: "badge-warning" };
    case "pendingDebt":
      return { label: "Encours", className: "badge-warning" };
    default:
      return { label: status, className: "badge-neutral" };
  }
}

function getStateBadge(state: string): { label: string; className: string } {
  switch (state) {
    case "active":
      return { label: "Actif", className: "badge-success" };
    case "suspended":
      return { label: "Suspendu", className: "badge-error" };
    case "toRenew":
      return { label: "À renouveler", className: "badge-warning" };
    case "expired":
      return { label: "Expiré", className: "badge-error" };
    default:
      return { label: state, className: "badge-neutral" };
  }
}

interface ServicesPageProps {
  isActive?: boolean;
  initialTypeFilter?: string;
}

export function ServicesPage({ isActive, initialTypeFilter }: ServicesPageProps) {
  const [services, setServices] = useState<BillingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  
  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter || "all");
  const [statusFilter, setStatusFilter] = useState<ServiceStatusFilter>("all");
  const [stateFilter, setStateFilter] = useState<ServiceStateFilter>("all");
  
  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize] = useState(25);

  // Reset type filter when initialTypeFilter changes
  useEffect(() => {
    if (initialTypeFilter) {
      setTypeFilter(initialTypeFilter);
      setPage(0);
    }
  }, [initialTypeFilter]);

  useEffect(() => {
    if (isActive !== false) {
      loadServices();
    }
  }, [isActive, page, search, typeFilter, statusFilter, stateFilter]);

  const loadServices = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifié");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await servicesService.getBillingServices(credentials, {
        count: pageSize,
        offset: page * pageSize,
        search: search || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter,
        state: stateFilter,
        order: { field: "expiration", dir: "asc" },
      });

      setServices(result.list?.results || []);
      setTotalCount(result.count || 0);
      
      if (result.servicesTypes && result.servicesTypes.length > 0) {
        setServiceTypes(result.servicesTypes);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadServices();
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setStateFilter("all");
    setPage(0);
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Mes services</h1>
        <p className="services-count">{totalCount} service(s)</p>
      </div>

      {/* Filters */}
      <div className="services-filters">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Rechercher
          </button>
        </form>

        <div className="filter-group">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
            className="filter-select"
          >
            <option value="all">Tous les types</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as ServiceStatusFilter); setPage(0); }}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="ok">Actif</option>
            <option value="expired">Expiré</option>
            <option value="unPaid">Impayé</option>
            <option value="pendingDebt">Encours</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => { setStateFilter(e.target.value as ServiceStateFilter); setPage(0); }}
            className="filter-select"
          >
            <option value="all">Tous les états</option>
            <option value="active">Actif</option>
            <option value="toRenew">À renouveler</option>
            <option value="suspended">Suspendu</option>
            <option value="expired">Expiré</option>
          </select>

          {(typeFilter !== "all" || statusFilter !== "all" || stateFilter !== "all" || search) && (
            <button onClick={clearFilters} className="btn btn-secondary">
              Effacer filtres
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="services-error">
          <p>{error}</p>
          <button onClick={loadServices} className="btn btn-primary">Réessayer</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="services-loading">
          <div className="spinner"></div>
          <p>Chargement des services...</p>
        </div>
      )}

      {/* Services Table */}
      {!loading && !error && (
        <>
          {services.length === 0 ? (
            <div className="services-empty">
              <p>Aucun service trouvé</p>
            </div>
          ) : (
            <div className="services-table-wrapper">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>État</th>
                    <th>Expiration</th>
                    <th>Renouvellement</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => {
                    const status = getStatusBadge(service.status);
                    const state = getStateBadge(service.state);
                    
                    return (
                      <tr key={service.id}>
                        <td>
                          <div className="service-name">
                            <span className="name-primary">
                              {service.resource?.displayName || service.resource?.name || service.serviceId}
                            </span>
                            {service.resource?.product?.name && (
                              <span className="name-secondary">{service.resource.product.name}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="service-type">{service.serviceType}</span>
                        </td>
                        <td>
                          <span className={`badge ${status.className}`}>{status.label}</span>
                        </td>
                        <td>
                          <span className={`badge ${state.className}`}>{state.label}</span>
                        </td>
                        <td>
                          <span className={service.state === "toRenew" ? "text-warning" : ""}>
                            {formatDate(service.expiration)}
                          </span>
                        </td>
                        <td>
                          {service.renew?.automatic ? (
                            <span className="badge badge-info">Auto</span>
                          ) : (
                            <span className="badge badge-neutral">Manuel</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="services-pagination">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="btn btn-sm"
              >
                Précédent
              </button>
              <span className="pagination-info">
                Page {page + 1} sur {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="btn btn-sm"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ServicesPage;
