import type {
  ContactFormValues,
  ContactResult,
} from "../types/contact";
import {
  apiClient,
} from "./api-client";
import {
  API_ENDPOINTS,
} from "./endpoints";

export const contactService = {
  send(
    values: ContactFormValues,
  ): Promise<ContactResult> {
    return apiClient.post<
      ContactResult,
      ContactFormValues
    >(
      API_ENDPOINTS.contact,
      values,
      { timeoutMs: 12_000 },
    );
  },

  status() {
    return apiClient.get<{
      contact: {
        mailConfigured: boolean;
        maxMessageLength: number;
        categories: string[];
      };
    }>(
      API_ENDPOINTS.contact,
      { timeoutMs: 8_000 },
    );
  },
};
