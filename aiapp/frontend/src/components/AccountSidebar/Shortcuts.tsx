import { useTranslation } from "react-i18next";

interface Shortcut {
  id: string;
  labelKey: string;
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
      { id: "invoices", labelKey: "shortcuts.invoices", section: "home-billing", tab: "invoices" },
      { id: "payments", labelKey: "shortcuts.payments", section: "home-billing", tab: "payments" },
      { id: "orders", labelKey: "shortcuts.orders", section: "home-billing", tab: "orders" },
      { id: "services", labelKey: "shortcuts.services", section: "home-billing", tab: "services" },
      { id: "methods", labelKey: "shortcuts.methods", section: "home-billing", tab: "methods" },
      { id: "contracts", labelKey: "shortcuts.contracts", section: "home-billing", tab: "contracts" },
    ],
  },
  {
    id: "account",
    items: [
      { id: "profile", labelKey: "shortcuts.profile", section: "home-account", tab: "info" },
      { id: "password", labelKey: "shortcuts.password", section: "home-account", tab: "security" },
      { id: "security", labelKey: "shortcuts.security", section: "home-account", tab: "security" },
      { id: "kyc", labelKey: "shortcuts.kyc", section: "home-account", tab: "kyc" },
    ],
  },
  {
    id: "support",
    items: [
      { id: "create-ticket", labelKey: "shortcuts.createTicket", section: "home-support", tab: "create" },
      { id: "tickets", labelKey: "shortcuts.tickets", section: "home-support", tab: "tickets" },
    ],
  },
  {
    id: "api",
    items: [
      { id: "api", labelKey: "shortcuts.api", section: "home-api" },
    ],
  },
];

interface ShortcutsProps {
  onNavigate?: (section: string, options?: { tab?: string }) => void;
}

export default function Shortcuts({ onNavigate }: ShortcutsProps) {
  const { t } = useTranslation('common');

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
                <span>{t(shortcut.labelKey)}</span>
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
