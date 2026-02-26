const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

let otpStore = {};

// Root test
app.get("/", (req, res) => {
  res.send("NEXO OTP Backend Running 🚀");
});

// Email OTP send
app.post("/send-otp", async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.json({ message: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.chiteshkumar4446@gmail.com,
        pass: process.env.
      }rfhymxhfgwenybip
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your NEXO OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP Sent Successfully ✅" });

  } catch (err) {
    console.log(err);
    res.json({ message: "Error sending OTP ❌" });
  }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {

  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];
    res.json({ message: "Login Successful 🎉" });
  } else {
    res.json({ message: "Invalid OTP ❌" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
