import { contactService } from "../services/contact-service";
import type {
  ContactFormValues,
  ContactResult,
} from "../types/contact";

export async function submitContactAction(
  values: ContactFormValues,
): Promise<ContactResult> {
  try {
    return await contactService.send(values);
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to send your message",
    };
  }
}
