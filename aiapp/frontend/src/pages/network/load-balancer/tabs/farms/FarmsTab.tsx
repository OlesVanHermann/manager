// ============================================================
// LOAD BALANCER Farms Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IpLoadBalancingFarm, IpLoadBalancingServer } from "../../load-balancer.types";
import { farmsService } from "./FarmsTab.service";
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
        const data = await farmsService.getAllFarms(serviceName);
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
      const servers = await farmsService.getServersForFarm(serviceName, farmId);
      setFarms((prev) =>
        prev.map((f) => (f.farmId === farmId ? { ...f, servers } : f))
      );
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="farms-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="farms-tab">
      <div className="farms-header">
        <h3>{t("title")}</h3>
        <span className="farms-count">{farms.length}</span>
      </div>

      {farms.length === 0 ? (
        <div className="farms-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="farms-list">
          {farms.map((farm) => (
            <div
              key={farm.farmId}
              className={`farms-card ${expandedFarm === farm.farmId ? "expanded" : ""}`}
            >
              <div
                className="farms-card-header"
                onClick={() => loadServers(farm.farmId)}
              >
                <div className="farms-card-info">
                  <h4>{farm.displayName || `Farm #${farm.farmId}`}</h4>
                  <div className="farms-card-meta">
                    <span className="farms-badge info">{farm.zone}</span>
                    <span className="farms-badge secondary">{farm.balance}</span>
                    {farm.port && <span>:{farm.port}</span>}
                  </div>
                </div>
                <svg
                  className="farms-chevron"
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
                <div className="farms-servers">
                  {farm.servers.length === 0 ? (
                    <p className="farms-no-servers">{t("noServers")}</p>
                  ) : (
                    <table className="farms-servers-table">
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
                            <td className="farms-server-address">{s.address}</td>
                            <td>{s.port || "-"}</td>
                            <td>{s.weight || "-"}</td>
                            <td>
                              <span
                                className={`farms-server-status ${s.status === "active" ? "success" : "inactive"}`}
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
