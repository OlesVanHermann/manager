// ============================================================
// TAB - Tasks (Tâches en cours et historique)
// Utilise les vraies APIs: mxplan, exchange, emailpro
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { mxplan, exchange, emailpro, services } from "../api";
import type { EmailServiceType } from "../api";

interface TasksTabProps {
  domain?: string;
}

interface Task {
  id: string;
  taskId: number;
  type: string;
  description: string;
  status: "pending" | "running" | "done" | "error";
  serviceType: EmailServiceType;
  serviceId: string;
  account?: string;
  createdAt?: string;
  completedAt?: string;
}

/** Onglet Tâches - Suivi des opérations en cours. */
export default function TasksTab({ domain }: TasksTabProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");

  // Chargement des tâches depuis toutes les sources
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allTasks: Task[] = [];

      // Récupérer tous les services email
      const allServices = await services.getAllEmailServices();

      // Filtrer par domaine si spécifié
      const relevantServices = domain
        ? allServices.filter((svc) => svc.domain === domain)
        : allServices;

      // Pour chaque service, récupérer les tâches
      for (const svc of relevantServices) {
        try {
          let serviceTasks: Array<{
            id: number;
            function: string;
            status: string;
            todoDate?: string;
            doneDate?: string;
            finishDate?: string;
            account?: string;
          }> = [];

          switch (svc.type) {
            case "mxplan":
              // MX Plan legacy ou hosted
              if (svc.id.startsWith("mxplan-")) {
                // MX Plan hosted - pas d'API task directe, skip
              } else {
                // MX Plan legacy - /email/domain/{domain}/task
                serviceTasks = await mxplan.tasks.list(svc.id);
              }
              break;

            case "exchange":
              // Exchange - /email/exchange/{org}/service/{service}/task
              if (svc.organization) {
                serviceTasks = await exchange.tasks.list(svc.domain, `${svc.organization}/${svc.id}`);
              }
              break;

            case "emailpro":
              // Email Pro - /email/pro/{service}/task
              serviceTasks = await emailpro.tasks.list(svc.domain, svc.id);
              break;

            default:
              // Zimbra et autres - pas d'API task standard
              break;
          }

          // Transformer en format unifié
          for (const task of serviceTasks) {
            allTasks.push({
              id: `${svc.type}-${svc.id}-${task.id}`,
              taskId: task.id,
              type: task.function,
              description: getTaskDescription(task.function, task.account),
              status: mapTaskStatus(task.status),
              serviceType: svc.type,
              serviceId: svc.id,
              account: task.account,
              createdAt: task.todoDate,
              completedAt: task.doneDate || task.finishDate,
            });
          }
        } catch (err) {
          console.warn(`Failed to load tasks for service ${svc.id}:`, err);
        }
      }

      // Si aucun service trouvé et domain fourni, essayer MX Plan legacy directement
      if (relevantServices.length === 0 && domain) {
        try {
          const legacyTasks = await mxplan.tasks.list(domain);
          for (const task of legacyTasks) {
            allTasks.push({
              id: `mxplan-${domain}-${task.id}`,
              taskId: task.id,
              type: task.function,
              description: getTaskDescription(task.function, task.account),
              status: mapTaskStatus(task.status),
              serviceType: "mxplan",
              serviceId: domain,
              account: task.account,
              createdAt: task.todoDate,
              completedAt: task.doneDate,
            });
          }
        } catch {
          // Ignore - domain might not have MX Plan
        }
      }

      // Trier par date de création (plus récent en premier)
      allTasks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setTasks(allTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Filtrage des tâches
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus === "active") {
        return t.status === "pending" || t.status === "running";
      }
      if (filterStatus === "completed") {
        return t.status === "done" || t.status === "error";
      }
      return true;
    });
  }, [tasks, filterStatus]);

  const activeTasks = useMemo(
    () => tasks.filter((t) => t.status === "pending" || t.status === "running"),
    [tasks]
  );

  // Helpers
  const mapTaskStatus = (status: string): Task["status"] => {
    switch (status) {
      case "todo":
        return "pending";
      case "doing":
        return "running";
      case "done":
        return "done";
      case "error":
        return "error";
      default:
        return "pending";
    }
  };

  const getTaskDescription = (func: string, account?: string): string => {
    const descriptions: Record<string, string> = {
      addAccount: t("tasks.functions.addAccount", "Création de compte"),
      delAccount: t("tasks.functions.delAccount", "Suppression de compte"),
      changePassword: t("tasks.functions.changePassword", "Changement de mot de passe"),
      addAlias: t("tasks.functions.addAlias", "Ajout d'alias"),
      delAlias: t("tasks.functions.delAlias", "Suppression d'alias"),
      addRedirection: t("tasks.functions.addRedirection", "Ajout de redirection"),
      delRedirection: t("tasks.functions.delRedirection", "Suppression de redirection"),
      addMailingList: t("tasks.functions.addMailingList", "Création de liste"),
      delMailingList: t("tasks.functions.delMailingList", "Suppression de liste"),
      addResponder: t("tasks.functions.addResponder", "Activation répondeur"),
      delResponder: t("tasks.functions.delResponder", "Désactivation répondeur"),
      setQuota: t("tasks.functions.setQuota", "Modification du quota"),
      setAdmin: t("tasks.functions.setAdmin", "Modification des droits"),
      exportArchive: t("tasks.functions.exportArchive", "Export d'archive"),
      updateMfa: t("tasks.functions.updateMfa", "Mise à jour MFA"),
    };

    let desc = descriptions[func] || func;
    if (account) {
      desc += ` (${account})`;
    }
    return desc;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: "⏳",
      running: "🔄",
      done: "✓",
      error: "✗",
    };
    return icons[status] || "?";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return t("tasks.status.pending", "En attente");
      case "running":
        return t("tasks.status.running", "En cours");
      case "done":
        return t("tasks.status.done", "Terminé");
      case "error":
        return t("tasks.status.error", "Erreur");
      default:
        return status;
    }
  };

  const getServiceLabel = (type: EmailServiceType) => {
    switch (type) {
      case "exchange":
        return "Exchange";
      case "emailpro":
        return "Email Pro";
      case "mxplan":
        return "MX Plan";
      case "zimbra":
        return "Zimbra";
      default:
        return type;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="tasks-tab">
        <div className="emails-loading">
          <div className="loading-spinner" />
          <p>{t("loading", "Chargement des tâches...")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="tasks-tab">
        <div className="emails-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadTasks}>
            {t("retry", "Réessayer")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      {/* Summary */}
      {activeTasks.length > 0 && (
        <div className="tasks-summary">
          <span className="tasks-summary-icon">🔄</span>
          <span className="tasks-summary-text">
            {activeTasks.length} {t("tasks.activeTasks", "tâche(s) en cours")}
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <div className="filter-chips">
            <button
              className={`filter-chip ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              {t("tasks.filters.all", "Tout")}
            </button>
            <button
              className={`filter-chip ${filterStatus === "active" ? "active" : ""}`}
              onClick={() => setFilterStatus("active")}
            >
              {t("tasks.filters.active", "En cours")}
            </button>
            <button
              className={`filter-chip ${filterStatus === "completed" ? "active" : ""}`}
              onClick={() => setFilterStatus("completed")}
            >
              {t("tasks.filters.completed", "Terminées")}
            </button>
          </div>
        </div>
        <div className="emails-toolbar-right">
          <button className="btn btn-outline" onClick={loadTasks}>
            ↻ {t("refresh", "Actualiser")}
          </button>
        </div>
      </div>

      {/* Tasks list */}
      {filteredTasks.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📋</div>
          <h3 className="emails-empty-title">{t("tasks.empty.title", "Aucune tâche")}</h3>
          <p className="emails-empty-text">
            {t("tasks.empty.description", "Aucune tâche en cours ou récente.")}
          </p>
        </div>
      ) : (
        <>
          <div className="tasks-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <div className="task-info">
                    <span className={`task-status-icon ${task.status}`}>
                      {getStatusIcon(task.status)}
                    </span>
                    <span className="task-description">{task.description}</span>
                  </div>
                  <div className="task-badges">
                    <span className="service-badge">{getServiceLabel(task.serviceType)}</span>
                    <span
                      className={`status-badge ${
                        task.status === "error"
                          ? "suspended"
                          : task.status === "done"
                          ? "ok"
                          : "pending"
                      }`}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>

                <div className="task-footer">
                  <span className="task-date">
                    {t("tasks.fields.created", "Créée")}: {formatDate(task.createdAt)}
                    {task.completedAt && (
                      <>
                        {" "}
                        · {t("tasks.fields.completed", "Terminée")}: {formatDate(task.completedAt)}
                      </>
                    )}
                  </span>
                  <span className="task-id">#{task.taskId}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer count */}
          <div className="table-footer">
            <span className="table-count">
              {filteredTasks.length} {t("tasks.results", "tâche(s)")}
              {filteredTasks.length !== tasks.length &&
                ` / ${tasks.length} ${t("tasks.total", "total")}`}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
