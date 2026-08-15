import type { AuthResult } from "../types/auth";
import { authService } from "../services/auth-service";

export async function signInAction(
  email: string,
  password: string,
): Promise<AuthResult & { user?: Awaited<ReturnType<typeof authService.signIn>>["user"] }> {
  try {
    const result = await authService.signIn(email.trim(), password);
    return { ok: true, user: result.user };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to sign in",
    };
  }
}

export async function forgotPasswordAction(
  email: string,
): Promise<AuthResult> {
  try {
    const result = await authService.forgotPassword(email.trim());
    return { ok: true, message: result.message };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to send recovery email",
    };
  }
}
