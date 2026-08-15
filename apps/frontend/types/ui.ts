export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
};

export type AsyncState =
  | "idle"
  | "loading"
  | "success"
  | "error";
