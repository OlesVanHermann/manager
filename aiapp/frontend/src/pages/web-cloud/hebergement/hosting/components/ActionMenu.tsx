// ============================================================
// COMPONENT: ActionMenu - Dropdown d'actions
// ============================================================

import { useState, useRef, useEffect } from "react";

interface ActionItem {
  label: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

interface Props {
  actions: ActionItem[];
  disabled?: boolean;
}

export function ActionMenu({ actions, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (actions.length === 0) return null;

  const getItemClass = (action: ActionItem) => {
    const classes = ["action-menu-item"];
    if (action.danger) classes.push("danger");
    if (action.disabled) classes.push("disabled");
    return classes.join(" ");
  };

  const renderLink = (action: ActionItem, idx: number) => {
    const props: any = {
      key: idx,
      href: action.href,
      className: getItemClass(action),
      onClick: () => setOpen(false)
    };
    if (action.external) {
      props.target = "_blank";
      props.rel = "noopener noreferrer";
    }
    return React.createElement("a", props, action.label, action.external ? " ↗" : null);
  };

  const renderButton = (action: ActionItem, idx: number) => {
    return React.createElement("button", {
      key: idx,
      className: getItemClass(action),
      onClick: () => { action.onClick?.(); setOpen(false); },
      disabled: action.disabled
    }, action.label);
  };

  return (
    <div className="action-menu" ref={menuRef}>
      <button 
        className="action-menu-trigger"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        title="Actions"
      >
        ⋯
      </button>

      {open && (
        <div className="action-menu-dropdown">
          {actions.map((action, idx) => 
            action.href ? renderLink(action, idx) : renderButton(action, idx)
          )}
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
