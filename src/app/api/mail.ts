import nodemailer from "nodemailer";
import NodeMail from "nodemailer/lib/mailer";
import Mail from "./mails/Mail";
import Mustache from "mustache";

const transporter = nodemailer.createTransport(process.env.MAIL_URL);


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
