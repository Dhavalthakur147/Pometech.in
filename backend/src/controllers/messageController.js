import { createCrudController } from "./crudController.js";
import { createModel } from "../models/baseModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyAdminOfContact, sendEmail } from "../services/emailService.js";
import { logger } from "../utils/logger.js";

const messageModel = createModel("messages", ["name", "email", "phone", "Service", "message"]);
const crud = createCrudController(messageModel);

export const listMessages = crud.list;
export const deleteMessage = crud.remove;

async function processContactLead(lead) {
  const { service, ...databaseLead } = lead;
  const savedLead = {
    ...databaseLead,
    message: service && !databaseLead.message.toLowerCase().includes("service:")
      ? `Service: ${service}\n\n${databaseLead.message}`
      : databaseLead.message
  };

  const [emailResult, saveResult] = await Promise.allSettled([
    notifyAdminOfContact(lead),
    messageModel.create(savedLead)
  ]);

  if (emailResult.status === "rejected") {
    logger.error(`Contact lead email failed: ${emailResult.reason.message}`);
  }

  if (saveResult.status === "rejected") {
    logger.error(`Contact lead database save failed: ${saveResult.reason.message}`);
  }

  return {
    emailSent: emailResult.status === "fulfilled" && !emailResult.value?.skipped,
    emailSkipped: emailResult.status === "fulfilled" && Boolean(emailResult.value?.skipped),
    saved: saveResult.status === "fulfilled"
  };
}

export const saveContactForm = asyncHandler(async (req, res) => {
  const lead = { ...req.body, status: "unread" };
  const result = await processContactLead(lead);

  if (!result.emailSent && !result.saved) {
    res.status(500).json({
      success: false,
      message: "Unable to receive enquiry right now. Please contact us on WhatsApp.",
      whatsappLeadUrl: `https://wa.me/${process.env.WHATSAPP_PHONE || "919875294387"}`
    });
    return;
  }

  res.status(202).json({
    success: true,
    emailSent: result.emailSent,
    emailSkipped: result.emailSkipped,
    saved: result.saved,
    message: "Enquiry received. Our team will contact you soon.",
    whatsappLeadUrl: `https://wa.me/${process.env.WHATSAPP_PHONE || "919875294387"}`
  });
});

export const replyMessage = asyncHandler(async (req, res) => {
  const message = await messageModel.getById(req.params.id);
  if (message.email) {
    await sendEmail({ to: message.email, subject: req.body.subject, html: req.body.reply, text: req.body.reply });
  }
  const data = await messageModel.update(req.params.id, { status: "read", reply: req.body.reply });
  res.json({ success: true, data });
});
