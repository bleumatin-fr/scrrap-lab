import nodemailer from "nodemailer";
import NodeMail from "nodemailer/lib/mailer";
import Mail from "./mails/Mail";
import Mustache from "mustache";
import SMTPTransport from "nodemailer/lib/smtp-transport";

let extra = {} as SMTPTransport.Options;
if (process.env.MAIL_AUTH_USERNAME) {
  extra.auth = {
    user: process.env.MAIL_AUTH_USERNAME,
    pass: process.env.MAIL_AUTH_PASSWORD,
  };
}

if (process.env.MAIL_SECURE) {
  extra.secure = process.env.MAIL_SECURE === "true";
}

if (process.env.MAIL_TLS_CIPHERS || process.env.MAIL_TLS_REJECT_UNAUTHORIZED) {
  extra.tls = {};

  if (process.env.MAIL_TLS_CIPHERS) {
    extra.tls.ciphers = process.env.MAIL_TLS_CIPHERS;
  }

  if (process.env.MAIL_TLS_REJECT_UNAUTHORIZED) {
    extra.tls.rejectUnauthorized =
      process.env.MAIL_TLS_REJECT_UNAUTHORIZED === "true";
  }
}

if (process.env.MAIL_SECURE) {
  extra.secure = process.env.MAIL_SECURE === "true";
}

const transporter = nodemailer.createTransport({
  ...extra,
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "465"),
});

export const mail = async (key: string, data: any) => {
  const mailTemplate = await Mail.findOne({
    key,
  });
  if (!mailTemplate) {
    throw new Error(
      `No mail template found for ${key}. Please create a mail template with this key.`
    );
  }
  return {
    subject: Mustache.render(mailTemplate.subject, data),
    html: Mustache.render(mailTemplate.html, data),
    text: Mustache.render(mailTemplate.text, data),
  };
};

export const send = async (options: NodeMail.Options) => {
  if (!process.env.MAIL_URL) {
    console.log("SENDING EMAILS IS DISABLED");
    console.log(options);
    return;
  }
  await transporter.sendMail(options);
};
