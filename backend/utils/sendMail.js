import transporter from "../config/nodemailer.js";

export const sendMail = async ({ to, subject, html }) => {
  try {
      if (!to) throw new Error("Recipient email is required");
      if (!subject) throw new Error("Email subject is required");
      if (!html) throw new Error("Email content is required");

      const mailOptions = {
          from: process.env.EMAIL,
          to,
          subject,
          html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      return info;
  } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
  }
};
  