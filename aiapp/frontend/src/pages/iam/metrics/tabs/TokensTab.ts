// ============================================================
// TOKENS TAB SERVICE - Service API isolé pour l'onglet Tokens
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Token } from "../metrics.types";

// ============================================================
// API TOKENS
// ============================================================

/** Récupère la liste des tokens d'un service. */
export async function getTokens(serviceName: string): Promise<Token[]> {
  const ids = await ovhGet<string[]>(`/metrics/${serviceName}/token`);
  const tokens = await Promise.all(
    ids.map((id) => ovhGet<Token>(`/metrics/${serviceName}/token/${id}`))
  );
  return tokens;
}

/** Récupère les détails d'un token. */
export async function getToken(serviceName: string, tokenId: string): Promise<Token> {
  return ovhGet<Token>(`/metrics/${serviceName}/token/${tokenId}`);
}

/** Crée un nouveau token. */
export async function createToken(
  serviceName: string,
  data: { description?: string; type: "read" | "write" }
): Promise<Token> {
  return ovhPost<Token>(`/metrics/${serviceName}/token`, data);
}

/** Révoque un token. */
export async function revokeToken(serviceName: string, tokenId: string): Promise<void> {
  return ovhDelete(`/metrics/${serviceName}/token/${tokenId}`);
}

// ============================================================
// HELPERS (isolés pour ce tab)
// ============================================================

/** Copie un texte dans le presse-papier. */
export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

// ============================================================
// SERVICE OBJECT (alternative export)
// ============================================================

export const tokensService = {
  getTokens,
  getToken,
  createToken,
  revokeToken,
  copyToClipboard,
};
