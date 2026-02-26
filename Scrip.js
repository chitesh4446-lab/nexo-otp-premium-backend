const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

let otpStore = {};

// ✅ Allowed email domains
const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];

// 🚫 Temp email domains block
const blockedDomains = [
  "tempmail.com",
  "10minutemail.com",
  "mailinator.com",
  "guerrillamail.com"
];

// 📧 Gmail transporter (App Password use karo)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chiteshkumar4446@gmail.com",        // 👈 apna gmail
    pass: "rfhymxhfgwenybip"            // 👈 jo abhi mila (without spaces)
  }
});

// Root test
app.get("/", (req, res) => {
  res.json({ status: "OTP Email Server Running 🚀" });
});

// SEND OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const domain = email.split("@")[1];

  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({ message: "Only Gmail, Yahoo, Outlook allowed" });
  }

  if (blockedDomains.includes(domain)) {
    return res.status(400).json({ message: "Temporary emails not allowed" });
  }

  const otp = crypto.randomInt(100000, 999999);
  otpStore[email] = {
    otp,
    createdAt: Date.now()
  };

  try {
    await transporter.sendMail({
      from: `"NEXO OTP" <YOUR_GMAIL@gmail.com>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `
    });

    res.json({ message: "OTP sent successfully 📧" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending email" });
  }
});

// VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (otpStore[email].otp == otp) {
    delete otpStore[email];
    return res.json({ message: "OTP verified successfully ✅" });
  }

  res.status(400).json({ message: "Invalid OTP ❌" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
