const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Gmail credentials from Firebase environment config
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendContactEmail = functions.https.onCall((data, context) => {
  const mailOptions = {
    from: gmailEmail,
    to: "twoseazcs@gmail.com",
    subject: `New Contact Form Submission from ${data.name}`,
    text: `
      Name: ${data.name}
      Company: ${data.companyName}
      Phone: ${data.phone}
      Email: ${data.email}
      Message: ${data.message}
    `,
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError("internal", "Unable to send email");
    });
});
