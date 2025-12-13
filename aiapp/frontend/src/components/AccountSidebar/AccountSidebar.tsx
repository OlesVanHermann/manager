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
  onNavigate?: (pane: string) => void;
}

export default function AccountSidebar({ user, isOpen, onClose, onLogout }: AccountSidebarProps) {
  return (
    <>
      {isOpen && <div className="account-sidebar-overlay" onClick={onClose} />}
      <div className={`account-sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="account-sidebar">
          <UserInfos user={user} onLogout={onLogout} />
          <Shortcuts />
          <UsefulLinks />
        </div>
      </div>
    </>
  );
}
