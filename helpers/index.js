const { MAIL_USER, MAIL_PASS } = process.env;

const nodemailer = require("nodemailer");

async function sendMail({ to, subject, html }) {
  try {
    const email = {
      from: "info@mycontacts.ua",
      to,
      subject,
      html,
    };

    console.log("Mail", MAIL_USER);

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const response = await transport.sendMail(email);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendMail,
};
