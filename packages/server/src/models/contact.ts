import mongoose, { Document, Schema } from "mongoose";

// Contact interface - shape of a Contact document
export interface Contact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

// Mongoose schema for Contact
const contactSchema = new Schema<Contact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactModel = mongoose.model<Contact>("Contact", contactSchema, "contact_submissions");

export default ContactModel;



