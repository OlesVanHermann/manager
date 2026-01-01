// ============================================================
// VOIP TAB - Container avec NAV4 (Lignes / EcoFax)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { voipService } from "./VoipTab.service";
import type { VoipLine, EcoFax, VoipStats, FaxHistoryItem } from "../connections.types";
import { VoipLines } from "./VoipLines";
import { VoipEcoFax } from "./VoipEcoFax";
import "./VoipTab.css";

interface VoipTabProps {
  connectionId: string;
}

type SubTabId = "lines" | "ecofax";

interface EcoFaxConfig {
  email: string;
  format: "pdf" | "tiff" | "pdf_tiff";
  quality: "standard" | "high" | "ultra";
}

export function VoipTab({ connectionId }: VoipTabProps) {
  const { t } = useTranslation("web-cloud/access/connections/voip");

  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("lines");

  // Core data
  const [lines, setLines] = useState<VoipLine[]>([]);
  const [ecoFax, setEcoFax] = useState<EcoFax | null>(null);
  const [stats, setStats] = useState<VoipStats | null>(null);
  const [faxHistory, setFaxHistory] = useState<FaxHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Loading states for sub-tabs
  const [linesLoading, setLinesLoading] = useState(false);
  const [ecofaxLoading, setEcofaxLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // Load basic data
        const [linesData, faxData] = await Promise.all([
          voipService.getVoipLines(connectionId),
          voipService.getEcoFax(connectionId),
        ]);
        setLines(linesData);
        setEcoFax(faxData);

        // Try to load stats
        try {
          const statsData = await voipService.getVoipStats(connectionId);
          setStats(statsData);
        } catch {
          // Stats optional
          setStats({ incomingCalls: 0, outgoingCalls: 0, totalDuration: 0, faxSent: 0, faxReceived: 0 });
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  // Load fax history when switching to ecofax tab
  useEffect(() => {
    if (activeSubTab === "ecofax" && faxHistory.length === 0 && ecoFax?.enabled) {
      setEcofaxLoading(true);
      voipService.getFaxHistory(connectionId)
        .then(setFaxHistory)
        .catch(() => setFaxHistory([]))
        .finally(() => setEcofaxLoading(false));
    }
  }, [activeSubTab, connectionId, faxHistory.length, ecoFax?.enabled]);

  const subTabs: { id: SubTabId; labelKey: string }[] = [
    { id: "lines", labelKey: "tabs.lines" },
    { id: "ecofax", labelKey: "tabs.ecofax" },
  ];

  // Handlers - Lines
  const handleAddLine = useCallback(() => {
    // TODO: Open order tunnel
  }, []);

  const handleConfigureLine = useCallback((line: VoipLine) => {
    // TODO: Open modal
  }, []);

  const handleViewHistory = useCallback((line: VoipLine) => {
    // TODO: Navigate to history
  }, []);

  const handleViewDetails = useCallback(() => {
    // TODO: Navigate to stats page
  }, []);

  // Handlers - EcoFax
  const handleSaveConfig = useCallback(async (config: EcoFaxConfig) => {
    // TODO: API call to save config
    setEcoFax(prev => prev ? { ...prev, ...config } : null);
  }, []);

  const handleSendFax = useCallback(async (number: string, file: File) => {
    // TODO: API call to send fax
  }, []);

  const handleDownloadFax = useCallback((faxId: string) => {
    // TODO: Download fax file
  }, []);

  const handleResendFax = useCallback(async (faxId: string) => {
    // TODO: API call to resend fax
  }, []);

  const handleEnableEcoFax = useCallback(() => {
    // TODO: Open modal or tunnel
  }, []);

  if (loading) {
    return (
      <div className="voip-tab">
        <div className="voip-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="voip-tab">
        <div className="voip-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voip-tab">
      {/* NAV4 */}
      <div className="voip-nav4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`voip-nav4-btn ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="voip-content">
        {activeSubTab === "lines" && (
          <VoipLines
            connectionId={connectionId}
            lines={lines}
            stats={stats}
            loading={linesLoading}
            onAddLine={handleAddLine}
            onConfigureLine={handleConfigureLine}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeSubTab === "ecofax" && (
          <VoipEcoFax
            connectionId={connectionId}
            ecoFax={ecoFax}
            history={faxHistory}
            loading={ecofaxLoading}
            onSaveConfig={handleSaveConfig}
            onSendFax={handleSendFax}
            onDownloadFax={handleDownloadFax}
            onResendFax={handleResendFax}
            onEnable={handleEnableEcoFax}
          />
        )}
      </div>
    </div>
  );
}
