const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

let otpStore = {};

// ✅ Test route (VERY IMPORTANT — Almost live fix karega)
app.get("/", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

// Send OTP
app.post("/send-otp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const otp = crypto.randomInt(100000, 999999);

  otpStore[email] = {
    otp: otp,
    createdAt: Date.now()
  };

  console.log(`OTP for ${email}: ${otp}`);

  res.json({ message: "OTP generated", otp });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (otpStore[email].otp == otp) {
    delete otpStore[email];
    return res.json({ message: "OTP verified ✅" });
  }

  res.status(400).json({ message: "Invalid OTP ❌" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
