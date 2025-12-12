import type { OvhUser } from "../../types/auth.types";
import UserInfos from "./UserInfos";
import Shortcuts from "./Shortcuts";
import UsefulLinks from "./UsefulLinks";
import "./styles.css";

interface AccountSidebarProps {
  user: OvhUser | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (target: string) => void;
}

export default function AccountSidebar({ user, isOpen, onClose, onLogout, onNavigate }: AccountSidebarProps) {
  const handleNavigate = (target: string) => {
    onNavigate(target);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="account-sidebar-overlay" onClick={onClose} />}
      <div className={`account-sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="account-sidebar">
          <UserInfos user={user} onLogout={onLogout} />
          <Shortcuts onNavigate={handleNavigate} />
          <UsefulLinks onNavigate={handleNavigate} />
        </div>
      </div>
    </>
  );
}
