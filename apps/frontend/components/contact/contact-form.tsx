"use client";

import { useState } from "react";
import { submitContactAction } from "../../actions/contact-actions";
import type {
  ContactCategory,
  ContactFormValues,
} from "../../types/contact";
import { Button } from "../ui/button";
import { FieldGroup, Form, FormActions } from "../ui/forms";
import { Select } from "../ui/select";
import {
  FormField,
  TextAreaField,
} from "../ui/form-field";

const categories: readonly ContactCategory[] = [
  "Product question",
  "Launch support",
  "Technical issue",
  "Partnership",
  "Security",
  "Other",
];

const initial: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  subject: "Product question",
  message: "",
  website: "",
};

export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  function update<K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) {
    setValues(current => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);

    const result = await submitContactAction(values);
    setBusy(false);

    if (!result.ok) {
      setStatus({ kind: "error", message: result.message });
      return;
    }

    setStatus({ kind: "success", message: result.message });
    setValues(initial);
  }

  return (
    <Form className="contact-form" onSubmit={submit}>
      <FieldGroup columns={2}>
        <FormField
          name="name"
          label="Name"
          value={values.name}
          onChange={event => update("name", event.target.value)}
          autoComplete="name"
          maxLength={100}
          required
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={event => update("email", event.target.value)}
          autoComplete="email"
          maxLength={254}
          required
        />
      </FieldGroup>

      <FormField
        name="company"
        label="Company"
        value={values.company}
        onChange={event => update("company", event.target.value)}
        autoComplete="organization"
        maxLength={120}
        placeholder="Optional"
      />

      <Select
        name="subject"
        label="Topic"
        value={values.subject}
        onValueChange={value => update("subject", value)}
        options={categories.map(category => ({
          value: category,
          label: category,
        }))}
      />

      <TextAreaField
        name="message"
        label="Message"
        value={values.message}
        onChange={event => update("message", event.target.value)}
        rows={7}
        maxLength={4_000}
        hint={`${values.message.length}/4000`}
        required
      />

      <label className="contact-honeypot" aria-hidden="true">
        Website
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={event => update("website", event.target.value)}
        />
      </label>

      {status ? (
        <div
          className={`auth-alert ${status.kind === "error" ? "error" : "success"}`}
          role="status"
        >
          {status.message}
        </div>
      ) : null}

      <FormActions>
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? "Sending…" : "Send message"}
        </Button>
      </FormActions>

      <p className="contact-form-note">
        Do not send private keys, seed phrases, passwords, API keys, or other
        credentials through this form.
      </p>
    </Form>
  );
}
