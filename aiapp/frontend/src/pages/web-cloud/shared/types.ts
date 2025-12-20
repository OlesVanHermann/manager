// ============================================================
// WEB-CLOUD SHARED TYPES
// ============================================================

/** Item de service affiché dans la liste latérale. */
export interface ServiceItem {
  id: string;
  name: string;
  type?: string;
  status?: 'active' | 'suspended' | 'expired' | 'pending';
}

/** Props pour le composant ServiceListPage. */
export interface ServiceListPageProps {
  titleKey: string;
  descriptionKey: string;
  guidesUrl?: string;
  i18nNamespace: string;
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  selectedService: string | null;
  onSelectService: (id: string | null) => void;
  emptyIcon?: React.ReactNode;
  emptyTitleKey: string;
  emptyDescriptionKey: string;
  children?: React.ReactNode;
}

/** Props pour les tabs de détail. */
export interface DetailTabProps {
  serviceName: string;
}

/** Tâche OVH générique. */
export interface OvhTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'init' | 'todo';
  startDate: string;
  doneDate: string | null;
}
