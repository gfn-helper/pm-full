import nodemailer from "nodemailer";
import { config } from "../config/config.js";

export default async function mailSender(email, title, body) {
  try {

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.MAIL_SENDER,
        pass: config.APP_PASSWORD,
      }
    });

    let info = await transporter.sendMail({
      from: config.MAIL_SENDER,
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);

    return info;
  } catch (error) {
    console.log(error.message);
  }
};