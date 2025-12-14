import { useState, useEffect } from "react";
import * as servicesService from "../../../../services/services.service";
import { TabProps, formatDate } from "../utils";
import { ServerIcon } from "../icons";

export function ServicesTab({ credentials }: TabProps) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "expiring" | "autorenew">("all");

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesService.getBillingServices(credentials);
      const data = Array.isArray(response) ? response : (response?.data || []);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => {
    if (filter === "all") return true;
    if (filter === "expiring") {
      const exp = new Date(s.expiration);
      const now = new Date();
      const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 30 && diff > 0;
    }
    if (filter === "autorenew") return s.renew?.automatic === true;
    return true;
  });

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des services...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadServices} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;

  return (
    <div className="tab-panel">
      <div className="toolbar">
        <div className="toolbar-left">
          <select className="period-select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">Tous les services</option>
            <option value="expiring">Expire bientôt</option>
            <option value="autorenew">Renouvellement auto</option>
          </select>
          <span className="result-count">{filteredServices.length} service(s)</span>
        </div>
      </div>
      {filteredServices.length === 0 ? (
        <div className="empty-state"><ServerIcon /><h3>Aucun service</h3><p>Vous n'avez pas de service correspondant aux critères.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Service</th><th>Type</th><th>Expiration</th><th>Renouvellement</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredServices.map((s: any) => (
                <tr key={s.serviceId}>
                  <td className="service-name">{s.resource?.displayName || s.resource?.name || s.serviceId}</td>
                  <td>{s.resource?.product?.name || s.route?.path || "-"}</td>
                  <td>{s.expiration ? formatDate(s.expiration) : "-"}</td>
                  <td>
                    {s.renew?.automatic ? (
                      <span className="status-badge badge-success">Auto</span>
                    ) : (
                      <span className="status-badge badge-warning">Manuel</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm">Gérer</button>
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
