const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============================
// 🔐 Gmail Transport Setup
// ============================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chiteshkumar4446@gmail.com",      // 👈 yaha apna email daalna
    pass: "rfhymxhfgwenybip" // 👈 yaha Gmail App Password daalna
  }
});

// ============================
// 🧠 Temporary OTP Storage
// ============================

let otpStore = {};

// ============================
// 📩 Send OTP API
// ============================

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ message: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: "chiteshkumar4446@gmail.com", // 👈 same email yaha bhi
      to: email,
      subject: "Your NEXO OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `
    });

    console.log("OTP sent:", otp);

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.log(error);
    res.json({ message: "Error sending OTP" });
  }
});

// ============================
// ✅ Verify OTP API
// ============================

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ message: "OTP Verified ✅ Login Success" });
  } else {
    return res.json({ message: "Invalid OTP ❌" });
  }
});

app.get("/", (req, res) => {
  res.send("NEXO OTP Backend Running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
