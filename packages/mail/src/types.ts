export type EmailBrand = {
  productName: string;
  supportEmail: string;
  appUrl: string;
};

export type ContactEmailData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  requestId?: string;
};

export type AuthEmailKind =
  | "confirm-email"
  | "password-reset"
  | "security-notice";

export type AuthEmailData = {
  kind: AuthEmailKind;
  email: string;
  actionUrl?: string;
  displayName?: string;
  ipHint?: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};
