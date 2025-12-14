import { useTranslation } from "react-i18next";
import type { OvhUser } from "../../../../types/auth.types";

interface ProfileTileProps {
  user: OvhUser | null;
  onEditProfile?: () => void;
}

export default function ProfileTile({ user, onEditProfile }: ProfileTileProps) {
  const { t } = useTranslation('home/account/index');
  const { t: tNav } = useTranslation('navigation');

  const getSupportLevelLabel = (level: string | undefined): string => {
    if (!level) return tNav('userMenu.supportLevel.standard');
    const key = level.toLowerCase();
    return tNav(`userMenu.supportLevel.${key}`, { defaultValue: level });
  };

  const supportLevel = getSupportLevelLabel(user?.supportLevel?.level);
  const customerCode = user?.customerCode || "-";

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEditProfile) {
      onEditProfile();
    }
  };

  return (
    <div className="tile">
      <h2 className="tile-header">{t('profile.title')}</h2>
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
              <dt>{t('profile.nichandle')}</dt>
              <dd>{user?.nichandle}</dd>
              <dt>{t('profile.customerCode')}</dt>
              <dd>{customerCode}</dd>
            </dl>
            
            <p className="profile-support">
              {t('profile.supportLevel')} : <span>{supportLevel}</span>
            </p>
          </div>
        </div>
        
        <div className="tile-footer">
          <button onClick={handleEditClick} className="btn btn-secondary">
            {t('profile.editButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
