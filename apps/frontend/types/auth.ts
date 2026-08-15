import type {
  AccountWallet,
  AuthEngine,
  AccountAuthType,
} from "./accounts";

export type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | null;
};

export type AuthState = {
  configured: boolean;
  loading: boolean;
  authenticated: boolean;
  engine?: AuthEngine;
  authType?: AccountAuthType | null;
  user: AuthUser | null;
  wallets?: AccountWallet[];
};

export type AuthResult = {
  ok: boolean;
  message?: string;
  emailConfirmationRequired?: boolean;
};
