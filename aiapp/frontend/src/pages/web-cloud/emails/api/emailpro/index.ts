// ============================================================
// API EMAIL PRO - Offre professionnelle OVH
// ============================================================

export * as accounts from "./accounts.api";
export * as redirections from "./redirections.api";
export * as tasks from "./tasks.api";

// Note: Email Pro n'a pas de mailing lists natives
// Pour lists, utiliser le fallback vers null dans le dispatcher
