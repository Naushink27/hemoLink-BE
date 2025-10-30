import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: `"HemoLink Test" <${process.env.EMAIL_USER}>`,
  to: "yourpersonalemail@gmail.com",
  subject: "Testing Nodemailer",
  text: "This is a test email from HemoLink backend.",
})
.then(() => console.log("✅ Email sent successfully"))
.catch((err) => console.error("❌ Error:", err));
