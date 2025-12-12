import { useState } from "react";
import { navigationTree, assistanceTree, icons, NavNode } from "./navigationTree";
import "./styles.css";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (node: NavNode) => void;
  activeNodeId?: string;
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const path = icons[name as keyof typeof icons];
  if (!path) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Sidebar({ isOpen, onToggle, onNavigate, activeNodeId }: SidebarProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleNodeClick = (node: NavNode) => {
    if (node.children && node.children.length > 0) {
      setExpandedId(expandedId === node.id ? null : node.id);
    } else if (node.url) {
      onNavigate(node);
    }
  };

  const handleChildClick = (child: NavNode, e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate(child);
  };

  const sidebarClass = isOpen ? "ovh-sidebar expanded" : "ovh-sidebar collapsed";

  return (
    <aside className={sidebarClass}>
      <div className="sidebar-logo">
        <a href="#/" className="logo-link">
          {isOpen ? (
            <svg viewBox="0 0 120 40" className="logo-full">
              <text x="10" y="28" fill="var(--color-primary-500)" fontSize="24" fontWeight="bold">OVHcloud</text>
            </svg>
          ) : (
            <svg viewBox="0 0 40 40" className="logo-short">
              <text x="5" y="28" fill="var(--color-primary-500)" fontSize="24" fontWeight="bold">O</text>
            </svg>
          )}
        </a>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {isOpen && <h2 className="nav-title">Mes services</h2>}
        </div>

        <ul className="nav-list">
          {navigationTree.map((node) => {
            const itemClass = node.separator ? "nav-item has-separator" : "nav-item";
            const linkActive = expandedId === node.id ? "active" : "";
            const linkSelected = activeNodeId === node.id ? "selected" : "";
            const linkClass = "nav-link " + linkActive + " " + linkSelected;
            
            return (
              <li key={node.id} className={itemClass}>
                <button
                  className={linkClass}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => !isOpen && setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  title={!isOpen ? node.label : undefined}
                >
                  <Icon name={node.icon || "cog"} className="nav-icon" />
                  {isOpen && (
                    <>
                      <span className="nav-label">{node.label}</span>
                      {node.children && (
                        <Icon 
                          name={expandedId === node.id ? "chevronDown" : "chevronRight"} 
                          className="nav-chevron" 
                        />
                      )}
                    </>
                  )}
                </button>

                {isOpen && expandedId === node.id && node.children && (
                  <ul className="nav-submenu">
                    {node.children.map((child) => {
                      const subClass = activeNodeId === child.id ? "nav-sublink selected" : "nav-sublink";
                      return (
                        <li key={child.id}>
                          <a
                            href={child.url}
                            className={subClass}
                            onClick={(e) => handleChildClick(child, e)}
                          >
                            {child.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {!isOpen && hoveredId === node.id && node.children && (
                  <div className="nav-popover">
                    <div className="popover-header">{node.label}</div>
                    <ul className="popover-list">
                      {node.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={child.url}
                            className="popover-link"
                            onClick={(e) => handleChildClick(child, e)}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-action">
        <a href="#/catalog" className={isOpen ? "add-service-btn" : "add-service-btn icon-only"}>
          <Icon name="cart" className="btn-icon" />
          {isOpen && <span>Commander</span>}
        </a>
      </div>

      <div className="sidebar-assistance">
        {isOpen && <h3 className="assistance-title">Assistance</h3>}
        <ul className="assistance-list">
          {assistanceTree.map((node) => (
            <li key={node.id}>
              <a
                href={node.url}
                className="assistance-link"
                target={node.external ? "_blank" : undefined}
                rel={node.external ? "noopener noreferrer" : undefined}
                title={!isOpen ? node.label : undefined}
              >
                <Icon name={node.icon || "help"} className="assistance-icon" />
                {isOpen && <span>{node.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen && <span className="toggle-text">Reduire</span>}
        <Icon name={isOpen ? "chevronLeft" : "chevronRight"} className="toggle-icon" />
      </button>
    </aside>
  );
}
