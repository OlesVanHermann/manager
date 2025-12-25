// ============================================================
// SERVICES TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingServicesService from "./ServicesTab.service";
import { formatDate } from "./ServicesTab.helpers";
import { ServerIcon } from "./ServicesTab.icons";
import type { TabProps } from "../../billing.types";
import "./ServicesTab.css";

export function ServicesTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "expiring" | "autorenew">("all");

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingServicesService.getBillingServices(credentials);
      const data = Array.isArray(response) ? response : (response?.data || []);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
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

  if (loading) {
    return (
      <div className="services-tab-panel">
        <div className="services-loading-state">
          <div className="services-spinner"></div>
          <p>{t('services.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-tab-panel">
        <div className="services-error-banner">
          {error}
          <button onClick={loadServices} className="services-btn services-btn-sm services-btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon('actions.refresh')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-tab-panel">
      <div className="services-toolbar">
        <div className="services-toolbar-left">
          <select className="services-period-select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">{t('services.filters.all')}</option>
            <option value="expiring">{t('services.filters.expiringSoon')}</option>
            <option value="autorenew">{t('services.filters.autoRenew')}</option>
          </select>
          <span className="services-result-count">{t('services.count', { count: filteredServices.length })}</span>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="services-empty-state">
          <ServerIcon />
          <h3>{t('services.empty.title')}</h3>
          <p>{t('services.empty.description')}</p>
        </div>
      ) : (
        <div className="services-table-container">
          <table className="services-data-table">
            <thead>
              <tr>
                <th>{t('columns.service')}</th>
                <th>{t('columns.type')}</th>
                <th>{t('services.expiration')}</th>
                <th>{t('services.renewal')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((s: any) => (
                <tr key={s.serviceId}>
                  <td className="services-service-name">{s.resource?.displayName || s.resource?.name || s.serviceId}</td>
                  <td>{s.resource?.product?.name || s.route?.path || "-"}</td>
                  <td>{s.expiration ? formatDate(s.expiration) : "-"}</td>
                  <td>
                    {s.renew?.automatic ? (
                      <span className="services-status-badge services-badge-success">{t('services.renewal.auto')}</span>
                    ) : (
                      <span className="services-status-badge services-badge-warning">{t('services.renewal.manual')}</span>
                    )}
                  </td>
                  <td className="services-actions-cell">
                    <button className="services-btn services-btn-outline services-btn-sm">{t('actions.manage')}</button>
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
