"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/auth-service";
import type {
  AuthResult,
  AuthState,
  AuthUser,
} from "../types/auth";

type AuthContextValue = AuthState & {
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (input: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>({
    configured: true,
    loading: true,
    authenticated: false,
    user: null,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await authService.session();
      setState({
        configured: data.configured !== false,
        loading: false,
        authenticated: data.authenticated,
        engine: data.engine as AuthState["engine"],
        authType: data.authType as AuthState["authType"],
        user: data.user,
        wallets: data.wallets ?? [],
      });
    } catch {
      setState(current => ({
        ...current,
        loading: false,
        authenticated: false,
        user: null,
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const data = await authService.signIn(email, password);
        setState(current => ({
          ...current,
          configured: true,
          loading: false,
          authenticated: true,
          user: data.user,
        }));
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error ? error.message : "Unable to sign in",
        };
      }
    },
    [],
  );

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      displayName: string;
    }): Promise<AuthResult> => {
      try {
        const data = await authService.signUp(input);
        if (data.user && !data.emailConfirmationRequired) {
          setState(current => ({
            ...current,
            configured: true,
            loading: false,
            authenticated: true,
            user: data.user,
          }));
        }
        return {
          ok: true,
          emailConfirmationRequired: data.emailConfirmationRequired,
        };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : "Unable to create account",
        };
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } finally {
      setState({
        configured: true,
        loading: false,
        authenticated: false,
        engine: state.engine,
        authType: null,
        user: null,
        wallets: [],
      });
    }
  }, [state.engine]);

  const forgotPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      try {
        const data = await authService.forgotPassword(email);
        return { ok: true, message: data.message };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : "Unable to send recovery email",
        };
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      refresh,
      signIn,
      signUp,
      signOut,
      forgotPassword,
    }),
    [state, refresh, signIn, signUp, signOut, forgotPassword],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
