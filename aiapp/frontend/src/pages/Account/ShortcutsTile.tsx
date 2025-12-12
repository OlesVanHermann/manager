interface Shortcut {
  id: string;
  label: string;
}

const shortcuts: Shortcut[] = [
  { id: "ALL_BILLS", label: "Voir mes factures" },
  { id: "PAYMENT_FOLLOW_UP", label: "Suivre mes paiements" },
  { id: "ADD_PAYMENT_METHOD", label: "Ajouter un moyen de paiement" },
  { id: "ALL_AGREEMENTS", label: "Voir mes contrats" },
  { id: "MANAGE_SERVICES", label: "Gerer mes services" },
  { id: "MANAGE_USERS", label: "Gerer mes utilisateurs" },
  { id: "ADD_CONTACT", label: "Ajouter un contact" },
];

interface ShortcutsTileProps {
  onShortcutClick?: (shortcutId: string) => void;
}

export default function ShortcutsTile({ onShortcutClick }: ShortcutsTileProps) {
  const handleClick = (shortcut: Shortcut, e: React.MouseEvent) => {
    e.preventDefault();
    if (onShortcutClick) {
      onShortcutClick(shortcut.id);
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
