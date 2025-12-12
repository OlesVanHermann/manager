interface UsefulLink {
  id: string;
  label: string;
  url?: string;
  external?: boolean;
}

const links: UsefulLink[] = [
  { id: "help", label: "Centre d'aide", url: "https://help.ovhcloud.com/", external: true },
  { id: "status", label: "Etat du reseau et incidents", url: "https://www.status-ovhcloud.com/", external: true },
  { id: "tickets", label: "Mes demandes d'assistance" },
  { id: "create-ticket", label: "Creer un ticket" },
];

interface UsefulLinksProps {
  onNavigate: (linkId: string) => void;
}

export default function UsefulLinks({ onNavigate }: UsefulLinksProps) {
  return (
    <div className="account-sidebar-useful-links">
      <h3>Liens utiles</h3>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            {link.external ? (
              <a 
                href={link.url} 
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="external-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <button onClick={() => onNavigate(link.id)}>
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
