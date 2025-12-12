import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthState, OvhCredentials, OvhUser } from "../types/auth.types";
import * as authService from "../services/auth.service";

const STORAGE_KEY = "ovh_credentials";

interface AuthContextType extends AuthState {
  login: (appKey: string, appSecret: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    credentials: null,
    error: null,
  });

  const login = useCallback(async (appKey: string, appSecret: string): Promise<string> => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      const response = await authService.requestCredential(appKey, appSecret, redirectUrl);

      const credentials: OvhCredentials = { 
        appKey, 
        appSecret, 
        consumerKey: response.consumerKey 
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));

      setState((s) => ({ ...s, isLoading: false }));
      return response.validationUrl;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Echec de connexion";
      setState((s) => ({ ...s, isLoading: false, error }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      credentials: null,
      error: null,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
