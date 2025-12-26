// ============================================================
// VRACK SERVICES Subnets Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .vrackservices-subnets-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { VrackServicesSubnet } from "../../vrack-services.types";
import { vrackservicesSubnetsService } from "./SubnetsTab.service";
import "./SubnetsTab.css";

interface SubnetsTabProps {
  serviceId: string;
}

export default function SubnetsTab({ serviceId }: SubnetsTabProps) {
  const { t } = useTranslation("network/vrack-services/subnets");
  const { t: tCommon } = useTranslation("common");
  const [subnets, setSubnets] = useState<VrackServicesSubnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubnets();
  }, [serviceId]);

  const loadSubnets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vrackservicesSubnetsService.getSubnets(serviceId);
      setSubnets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subnetId: string) => {
    try {
      await vrackservicesSubnetsService.deleteSubnet(serviceId, subnetId);
      loadSubnets();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  if (loading) {
    return <div className="vrackservices-subnets-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="vrackservices-subnets-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadSubnets}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="vrackservices-subnets-tab">
      <div className="vrackservices-subnets-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      {subnets.length === 0 ? (
        <div className="vrackservices-subnets-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="vrackservices-subnets-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.cidr")}</th>
              <th>{t("columns.vlan")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {subnets.map((subnet) => (
              <tr key={subnet.id}>
                <td>
                  <span className="vrackservices-subnets-name">
                    {subnet.displayName || subnet.id}
                  </span>
                </td>
                <td>
                  <span className="vrackservices-subnets-cidr">{subnet.cidr}</span>
                </td>
                <td>
                  <span className="vrackservices-subnets-vlan">{subnet.vlan ?? "-"}</span>
                </td>
                <td>
                  <div className="vrackservices-subnets-actions">
                    <button className="btn btn-sm btn-outline">
                      {tCommon("actions.edit")}
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-danger"
                      onClick={() => handleDelete(subnet.id)}
                    >
                      {tCommon("actions.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
