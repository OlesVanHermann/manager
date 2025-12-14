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

function formatSupportLevel(level: string | undefined): string {
  if (!level) return "Standard";
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

function getUserRole(user: OvhUser | null): { label: string; isSubUser: boolean } {
  const method = user?.auth?.method || "account";
  switch (method) {
    case "provider":
      return { label: "Provider SSO", isSubUser: true };
    case "user":
      return { label: "Utilisateur", isSubUser: true };
    case "account":
    default:
      return { label: "Administrateur", isSubUser: false };
  }
}

export default function UserInfos({ user }: UserInfosProps) {
  const supportLevel = formatSupportLevel(user?.supportLevel?.level);
  const role = getUserRole(user);

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
