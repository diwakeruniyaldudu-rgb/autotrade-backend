import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { SmartAPI } from "smartapi-javascript";
import { authenticator } from "otplib";

const app = express();

app.get("/", async (req, res) => {
  try {

    console.log("API KEY:", process.env.ANGEL_API_KEY);
    console.log("CLIENT:", process.env.ANGEL_CLIENT_CODE);
    console.log("PIN:", process.env.ANGEL_PIN);
    console.log("TOTP:", process.env.ANGEL_TOTP_SECRET);

    const smartApi = new SmartAPI({
      api_key: process.env.ANGEL_API_KEY
    });

    const otp = authenticator.generate(
      String(process.env.ANGEL_TOTP_SECRET)
    );

    console.log("OTP:", otp);

    const session = await smartApi.generateSession(
      String(process.env.ANGEL_CLIENT_CODE),
      String(process.env.ANGEL_PIN),
      otp
    );

    console.log(session);

    res.json(session);

  } catch (err) {
    console.log(err);
    res.json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
