// ============================================================
// NAV1 - Header Principal (Bleu OVH)
// ============================================================

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import "./styles.css";

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", label: "Accueil" },
  { path: "/public-cloud", label: "Public Cloud" },
  { path: "/private-cloud", label: "Hosted Private Cloud" },
  { path: "/bare-metal", label: "Bare Metal Cloud" },
  { path: "/web-cloud", label: "Web Cloud" },
  { path: "/network", label: "Network" },
  { path: "/iam", label: "IAM / Securite" },
  { path: "/license", label: "Licences" },
];

export default function Header() {
  const { t } = useTranslation("common");
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const userNic = user?.nichandle || "xx00000-ovh";

  return (
    <header className="app-header">
      <div className="header-brand">
        <Link to="/" className="brand-link">
          <svg className="brand-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#000E9C"/>
            <path d="M50 20C33.4 20 20 33.4 20 50C20 66.6 33.4 80 50 80C66.6 80 80 66.6 80 50C80 33.4 66.6 20 50 20ZM50 70C38.95 70 30 61.05 30 50C30 38.95 38.95 30 50 30C61.05 30 70 38.95 70 50C70 61.05 61.05 70 50 70Z" fill="white"/>
            <circle cx="50" cy="50" r="12" fill="white"/>
          </svg>
        </Link>
      </div>

      <nav className="header-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
          >
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <button className="action-btn" title={t("actions.help")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </button>
        <button className="action-btn" title={t("actions.notifications")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>
        <div className="user-menu">
          <div className="user-badge">
            <span className="user-status">OK</span>
            <span className="user-nic">{userNic}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
