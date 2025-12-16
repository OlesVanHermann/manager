// ============================================================
// LAYOUT - Structure principale avec Header et Sidebar
// ============================================================

import { Outlet } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./styles.css";

export default function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
