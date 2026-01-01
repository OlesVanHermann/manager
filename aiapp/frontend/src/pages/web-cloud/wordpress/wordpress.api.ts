// ============================================================
// WORDPRESS API - Aligné 100% sur OLD_MANAGER
// Source: /home/ubuntu/manager/packages/manager/apps/web-hosting/src/data/api/managedWordpress.ts
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete, ovhIceberg, ovh2apiGet } from '../../../services/api';
import type {
  ManagedWordpressResource,
  ManagedWordpressWebsite,
  ManagedWordpressWebsiteDetails,
  PostCreatePayload,
  PostImportPayload,
  PostImportTaskPayload,
  WordPressTask,
  PHPVersion,
  AvailableLanguage,
} from './wordpress.types';

const BASE_PATH = '/managedCMS';

// ============================================================
// REFERENCE APIs
// ============================================================

/**
 * GET /managedCMS/reference/supportedPHPVersions?cms=WORDPRESS
 * Retourne les versions PHP supportées
 */
export async function getSupportedPHPVersions(): Promise<PHPVersion[]> {
  return ovh2apiGet<PHPVersion[]>(`${BASE_PATH}/reference/supportedPHPVersions`, { cms: 'WORDPRESS' });
}

/**
 * GET /managedCMS/reference/availableLanguages?cms=WORDPRESS
 * Retourne les langues disponibles pour WordPress
 */
export async function getAvailableLanguages(): Promise<AvailableLanguage[]> {
  return ovh2apiGet<AvailableLanguage[]>(`${BASE_PATH}/reference/availableLanguages`, { cms: 'WORDPRESS' });
}

// ============================================================
// RESOURCE APIs (conteneur de plan)
// ============================================================

/**
 * GET /managedCMS/resource
 * Liste toutes les resources (conteneurs de plan WordPress)
 */
export async function listResources(): Promise<ManagedWordpressResource[]> {
  return ovhGet<ManagedWordpressResource[]>(`${BASE_PATH}/resource`);
}

/**
 * GET /managedCMS/resource/{serviceName}
 * Détails d'une resource
 */
export async function getResource(serviceName: string): Promise<ManagedWordpressResource> {
  return ovhGet<ManagedWordpressResource>(`${BASE_PATH}/resource/${serviceName}`);
}

// ============================================================
// WEBSITE APIs (sites WordPress sous une resource)
// ============================================================

/**
 * GET /managedCMS/resource/{serviceName}/website
 * Liste les websites d'une resource (avec pagination Iceberg)
 */
export async function listWebsites(
  serviceName: string,
  options?: { pageSize?: number; cursor?: string; defaultFQDN?: string }
): Promise<{ data: ManagedWordpressWebsite[]; cursorNext?: string }> {
  const { pageSize = 25, cursor: _cursor, defaultFQDN } = options || {};

  // Construire les query params
  const params = new URLSearchParams();
  if (defaultFQDN) params.append('defaultFQDN', defaultFQDN);

  const queryString = params.toString();
  const path = `${BASE_PATH}/resource/${serviceName}/website${queryString ? `?${queryString}` : ''}`;

  // Utiliser Iceberg pour la pagination
  const result = await ovhIceberg<ManagedWordpressWebsite>(path, { pageSize });
  return {
    data: result.data,
    cursorNext: result.totalCount > result.data.length ? String(result.page + 1) : undefined,
  };
}

/**
 * GET /managedCMS/resource/{serviceName}/website - Version simple sans pagination
 * Pour charger tous les websites d'un coup
 */
export async function listAllWebsites(serviceName: string): Promise<ManagedWordpressWebsite[]> {
  const result = await ovhIceberg<ManagedWordpressWebsite>(
    `${BASE_PATH}/resource/${serviceName}/website`,
    { pageSize: 100 }
  );
  return result.data;
}

/**
 * GET /managedCMS/resource/{serviceName}/website/{websiteId}
 * Détails d'un website
 */
export async function getWebsite(
  serviceName: string,
  websiteId: string
): Promise<ManagedWordpressWebsiteDetails> {
  return ovhGet<ManagedWordpressWebsiteDetails>(
    `${BASE_PATH}/resource/${serviceName}/website/${websiteId}`
  );
}

/**
 * POST /managedCMS/resource/{serviceName}/website
 * Créer un nouveau website
 */
export async function createWebsite(
  serviceName: string,
  payload: PostCreatePayload
): Promise<{ id: string }> {
  return ovhPost<{ id: string }>(
    `${BASE_PATH}/resource/${serviceName}/website`,
    payload
  );
}

/**
 * POST /managedCMS/resource/{serviceName}/website
 * Importer un website existant (même endpoint, payload différent)
 */
export async function importWebsite(
  serviceName: string,
  payload: PostImportPayload
): Promise<{ id: string }> {
  return ovhPost<{ id: string }>(
    `${BASE_PATH}/resource/${serviceName}/website`,
    payload
  );
}

/**
 * DELETE /managedCMS/resource/{serviceName}/website/{websiteId}
 * Supprimer un website
 */
export async function deleteWebsite(
  serviceName: string,
  websiteId: string
): Promise<void> {
  return ovhDelete<void>(`${BASE_PATH}/resource/${serviceName}/website/${websiteId}`);
}

// ============================================================
// TASK APIs
// ============================================================

/**
 * GET /managedCMS/resource/{serviceName}/task
 * Liste les tâches d'une resource
 */
export async function listTasks(serviceName: string): Promise<WordPressTask[]> {
  return ovhGet<WordPressTask[]>(`${BASE_PATH}/resource/${serviceName}/task`);
}

/**
 * GET /managedCMS/resource/{serviceName}/task/{taskId}
 * Détails d'une tâche
 */
export async function getTask(serviceName: string, taskId: string): Promise<WordPressTask> {
  return ovhGet<WordPressTask>(`${BASE_PATH}/resource/${serviceName}/task/${taskId}`);
}

/**
 * PUT /managedCMS/resource/{serviceName}/task/{taskId}
 * Mettre à jour une tâche (utilisé pour l'import step 2)
 */
export async function updateTask(
  serviceName: string,
  taskId: string,
  payload: PostImportTaskPayload
): Promise<void> {
  return ovhPut<void>(
    `${BASE_PATH}/resource/${serviceName}/task/${taskId}`,
    payload
  );
}

// ============================================================
// EXPORT GROUPÉ
// ============================================================

export const wordpressApi = {
  // Reference
  getSupportedPHPVersions,
  getAvailableLanguages,

  // Resources
  listResources,
  getResource,

  // Websites
  listWebsites,
  listAllWebsites,
  getWebsite,
  createWebsite,
  importWebsite,
  deleteWebsite,

  // Tasks
  listTasks,
  getTask,
  updateTask,
};

export default wordpressApi;
