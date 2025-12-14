interface Shortcut {
  id: string;
  label: string;
  section: string;
  tab?: string;
}

interface ShortcutGroup {
  id: string;
  items: Shortcut[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    id: "billing",
    items: [
      { id: "invoices", label: "Voir mes factures", section: "home-billing", tab: "invoices" },
      { id: "payments", label: "Verifier mes paiements", section: "home-billing", tab: "payments" },
      { id: "orders", label: "Suivre mes commandes", section: "home-billing", tab: "orders" },
      { id: "services", label: "Renouveller mes services", section: "home-billing", tab: "services" },
      { id: "methods", label: "Mes moyens de paiement", section: "home-billing", tab: "methods" },
      { id: "contracts", label: "Valider mes contrats", section: "home-billing", tab: "contracts" },
    ],
  },
  {
    id: "account",
    items: [
      { id: "profile", label: "Voir mon profil", section: "home-account", tab: "info" },
      { id: "password", label: "Changer mon mot de passe", section: "home-account", tab: "security" },
      { id: "security", label: "2FA, Restriction IP", section: "home-account", tab: "security" },
      { id: "kyc", label: "KYC Know Your Customer", section: "home-account", tab: "kyc" },
    ],
  },
  {
    id: "support",
    items: [
      { id: "create-ticket", label: "Creer un ticket support", section: "home-support", tab: "create" },
      { id: "tickets", label: "Voir mes tickets", section: "home-support", tab: "tickets" },
    ],
  },
  {
    id: "api",
    items: [
      { id: "api", label: "Playground API", section: "home-api" },
    ],
  },
];

interface ShortcutsProps {
  onNavigate?: (section: string, options?: { tab?: string }) => void;
}

export default function Shortcuts({ onNavigate }: ShortcutsProps) {
  const handleClick = (shortcut: Shortcut) => {
    if (onNavigate) {
      onNavigate(shortcut.section, shortcut.tab ? { tab: shortcut.tab } : undefined);
    }
  };

  return (
    <div className="account-sidebar-shortcuts">
      {shortcutGroups.map((group, groupIndex) => (
        <ul key={group.id} className={groupIndex > 0 ? "shortcut-group-separator" : ""}>
          {group.items.map((shortcut) => (
            <li key={shortcut.id}>
              <button onClick={() => handleClick(shortcut)}>
                <span>{shortcut.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="chevron-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
