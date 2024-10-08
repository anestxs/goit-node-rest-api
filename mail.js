import nodemailer from "nodemailer";
import "dotenv/config.js";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

function sendEmail(message) {
  return transport.sendMail(message);
}

export default { sendEmail };
