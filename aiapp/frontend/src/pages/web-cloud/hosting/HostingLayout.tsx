// ============================================================
// HOSTING LAYOUT - Layout stable avec Nav2 + Sidebar + Outlet
// La sidebar ne re-render JAMAIS quand on change de service
// ============================================================

import { Outlet } from "react-router-dom";
import { HostingSidebar } from "./HostingSidebar";
import "./styles.css";

export function HostingLayout() {
  return (
    <div className="hosting-layout">
      {/* NAV2 - Composant partagé */}

      {/* SPLIT LAYOUT */}
      <div className="hosting-split">
        {/* LEFT: Sidebar (STABLE - jamais re-render sur sélection) */}
        <HostingSidebar />
        
        {/* RIGHT: Outlet (change selon la route) */}
        <div className="hosting-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default HostingLayout;
