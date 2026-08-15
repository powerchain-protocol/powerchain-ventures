export type CheckoutMessageTone =
  | "info"
  | "success"
  | "warning"
  | "danger";

export type CheckoutMessage = {
  id: string;
  title: string;
  body: string;
  tone:
    CheckoutMessageTone;
};
