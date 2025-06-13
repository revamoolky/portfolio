import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "contact/submit":
      submitContact(message[1], user).then((success) => {
        apply((model) => ({
          ...model,
          contactSubmissionStatus: success ? "success" : "error"
        }));
      });
      break;
    case "contact/status":
      apply((model) => ({
        ...model,
        contactSubmissionStatus: message[1].status
      }));
      break;
    default:
      throw new Error(`Unhandled message: ${message[0]}`);
  }
}

function submitContact(
  payload: { contact: any }, // or typed more strictly
  user: Auth.User
) {
  return fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.contact)
  }).then((res) => res.ok);
}
