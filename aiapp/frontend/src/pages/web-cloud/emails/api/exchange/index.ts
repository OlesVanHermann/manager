// ============================================================
// API EXCHANGE - Microsoft Exchange OVH
// Avec endpoints 2API pour pagination serveur
// ============================================================

export * as accounts from "./accounts.api";
export * as redirections from "./redirections.api";
export * as lists from "./groups.api";        // Groups = distribution lists
export * as groups from "./groups.api";       // Alias explicite
export * as tasks from "./tasks.api";
export * as resources from "./resources.api"; // Exchange only
export * as audit from "./audit.api";         // Exchange only
export * as devices from "./devices.api";     // Exchange only
export * as disclaimers from "./disclaimers.api"; // Signatures
export * as service from "./service.api";     // Service-level 2API
export * as domains from "./domains.api";     // Gestion domaines
export * as externalContacts from "./externalContacts.api"; // Contacts externes
export * as order from "./order.api";         // Commandes (comptes, upgrade, etc.)
export * as mfa from "./mfa.api";             // MFA (MsServices)
