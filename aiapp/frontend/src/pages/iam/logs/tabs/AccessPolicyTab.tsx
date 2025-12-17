// ============================================================
// ACCESS POLICY TAB - Logs des politiques d'accès
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.logs";
import { LiveTail } from "../components/LiveTail";
import { DataStreams } from "../components/DataStreams";

// ============ COMPOSANT ============

export function AccessPolicyTab() {
  const { t } = useTranslation("iam/logs");
  const [kinds, setKinds] = useState<string[]>([]);
  const [selectedKind, setSelectedKind] = useState("default");
  const [view, setView] = useState<"live-tail" | "data-streams">("live-tail");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKinds();
  }, []);

  const loadKinds = async () => {
    try {
      const data = await logsService.getLogKinds("access-policy");
      setKinds(data);
      if (data.length > 0 && !data.includes(selectedKind)) {
        setSelectedKind(data[0]);
      }
    } catch (err) {
      console.error("Error loading log kinds:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-panel">
        <div className="loading-state"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="tab-panel logs-tab-content">
      {kinds.length > 1 && (
        <div className="kind-selector">
          <label>{t("kindSelector.label")}</label>
          <select value={selectedKind} onChange={(e) => setSelectedKind(e.target.value)} className="kind-select">
            {kinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
          </select>
        </div>
      )}
      {view === "live-tail" ? (
        <LiveTail logType="access-policy" kind={selectedKind} description={t("accessPolicy.description")} onGoToDataStreams={() => setView("data-streams")} />
      ) : (
        <DataStreams logType="access-policy" kind={selectedKind} onGoBack={() => setView("live-tail")} />
      )}
    </div>
  );
}
