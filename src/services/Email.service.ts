import nodemailer, { Transporter } from "nodemailer";
import { EMAIL_CONFIG, EMAIL_SETTING } from "../utils/types";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const {
  ORGANIZATION_EMAIL,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_HOST
} = process.env;
export class EmailService {
  private  transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly userConfig: EMAIL_CONFIG;
  constructor(config: EMAIL_CONFIG, setting?: EMAIL_SETTING) {
    this.userConfig = {
      ...config,
      from: `${ORGANIZATION_EMAIL}`
    };
    this.transporter = nodemailer
      .createTransport(setting ?? this.defaultSetting);
  }

  get defaultSetting(): EMAIL_SETTING {
    return {
      port: MAIL_PORT ? MAIL_PORT as unknown as number : 465,
      host: MAIL_HOST ? MAIL_HOST : "smtp.gmail.com",
      secure: true,
      auth: {
        user: `${ORGANIZATION_EMAIL}`,
        pass: `${MAIL_PASSWORD}`
      }
    };
  }

  async send(): Promise<string> {
    let errorMessage = "";
    try {
      await this.transporter.sendMail(this.userConfig);
    } catch (error: unknown) {
      errorMessage = "The email failed to be send";
    }
    return errorMessage;
  }
}
