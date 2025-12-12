import type { OvhUser } from "../../types/auth.types";

interface ProfileTileProps {
  user: OvhUser | null;
}

// Capitaliser le niveau de support pour l'affichage
function formatSupportLevel(level: string | undefined): string {
  if (!level) return "Standard";
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

export default function ProfileTile({ user }: ProfileTileProps) {
  const supportLevel = formatSupportLevel(user?.supportLevel?.level);
  const customerCode = user?.customerCode || "-";

  return (
    <div className="tile">
      <h2 className="tile-header">Mon profil</h2>
      <div className="tile-content">
        <div className="profile-info">
          <div className="profile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className="profile-details">
            <div className="profile-name">
              <strong>{user?.firstname} {user?.name}</strong>
              <p className="profile-email">{user?.email}</p>
            </div>
            
            <dl className="profile-dl">
              <dt>Nichandle</dt>
              <dd>{user?.nichandle}</dd>
              <dt>Code client</dt>
              <dd>{customerCode}</dd>
            </dl>
            
            <p className="profile-support">
              Mon niveau de support : <span>{supportLevel}</span>
            </p>
          </div>
        </div>
        
        <div className="tile-footer">
          <a href="#/account/profile" className="btn btn-secondary">
            Editer mon profil
          </a>
        </div>
      </div>
    </div>
  );
}
