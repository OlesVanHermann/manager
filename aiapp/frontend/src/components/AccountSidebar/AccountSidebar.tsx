import { useTranslation } from "react-i18next";
import type { OvhUser } from "../../types/auth.types";
import UserInfos from "./UserInfos";
import Shortcuts from "./Shortcuts";
import UsefulLinks from "./UsefulLinks";
import LanguageSelector from "../../i18n/LanguageSelector";
import "./styles.css";

interface AccountSidebarProps {
  user: OvhUser | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate?: (section: string, options?: { tab?: string }) => void;
}

export default function AccountSidebar({ user, isOpen, onClose, onLogout, onNavigate }: AccountSidebarProps) {
  const { t } = useTranslation('common');
  
  const handleNavigate = (section: string, options?: { tab?: string }) => {
    if (onNavigate) {
      onNavigate(section, options);
    }
    onClose();
  };

  return (
    <>
      {isOpen && <div className="account-sidebar-overlay" onClick={onClose} />}
      <div className={`account-sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="account-sidebar">
          <UserInfos user={user} />
          <Shortcuts onNavigate={handleNavigate} />
          <UsefulLinks />
          <div className="account-sidebar-footer">
            <LanguageSelector className="sidebar-language-selector" />
            <button onClick={onLogout} className="logout-btn">{t('actions.logout')}</button>
          </div>
        </div>
      </div>
    </>
  );
}
