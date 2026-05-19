import express from "express";
import dotenv from "dotenv";
import SmartAPI from "smartapi-javascript";
import { authenticator } from "otplib";

dotenv.config();

const app = express();
app.use(express.json());

const smartApi = new SmartAPI({
  api_key: String(process.env.ANGEL_API_KEY)
});

app.get("/", (req, res) => {
  res.send("Auto Trading Backend Running");
});

app.post("/webhook", async (req, res) => {
  try {

    const clientCode = String(process.env.ANGEL_CLIENT_CODE || "");
    const pin = String(process.env.ANGEL_PIN || "");
    const totpSecret = String(process.env.ANGEL_TOTP_SECRET || "");

    const otp = authenticator.generate(totpSecret);

    console.log("CLIENT:", clientCode);
    console.log("PIN:", pin);
    console.log("OTP:", otp);

    const session = await smartApi.generateSession(
      clientCode,
      pin,
      otp
    );

    console.log(session);

    smartApi.setAccessToken(session.data.jwtToken);

    const orderparams = {
      variety: "NORMAL",
      tradingsymbol: "SBIN-EQ",
      symboltoken: "3045",
      transactiontype: "BUY",
      exchange: "NSE",
      ordertype: "MARKET",
      producttype: "INTRADAY",
      duration: "DAY",
      quantity: "1"
    };

    const order = await smartApi.placeOrder(orderparams);

    res.json({
      success: true,
      order
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});

app.listen(3000, () => {
  console.log("Server running on 3000");
});
