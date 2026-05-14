import { createCrudController } from "./crudController.js";
import { createModel } from "../models/baseModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyAdminOfContact, sendEmail } from "../services/emailService.js";

const messageModel = createModel("messages", ["name", "email", "phone", "message", "status"]);
const crud = createCrudController(messageModel);

export const listMessages = crud.list;
export const deleteMessage = crud.remove;

export const saveContactForm = asyncHandler(async (req, res) => {
  const data = await messageModel.create({ ...req.body, status: "unread" });
  await notifyAdminOfContact(data);
  res.status(201).json({ success: true, data, whatsappLeadUrl: `https://wa.me/${process.env.WHATSAPP_PHONE || "919875294387"}` });
});

export const replyMessage = asyncHandler(async (req, res) => {
  const message = await messageModel.getById(req.params.id);
  if (message.email) {
    await sendEmail({ to: message.email, subject: req.body.subject, html: req.body.reply, text: req.body.reply });
  }
  const data = await messageModel.update(req.params.id, { status: "read", reply: req.body.reply });
  res.json({ success: true, data });
});
