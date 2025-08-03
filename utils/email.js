const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Storage Management App" <${process.env.APP_USER}>`,
    to,
    subject,
    html,
  });
};
