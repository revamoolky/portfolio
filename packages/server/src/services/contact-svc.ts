import ContactModel, { Contact } from "../models/contact";

// Service functions

async function index(): Promise<Contact[]> {
  return await ContactModel.find().exec();
}

async function get(id: string): Promise<Contact | null> {
  return await ContactModel.findById(id).exec();
}

async function create(contact: Contact): Promise<Contact> {
  const created = new ContactModel(contact);
  return await created.save();
}

async function update(id: string, data: Partial<Contact>): Promise<Contact | null> {
  return await ContactModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

async function remove(id: string): Promise<boolean> {
  const result = await ContactModel.findByIdAndDelete(id).exec();
  return result !== null;
}

export default { index, get, create, update, remove };
