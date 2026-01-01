// ============================================================
// API MXPLAN MODERN - MXPlan migré (nouvelle API)
// Base: /email/mxplan/{service}/*
// 2API: /sws/emailpro/{service}/* avec isMXPlan=true
//
// Note: Ce module gère le MXPlan "moderne" qui utilise l'API
// /email/mxplan. Pour le MXPlan legacy (/email/domain),
// voir le module mxplan/ (mxplan-legacy).
// ============================================================

export * as accounts from "./accounts.api";
export * as tasks from "./tasks.api";
export * as service from "./service.api";
export * as domains from "./domains.api";
export * as redirections from "./redirections.api";

// Note: MXPlan Modern n'a pas de mailing lists natives
// contrairement à MXPlan Legacy (/email/domain)
