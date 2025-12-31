// ============================================================
// SERVICES TAB - Liste des services inclus dans le pack
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { servicesTabService } from "./ServicesTab.service";
import type { Service } from "./connections.types";
import "./ServicesTab.css";

interface ServicesTabProps {
  connectionId: string;
}

export function ServicesTab({ connectionId }: ServicesTabProps) {
  const { t } = useTranslation("web-cloud/access/connections/services");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await servicesTabService.getServices(connectionId);
        setServices(data);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  const getServiceIcon = (type: string): string => {
    switch (type) {
      case "domain": return "🌐";
      case "email": return "📧";
      case "voip": return "📞";
      case "hosting": return "🖥";
      default: return "📦";
    }
  };

  const getServiceLabel = (type: string): string => {
    return t(`types.${type}`);
  };

  if (loading) {
    return (
      <div className="services-tab">
        <div className="services-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-tab">
        <div className="services-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.type]) acc[service.type] = [];
    acc[service.type].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="services-tab">
      <div className="services-header">
        <h4>{t("title")}</h4>
        <span className="services-count">{services.length} {t("total")}</span>
      </div>

      {services.length === 0 ? (
        <div className="services-empty">
          <span className="empty-icon">📦</span>
          <p>{t("empty")}</p>
          <button className="btn-primary">{t("discover")}</button>
        </div>
      ) : (
        <div className="services-groups">
          {Object.entries(groupedServices).map(([type, items]) => (
            <div key={type} className="service-group">
              <div className="group-header">
                <span className="group-icon">{getServiceIcon(type)}</span>
                <span className="group-title">{getServiceLabel(type)}</span>
                <span className="group-count">{items.length}</span>
              </div>
              <div className="group-items">
                {items.map((service) => (
                  <div key={service.id} className="service-item">
                    <div className="service-info">
                      <span className="service-name">{service.name}</span>
                      <span className={`service-status ${service.status}`}>
                        ● {service.status}
                      </span>
                    </div>
                    <div className="service-actions">
                      <button className="btn-link">{t("manage")}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="services-footer">
        <p>{t("needMore")}</p>
        <button className="btn-secondary">{t("addService")}</button>
      </div>
    </div>
  );
}
