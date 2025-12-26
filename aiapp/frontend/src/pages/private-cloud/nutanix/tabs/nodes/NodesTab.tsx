// ============================================================
// NODES TAB - Composant isolé pour Nutanix
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { NutanixNode } from "../../nutanix.types";
import { nodesService, getNodeStatusBadgeClass } from "./NodesTab.service";
import "./NodesTab.css";

// ========================================
// TYPES LOCAUX
// ========================================

interface NodesTabProps {
  serviceId: string;
}

// ========================================
// COMPOSANT
// ========================================

export default function NodesTab({ serviceId }: NodesTabProps) {
  const { t } = useTranslation("private-cloud/nutanix/nodes");
  const { t: tCommon } = useTranslation("common");

  const [nodes, setNodes] = useState<NutanixNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNodes();
  }, [serviceId]);

  const loadNodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nodesService.getNodes(serviceId);
      setNodes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="nodes-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="nodes-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadNodes}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="nodes-tab">
      <div className="nodes-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadNodes}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {nodes.length === 0 ? (
        <div className="nodes-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="nodes-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.ahvIp")}</th>
              <th>{t("columns.cvmIp")}</th>
              <th>{t("columns.server")}</th>
              <th>{t("columns.status")}</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.nodeId}>
                <td>
                  <div>{node.name}</div>
                  <div className="nodes-id">{node.nodeId}</div>
                </td>
                <td className="nodes-ip">{node.ahvIp || "-"}</td>
                <td className="nodes-ip">{node.cvmIp || "-"}</td>
                <td className="nodes-server-info">
                  {node.server ? `${node.server.brand} ${node.server.model}` : "-"}
                </td>
                <td>
                  <span className={`status-badge ${getNodeStatusBadgeClass(node.status)}`}>
                    {node.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
