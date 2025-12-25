// ============================================================
// LOGS TAB - Wrapper vers la nouvelle page Logs complète
// Redirige vers /iam/logs avec les 3 sous-onglets
// ============================================================

import { useAuth } from "../../../contexts/AuthContext";
import LogsPage from "../logs";

// ============ COMPOSANT ============

/** Tab Logs qui intègre la page complète avec les 3 sous-onglets. */
export default function LogsTab() {
  const { credentials } = useAuth();

  if (!credentials) {
    return (
      <div className="tab-panel">
        <div className="error-banner">Vous devez être connecté.</div>
      </div>
    );
  }

  return <LogsPage />;
}
