import type { Contact } from "server/models";

export interface Model {
  contactSubmissionStatus: "success" | "error" | "submitting" | "";  // narrow to expected values
  lastSubmittedContact?: Contact;
}

export const init: Model = {
  contactSubmissionStatus: ""
};
