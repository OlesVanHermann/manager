// ============================================================
// LOAD BALANCER Farms Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .lb-farms-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IpLoadBalancingFarm, IpLoadBalancingServer } from "../../load-balancer.types";
import { lbFarmsService } from "./FarmsTab.service";
import "./FarmsTab.css";

interface FarmsTabProps {
  serviceName: string;
}

export function FarmsTab({ serviceName }: FarmsTabProps) {
  const { t } = useTranslation("network/load-balancer/farms");
  const [farms, setFarms] = useState<(IpLoadBalancingFarm & { servers?: IpLoadBalancingServer[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFarm, setExpandedFarm] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await lbFarmsService.getAllFarms(serviceName);
        setFarms(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const loadServers = async (farmId: number) => {
    if (expandedFarm === farmId) {
      setExpandedFarm(null);
      return;
    }
    setExpandedFarm(farmId);
    try {
      const servers = await lbFarmsService.getServersForFarm(serviceName, farmId);
      setFarms((prev) =>
        prev.map((f) => (f.farmId === farmId ? { ...f, servers } : f))
      );
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="lb-farms-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="lb-farms-tab">
      <div className="lb-farms-header">
        <h3>{t("title")}</h3>
        <span className="lb-farms-count">{farms.length}</span>
      </div>

      {farms.length === 0 ? (
        <div className="lb-farms-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="lb-farms-list">
          {farms.map((farm) => (
            <div
              key={farm.farmId}
              className={`lb-farms-card ${expandedFarm === farm.farmId ? "lb-farms-expanded" : ""}`}
            >
              <div
                className="lb-farms-card-header"
                onClick={() => loadServers(farm.farmId)}
              >
                <div className="lb-farms-card-info">
                  <h4>{farm.displayName || `Farm #${farm.farmId}`}</h4>
                  <div className="lb-farms-card-meta">
                    <span className="lb-farms-badge lb-farms-badge-info">{farm.zone}</span>
                    <span className="lb-farms-badge lb-farms-badge-secondary">{farm.balance}</span>
                    {farm.port && <span>:{farm.port}</span>}
                  </div>
                </div>
                <svg
                  className="lb-farms-chevron"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>

              {expandedFarm === farm.farmId && farm.servers && (
                <div className="lb-farms-servers">
                  {farm.servers.length === 0 ? (
                    <p className="lb-farms-no-servers">{t("noServers")}</p>
                  ) : (
                    <table className="lb-farms-servers-table">
                      <thead>
                        <tr>
                          <th>{t("address")}</th>
                          <th>{t("port")}</th>
                          <th>{t("weight")}</th>
                          <th>{t("status")}</th>
                          <th>{t("ssl")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farm.servers.map((s) => (
                          <tr key={s.serverId}>
                            <td className="lb-farms-server-address">{s.address}</td>
                            <td>{s.port || "-"}</td>
                            <td>{s.weight || "-"}</td>
                            <td>
                              <span
                                className={`lb-farms-server-status ${s.status === "active" ? "lb-farms-status-success" : "lb-farms-status-inactive"}`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td>{s.ssl ? "✓" : "✗"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FarmsTab;
