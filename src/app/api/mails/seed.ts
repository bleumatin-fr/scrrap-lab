import { connect } from "../db";
import Mail from "./Mail";

const defaultMails = [
  {
    key: "account-created",
    subject: "[CHUTOCOLLECTOR] Compte créé",
    html: `
    <p>Bonjour {{user.firstName}} {{user.lastName}},</p>
    <p>Votre compte a été créé.</p>
    <p>Vous pouvez initialiser votre compte en cliquant sur <a href="{{link}}">ce lien</a>.</p>`,
    text: `Bonjour {{user.firstName}} {{user.lastName}},
Votre compte a été créé.
Vous pouvez initialiser votre compte en cliquant sur ce lien: {{link}}.`,
  },
  {
    key: "recover",
    subject: "[CHUTOCOLLECTOR] Réinitialisation de mot de passe",
    html: `
    <p>Bonjour {{user.firstName}} {{user.lastName}},</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
    <p>Vous pouvez réinitialiser votre mot de passe en cliquant sur <a href="{{link}}">ce lien</a>.</p>`,
    text: `Bonjour {{user.firstName}} {{user.lastName}},
Vous avez demandé la réinitialisation de votre mot de passe.
Vous pouvez réinitialiser votre mot de passe en cliquant sur ce lien: {{link}}.`,
  },
];

const seed = async () => {
  await connect();

  for (const mail of defaultMails) {
    const existingMail = await Mail.findOne({
      key: mail.key,
    });
    if (!existingMail) {
      await Mail.create(mail);
    }
  }
};

export default seed;
