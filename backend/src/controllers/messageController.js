import { createCrudController } from "./crudController.js";
import { createModel } from "../models/baseModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyAdminOfContact, sendEmail } from "../services/emailService.js";
import { verifyRecaptcha } from "../services/recaptchaService.js";
import { ApiError } from "../utils/apiError.js";
import { logger } from "../utils/logger.js";

const messageModel = createModel("messages", ["name", "email", "phone", "Service", "message"]);
const crud = createCrudController(messageModel);

export const listMessages = crud.list;
export const deleteMessage = crud.remove;

function buildSavedLead(lead) {
  const { service, website, startedAt, recaptchaToken, status, ...databaseLead } = lead;
  return {
    ...databaseLead,
    message: service && !databaseLead.message.toLowerCase().includes("service:")
      ? `Service: ${service}\n\n${databaseLead.message}`
      : databaseLead.message
  };
}

function sendContactEmailInBackground(lead) {
  notifyAdminOfContact(lead)
    .then((result) => {
      if (result?.skipped) logger.warn("Contact lead email skipped because SMTP is not configured.");
    })
    .catch((error) => logger.error(`Contact lead email failed: ${error.message}`));
}

export const saveContactForm = asyncHandler(async (req, res) => {
  const lead = { ...req.body, status: "unread" };

  if (lead.website) {
    throw new ApiError(400, "Unable to receive enquiry right now. Please try again.");
  }

  if (lead.startedAt && Date.now() - Number(lead.startedAt) < 2000) {
    throw new ApiError(400, "Please review the form and submit again.");
  }

  const captcha = await verifyRecaptcha(lead.recaptchaToken, req.ip);
  if (!captcha.success) {
    logger.warn(`Contact lead blocked by reCAPTCHA: ${captcha.reason || captcha.errors?.join(",") || "failed"}`);
    throw new ApiError(400, "Please complete the security check and try again.");
  }

  let saved = false;
  try {
    await messageModel.create(buildSavedLead(lead));
    saved = true;
  } catch (error) {
    logger.error(`Contact lead database save failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Unable to receive enquiry right now. Please contact us on WhatsApp.",
      whatsappLeadUrl: `https://wa.me/${process.env.WHATSAPP_PHONE || "919875294387"}`
    });
    return;
  }

  sendContactEmailInBackground(lead);

  res.status(202).json({
    success: true,
    emailQueued: true,
    saved,
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
