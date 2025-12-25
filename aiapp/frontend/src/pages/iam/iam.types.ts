// ============================================================
// IAM TYPES - Types partagés pour tous les tabs IAM (SEUL PARTAGE AUTORISÉ)
// ============================================================

/** Credentials OVH pour l'authentification API. */
export interface OvhCredentials {
  appKey: string;
  appSecret: string;
  consumerKey?: string;
}

/** Utilisateur IAM. */
export interface IamUser {
  login: string;
  email: string;
  creation: string;
  lastUpdate?: string;
  status: "ok" | "disabled" | "passwordChangeRequired";
  group?: string;
  description?: string;
}

/** Policy IAM. */
export interface IamPolicy {
  id: string;
  name: string;
  description?: string;
  identities: string[];
  resources: IamResource[];
  permissions: IamPermission;
  createdAt: string;
  updatedAt?: string;
  readOnly: boolean;
  owner: string;
}

/** Ressource IAM pour une policy. */
export interface IamResource {
  urn: string;
}

/** Permissions IAM. */
export interface IamPermission {
  allow?: IamAction[];
  deny?: IamAction[];
  except?: IamAction[];
}

/** Action IAM. */
export interface IamAction {
  action: string;
}

/** Groupe de ressources IAM. */
export interface IamResourceGroup {
  id: string;
  urn: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt?: string;
  readOnly: boolean;
  resources: IamGroupResource[];
}

/** Ressource dans un groupe IAM. */
export interface IamGroupResource {
  id: string;
  urn: string;
}
