interface Shortcut {
  id: string;
  label: string;
  target: "internal" | "external";
  section?: string;
  tab?: string;
  url?: string;
}

const shortcuts: Shortcut[] = [
  { id: "ALL_BILLS", label: "Voir mes factures", target: "internal", section: "home-billing", tab: "invoices" },
  { id: "PAYMENT_FOLLOW_UP", label: "Suivre mes paiements", target: "internal", section: "home-billing", tab: "payments" },
  { id: "ADD_PAYMENT_METHOD", label: "Ajouter un moyen de paiement", target: "internal", section: "home-billing", tab: "methods" },
  { id: "ALL_AGREEMENTS", label: "Voir mes contrats", target: "internal", section: "home-billing", tab: "contracts" },
  { id: "MANAGE_SERVICES", label: "Gerer mes services", target: "internal", section: "home-billing", tab: "services" },
  { id: "MANAGE_USERS", label: "Gerer mes utilisateurs", target: "internal", section: "iam" },
  { id: "ADD_CONTACT", label: "Ajouter un contact", target: "internal", section: "home-account", tab: "contacts-services" },
];

interface ShortcutsTileProps {
  onShortcutClick?: (shortcutId: string, section?: string, tab?: string) => void;
}

export default function ShortcutsTile({ onShortcutClick }: ShortcutsTileProps) {
  const handleClick = (shortcut: Shortcut, e: React.MouseEvent) => {
    e.preventDefault();
    if (shortcut.target === "internal" && onShortcutClick) {
      onShortcutClick(shortcut.id, shortcut.section, shortcut.tab);
    } else if (shortcut.target === "external" && shortcut.url) {
      window.open(shortcut.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="tile">
      <h2 className="tile-header">Raccourcis</h2>
      <div className="tile-content shortcuts-list">
        {shortcuts.map((shortcut) => (
          <a 
            key={shortcut.id} 
            href="#"
            className="shortcut-link"
            onClick={(e) => handleClick(shortcut, e)}
          >
            <span>{shortcut.label}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
