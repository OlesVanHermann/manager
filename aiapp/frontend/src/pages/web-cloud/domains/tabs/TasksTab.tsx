// ============================================================
// TAB: TASKS - Tâches fusionnées (domaine + zone)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DomainTask } from "../../../../services/web-cloud.domains";
import { dnsZonesService, DnsZoneTask } from "../../../../services/web-cloud.dns-zones";

interface Props {
  name: string;
  hasDomain: boolean;
  hasZone: boolean;
}

interface UnifiedTask {
  id: string;
  source: "domain" | "zone";
  function: string;
  status: string;
  createdAt: string;
  doneAt: string | null;
}

/** Onglet tâches fusionnées domaine + zone. */
export function TasksTab({ name, hasDomain, hasZone }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [tasks, setTasks] = useState<UnifiedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const allTasks: UnifiedTask[] = [];

        if (hasDomain) {
          const domainTaskIds = await domainsService.listTasks(name).catch(() => [] as number[]);
          const domainTasks = await Promise.all(
            domainTaskIds.slice(0, 10).map((id) => domainsService.getTask(name, id))
          );
          domainTasks.forEach((task: DomainTask) => {
            allTasks.push({
              id: `domain-${task.id}`,
              source: "domain",
              function: task.function,
              status: task.status,
              createdAt: task.creationDate,
              doneAt: task.lastUpdate,
            });
          });
        }

        if (hasZone) {
          const zoneTaskIds = await dnsZonesService.listTasks(name).catch(() => [] as number[]);
          const zoneTasks = await Promise.all(
            zoneTaskIds.slice(0, 10).map((id) => dnsZonesService.getTask(name, id))
          );
          zoneTasks.forEach((task: DnsZoneTask) => {
            allTasks.push({
              id: `zone-${task.id}`,
              source: "zone",
              function: task.function,
              status: task.status,
              createdAt: task.createdAt,
              doneAt: task.doneAt,
            });
          });
        }

        allTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTasks(allTasks);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name, hasDomain, hasZone]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "done": return "success";
      case "doing": case "init": case "todo": return "info";
      case "error": return "error";
      case "cancelled": return "warning";
      default: return "";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <div>
          <h3>{t("tasks.title")}</h3>
          <p className="tab-description">{t("tasks.description")}</p>
        </div>
        <span className="section-count">{tasks.length} {t("tasks.count")}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>{t("tasks.empty")}</h3>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("tasks.source")}</th>
              <th>{t("tasks.function")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.created")}</th>
              <th>{t("tasks.done")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td><span className={`badge ${task.source === "domain" ? "info" : "success"}`}>{task.source === "domain" ? "🌐 Domaine" : "📋 Zone"}</span></td>
                <td>{task.function}</td>
                <td><span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span></td>
                <td>{formatDate(task.createdAt)}</td>
                <td>{task.doneAt ? formatDate(task.doneAt) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
