import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(params: { to: string; subject: string; html: string }) {
    await this.transporter.sendMail({
      from: `"FloeHire" <${process.env.MAIL_FROM}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }
}
