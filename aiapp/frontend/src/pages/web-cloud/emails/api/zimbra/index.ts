// ============================================================
// API ZIMBRA - Offre collaborative OVH
// Avec endpoints API v2 pour pagination Iceberg native
// ============================================================

export * as accounts from "./accounts.api";
export * as redirections from "./redirections.api";
export * as tasks from "./tasks.api";
export * as aliases from "./aliases.api";
export * as service from "./service.api";  // Platform-level v2 API

// Note: Zimbra n'a pas de mailing lists dans l'API OVH actuelle
// Les fonctions *V2 utilisent l'API v2 avec pagination Iceberg
