import { useTranslation } from 'react-i18next';
import type { OvhUser } from "../../types/auth.types";

interface UserInfosProps {
  user: OvhUser | null;
}

function getUserInitials(user: OvhUser | null): string {
  if (!user) return "??";
  const first = user.firstname?.[0]?.toUpperCase() || "";
  const last = user.name?.[0]?.toUpperCase() || "";
  return first + last || user.nichandle?.substring(0, 2).toUpperCase() || "??";
}

function getUserDisplayName(user: OvhUser | null): string {
  if (!user) return "";
  if (user.auth?.method && ["provider", "user"].includes(user.auth.method)) {
    return user.auth.user || `${user.firstname} ${user.name}`;
  }
  return `${user.firstname} ${user.name}`;
}

export default function UserInfos({ user }: UserInfosProps) {
  const { t } = useTranslation('navigation');

  const getSupportLevelLabel = (level: string | undefined): string => {
    if (!level) return t('userMenu.supportLevel.standard');
    const key = level.toLowerCase();
    return t(`userMenu.supportLevel.${key}`, { defaultValue: level });
  };

  const getUserRole = (): { label: string; isSubUser: boolean } => {
    const method = user?.auth?.method || "account";
    switch (method) {
      case "provider":
        return { label: "Provider SSO", isSubUser: true };
      case "user":
        return { label: t('userMenu.role.technical'), isSubUser: true };
      case "account":
      default:
        return { label: t('userMenu.role.admin'), isSubUser: false };
    }
  };

  const supportLevel = getSupportLevelLabel(user?.supportLevel?.level);
  const role = getUserRole();

  return (
    <div className="account-sidebar-user-infos">
      <div className="user-initials">{getUserInitials(user)}</div>
      <div className="user-name">{getUserDisplayName(user)}</div>
      <div className="user-role">
        <span className={`badge ${role.isSubUser ? "badge-info" : "badge-warning"}`}>
          {role.label}
        </span>
      </div>
      {user?.organisation && <p className="user-org">{user.organisation}</p>}
      <div className="user-details">
        <p className="user-email">{user?.email}</p>
        <p className="user-nichandle">{user?.nichandle}</p>
      </div>
      <div className="user-support-level">
        <span className="badge badge-primary">{supportLevel}</span>
      </div>
    </div>
  );
}
