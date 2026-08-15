export type ContactCategory =
  | "Product question"
  | "Launch support"
  | "Technical issue"
  | "Partnership"
  | "Security"
  | "Other";

export type ContactFormValues = {
  name: string;
  email: string;
  company: string;
  subject: ContactCategory;
  message: string;
  website: string;
};

export type ContactResult = {
  ok: boolean;
  message: string;
};
