// ============================================================
// SUB-TAB - Resources (Ressources partagées: salles, équipements)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ResourcesTabProps {
  domain?: string;
}

interface Resource {
  id: string;
  name: string;
  email: string;
  type: "room" | "equipment";
  capacity?: number;
  location?: string;
  owner: string;
  bookable: boolean;
  createdAt: string;
}

/** Sous-onglet Ressources - Gestion des salles et équipements. */
export default function ResourcesTab({ domain }: ResourcesTabProps) {
  const { t } = useTranslation("web-cloud/emails/advanced");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "room" | "equipment">("all");

  // Mock data - remplacer par appel API
  const resources: Resource[] = useMemo(() => [
    {
      id: "1",
      name: "Salle de réunion A",
      email: "salle-a@example.com",
      type: "room",
      capacity: 10,
      location: "Étage 2",
      owner: "admin@example.com",
      bookable: true,
      createdAt: "2023-01-15T00:00:00Z",
    },
    {
      id: "2",
      name: "Salle de conférence",
      email: "conference@example.com",
      type: "room",
      capacity: 50,
      location: "RDC",
      owner: "admin@example.com",
      bookable: true,
      createdAt: "2023-01-15T00:00:00Z",
    },
    {
      id: "3",
      name: "Vidéoprojecteur portable",
      email: "videoproj@example.com",
      type: "equipment",
      owner: "it@example.com",
      bookable: true,
      createdAt: "2023-06-01T00:00:00Z",
    },
    {
      id: "4",
      name: "Voiture de service",
      email: "voiture@example.com",
      type: "equipment",
      owner: "admin@example.com",
      bookable: true,
      createdAt: "2023-03-20T00:00:00Z",
    },
  ], []);

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterType !== "all" && r.type !== filterType) {
        return false;
      }
      return true;
    });
  }, [resources, search, filterType]);

  const handleCreate = () => {
  };

  const handleEdit = (resource: Resource) => {
  };

  const handleDelete = (resource: Resource) => {
  };

  const handleViewCalendar = (resource: Resource) => {
  };

  return (
    <div className="resources-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("resources.actions.create")}
          </button>
        </div>
        <div className="emails-toolbar-right">
          <input
            type="text"
            className="filter-input"
            placeholder={t("resources.filters.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-chips">
            <button
              className={`filter-chip ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              {t("resources.filters.all")}
            </button>
            <button
              className={`filter-chip ${filterType === "room" ? "active" : ""}`}
              onClick={() => setFilterType("room")}
            >
              🏢 {t("resources.filters.rooms")}
            </button>
            <button
              className={`filter-chip ${filterType === "equipment" ? "active" : ""}`}
              onClick={() => setFilterType("equipment")}
            >
              🔧 {t("resources.filters.equipment")}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredResources.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">🏢</div>
          <h3 className="emails-empty-title">{t("resources.empty.title")}</h3>
          <p className="emails-empty-text">{t("resources.empty.description")}</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("resources.actions.create")}
          </button>
        </div>
      ) : (
        <table className="emails-table">
          <thead>
            <tr>
              <th>{t("resources.table.name")}</th>
              <th>{t("resources.table.type")}</th>
              <th>{t("resources.table.details")}</th>
              <th>{t("resources.table.owner")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource.id}>
                <td>
                  <div className="email-cell">
                    <span className="email-primary">{resource.name}</span>
                    <span className="email-secondary">{resource.email}</span>
                  </div>
                </td>
                <td>
                  <span className={`type-badge ${resource.type}`}>
                    {resource.type === "room" ? "🏢 Salle" : "🔧 Équipement"}
                  </span>
                </td>
                <td>
                  {resource.type === "room" ? (
                    <span className="resource-details">
                      {resource.capacity && `${resource.capacity} pers.`}
                      {resource.location && ` · ${resource.location}`}
                    </span>
                  ) : (
                    <span className="resource-details">-</span>
                  )}
                </td>
                <td>
                  <span className="owner-email">{resource.owner}</span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn"
                      title={t("resources.actions.calendar")}
                      onClick={() => handleViewCalendar(resource)}
                    >
                      📅
                    </button>
                    <button
                      className="action-btn"
                      title={t("resources.actions.edit")}
                      onClick={() => handleEdit(resource)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn danger"
                      title={t("resources.actions.delete")}
                      onClick={() => handleDelete(resource)}
                    >
                      🗑
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
