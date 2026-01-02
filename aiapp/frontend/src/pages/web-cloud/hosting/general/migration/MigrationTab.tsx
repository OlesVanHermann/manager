// ============================================================
// MIGRATION TAB - Migration de domaine .ovh.org
// NAV3: Offre > NAV4: Migration
// Migrate .ovh.org subdomain to another hosting service
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { migrationService, type HostingInfo } from "./MigrationTab.service";
import type { Hosting } from "../../hosting.types";
import "./MigrationTab.css";

interface MigrationTabProps {
  serviceName: string;
  details: Hosting;
  onRefresh?: () => void;
}

export function MigrationTab({ serviceName, details, onRefresh }: MigrationTabProps) {
  const { t } = useTranslation("web-cloud/hosting/index");

  const [loading, setLoading] = useState(true);
  const [hostings, setHostings] = useState<HostingInfo[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load available hostings
  const loadHostings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const names = await migrationService.listHostings();
      // Filter out current service and load details
      const otherHostings = names.filter((name) => name !== serviceName);

      const hostingDetails = await Promise.all(
        otherHostings.slice(0, 20).map(async (name) => {
          try {
            return await migrationService.getHosting(name);
          } catch {
            return { serviceName: name, state: "unknown" } as HostingInfo;
          }
        })
      );

      setHostings(hostingDetails.filter((h) => h.state === "active"));
    } catch (err) {
      setError("Erreur lors du chargement des hébergements disponibles");
      console.error("[MigrationTab] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadHostings();
  }, [loadHostings]);

  // Handle migration
  const handleMigrate = async () => {
    if (!selectedDestination) return;

    try {
      setMigrating(true);
      setError(null);
      await migrationService.migrateOvhOrg(serviceName, selectedDestination);
      setSuccess(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Erreur lors de la migration. Veuillez réessayer.");
      console.error("[MigrationTab] Migration error:", err);
    } finally {
      setMigrating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="migrationtab">
        <div className="migrationtab-skeleton">
          <div className="migrationtab-skeleton-block" />
          <div className="migrationtab-skeleton-block" />
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="migrationtab">
        <div className="migrationtab-success">
          <div className="migrationtab-success-icon">✓</div>
          <h3>Migration initiée</h3>
          <p>
            La migration de votre domaine <strong>{serviceName}.ovh.org</strong> vers{" "}
            <strong>{selectedDestination}</strong> a été lancée.
          </p>
          <p className="migrationtab-success-note">
            Cette opération peut prendre quelques minutes.
          </p>
          <button
            className="migrationtab-btn-back"
            onClick={() => {
              setSuccess(false);
              setSelectedDestination("");
            }}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // No other hostings available
  if (hostings.length === 0) {
    return (
      <div className="migrationtab">
        <div className="migrationtab-empty">
          <div className="migrationtab-empty-icon">📦</div>
          <h3>Aucun hébergement de destination</h3>
          <p>
            Vous n'avez pas d'autre hébergement actif vers lequel migrer votre domaine .ovh.org.
          </p>
          <p className="migrationtab-empty-note">
            Commandez un nouvel hébergement pour pouvoir effectuer une migration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="migrationtab">
      {/* Header */}
      <div className="migrationtab-header">
        <h3>Migration du domaine .ovh.org</h3>
        <p>
          Migrez votre sous-domaine <strong>{serviceName}.ovh.org</strong> vers un autre
          hébergement de votre compte.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="migrationtab-warning">
        <div className="migrationtab-warning-icon">⚠️</div>
        <div className="migrationtab-warning-content">
          <strong>Attention</strong>
          <p>
            Cette action déplacera votre domaine .ovh.org vers l'hébergement sélectionné.
            Les fichiers et configurations associés seront migrés.
          </p>
        </div>
      </div>

      {/* Current Service */}
      <div className="migrationtab-current">
        <div className="migrationtab-current-label">Hébergement source</div>
        <div className="migrationtab-current-value">
          <span className="migrationtab-current-name">{serviceName}</span>
          <span className="migrationtab-current-offer">{details.offer || "Standard"}</span>
        </div>
      </div>

      {/* Arrow */}
      <div className="migrationtab-arrow">
        <span>↓</span>
      </div>

      {/* Destination Selection */}
      <div className="migrationtab-destination">
        <label className="migrationtab-destination-label">
          Hébergement de destination
        </label>
        <select
          className="migrationtab-select"
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
        >
          <option value="">-- Sélectionner un hébergement --</option>
          {hostings.map((hosting) => (
            <option key={hosting.serviceName} value={hosting.serviceName}>
              {hosting.displayName || hosting.serviceName}
              {hosting.offer && ` (${hosting.offer})`}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Destination Info */}
      {selectedDestination && (
        <div className="migrationtab-selected-info">
          <div className="migrationtab-selected-icon">📍</div>
          <div>
            <strong>Destination sélectionnée</strong>
            <p>{selectedDestination}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="migrationtab-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Actions */}
      <div className="migrationtab-actions">
        <button
          className="migrationtab-btn-migrate"
          onClick={handleMigrate}
          disabled={!selectedDestination || migrating}
        >
          {migrating ? "Migration en cours..." : "Lancer la migration"}
        </button>
      </div>
    </div>
  );
}

export default MigrationTab;
