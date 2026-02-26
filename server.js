const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("NEXO OTP Backend Running 🚀");
});

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chiteshkumar4446@gmail.com",
    pass: "rfhymxhfgwenybip"   // 👈 YAHAN Gmail App Password daalna
  }
});

// Send OTP Route
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: "chiteshkumar4446@gmail.com",
      to: email,
      subject: "Your NEXO OTP Code",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Your OTP Code</h2>
          <h1 style="color:blue">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP sent to:", email);
    res.json({ message: "OTP sent successfully ✅" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to send OTP ❌" });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
