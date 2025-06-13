import { Contact } from "server/models";
export type ContactInput = Omit<Contact, "_id" | "createdAt">;


export type Msg =
  | ["contact/send", {
      name: string;
      email: string;
      subject: string;
      message: string;
    }]
  | ["contact/submit", { contact: ContactInput }]
  | ["contact/status", { status: "success" | "error" | "submitting" | "" }];
