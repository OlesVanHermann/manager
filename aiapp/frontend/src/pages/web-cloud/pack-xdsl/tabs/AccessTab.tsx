import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as packXdslService from "../../../../services/web-cloud.pack-xdsl";

interface XdslAccess {
  accessName: string;
  accessType: string;
  status: string;
  address: { city: string; street: string; zipCode: string; };
  connectionStatus: string;
  ipv4?: string;
  ipv6?: string;
}

interface AccessTabProps { serviceId: string; }

export default function AccessTab({ serviceId }: AccessTabProps) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const { t: tCommon } = useTranslation("common");
  const [accesses, setAccesses] = useState<XdslAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadAccesses(); }, [serviceId]);

  const loadAccesses = async () => {
    try { setLoading(true); setError(null); const data = await packXdslService.getAccesses(serviceId); setAccesses(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getConnectionStatus = (status: string) => {
    const dotClass = status === "connected" ? "connected" : status === "syncing" ? "syncing" : "disconnected";
    return <div className="connection-status"><span className={`status-dot ${dotClass}`}></span><span>{t(`access.connectionStatus.${status}`)}</span></div>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadAccesses}>{tCommon("actions.retry")}</button></div>;
  if (accesses.length === 0) return <div className="empty-state"><h2>{t("access.empty.title")}</h2></div>;

  return (
    <div className="access-tab">
      <div className="tab-toolbar"><h2>{t("access.title")}</h2></div>
      {accesses.map((access) => (
        <div key={access.accessName} className="info-card" style={{ marginBottom: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <div><h3 style={{ margin: 0 }}>{access.accessName}</h3><span style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>{access.accessType}</span></div>
            {getConnectionStatus(access.connectionStatus)}
          </div>
          <div className="info-grid" style={{ marginBottom: 0 }}>
            <div><div className="card-title">{t("access.fields.address")}</div><div className="card-value" style={{ fontSize: "var(--font-size-md)" }}>{access.address.street}, {access.address.zipCode} {access.address.city}</div></div>
            <div><div className="card-title">{t("access.fields.ipv4")}</div><div className="card-value mono">{access.ipv4 || "-"}</div></div>
            <div><div className="card-title">{t("access.fields.ipv6")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{access.ipv6 || "-"}</div></div>
          </div>
          <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
            <button className="btn btn-sm btn-outline">{t("access.actions.diagnostic")}</button>
            <button className="btn btn-sm btn-outline">{t("access.actions.restart")}</button>
            <button className="btn btn-sm btn-outline">{t("access.actions.statistics")}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
