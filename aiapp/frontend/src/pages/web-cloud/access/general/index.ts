// ============================================================
// GENERAL INDEX - Page + Sous-modules exports
// ============================================================

// Default export: ConnectionsPage
export { default } from './ConnectionsPage';

// Sub-modules
export * from './modem';
export * from './line';
export * from './voip';

// Types
export * from './connections.types';

// Services
export * from './connections.service';
export * from './GeneralTab.service';
export * from './OptionsTab.service';
export * from './ServicesTab.service';
export * from './TasksTab.service';

// Tabs
export { default as GeneralTab } from './GeneralTab';
export { default as OptionsTab } from './OptionsTab';
export { default as ServicesTab } from './ServicesTab';
export { default as TasksTab } from './TasksTab';
