export type FieldErrorMap<T extends string> = Partial<Record<T, string>>;

export type FormSubmissionState = {
  busy: boolean;
  error: string | null;
  success: string | null;
};
