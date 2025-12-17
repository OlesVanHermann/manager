// ============================================================
// IDENTITY SELECTOR - Sélecteur d'identités multi-types
// Utilisé pour assigner des identités à une Policy IAM
// ============================================================

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { OvhCredentials } from "../../../../types/auth.types";
import { UserIdentities } from "./UserIdentities";
import { GroupIdentities } from "./GroupIdentities";
import { ServiceAccountIdentities } from "./ServiceAccountIdentities";
import { AccountIdentities } from "./AccountIdentities";

// ============ CONSTANTS ============

const IDENTITY_TYPE = {
  USER: "user",
  GROUP: "group",
  SERVICE_ACCOUNT: "oauth2_client",
  ACCOUNT: "account",
} as const;

// ============ TYPES ============

interface DecodedIdentity {
  type: string;
  id: string;
  urn: string;
}

interface IdentitySelectorProps {
  identities: string[];
  credentials: OvhCredentials;
  region?: string;
  readOnly?: boolean;
  onAdd: (urns: string[]) => void;
  onRemove: (urn: string) => void;
}

// ============ HELPERS ============

/** Décode un URN d'identité en type/id. Format: urn:v1:{region}:identity:{type}:{account}/{id} */
function decodeIdentityUrn(urn: string): DecodedIdentity {
  const parts = urn.split(":");
  if (parts.length < 6) {
    return { type: "unknown", id: urn, urn };
  }
  const typeAndId = parts.slice(4).join(":");
  const typePart = parts[4];
  let type = typePart;
  let id = parts.slice(5).join(":");

  if (typePart === "user" || typePart === "group") {
    const slashIdx = id.indexOf("/");
    if (slashIdx !== -1) {
      id = id.substring(slashIdx + 1);
    }
  } else if (typePart === "account") {
    type = IDENTITY_TYPE.ACCOUNT;
  } else if (typePart === "oauth2_client") {
    type = IDENTITY_TYPE.SERVICE_ACCOUNT;
  }

  return { type, id, urn };
}

// ============ COMPOSANT ============

/** Sélecteur d'identités avec 4 sections : utilisateurs, groupes, comptes de service, comptes OVH. */
export function IdentitySelector({
  identities,
  credentials,
  region = "EU",
  readOnly = false,
  onAdd,
  onRemove,
}: IdentitySelectorProps) {
  const { t } = useTranslation("iam/identities");

  // ---------- DECODE IDENTITIES ----------
  const decoded = useMemo(() => {
    const all = identities.map(decodeIdentityUrn);
    return {
      users: all.filter((i) => i.type === IDENTITY_TYPE.USER),
      groups: all.filter((i) => i.type === IDENTITY_TYPE.GROUP),
      serviceAccounts: all.filter((i) => i.type === IDENTITY_TYPE.SERVICE_ACCOUNT),
      accounts: all.filter((i) => i.type === IDENTITY_TYPE.ACCOUNT),
    };
  }, [identities]);

  // ---------- RENDER ----------
  return (
    <div className="identity-selector">
      <div className="selector-header">
        <h3>{t("title")}</h3>
        <p>{t("description")}</p>
      </div>

      <UserIdentities
        identities={decoded.users}
        credentials={credentials}
        readOnly={readOnly}
        onAdd={onAdd}
        onRemove={onRemove}
      />

      <GroupIdentities
        identities={decoded.groups}
        credentials={credentials}
        readOnly={readOnly}
        onAdd={onAdd}
        onRemove={onRemove}
      />

      <ServiceAccountIdentities
        identities={decoded.serviceAccounts}
        credentials={credentials}
        readOnly={readOnly}
        onRemove={onRemove}
      />

      <AccountIdentities
        identities={decoded.accounts}
        region={region}
        readOnly={readOnly}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </div>
  );
}

// Re-export pour usage externe
export { decodeIdentityUrn, IDENTITY_TYPE };
export type { DecodedIdentity };
