import express from "express";
import axios from "axios";
import { SmartAPI } from "smartapi-javascript";
import { authenticator } from "otplib";

const app = express();

app.use(express.json());

const smartApi = new SmartAPI({
  api_key: process.env.ANGEL_API_KEY
});

app.get("/", (req, res) => {
  res.send("Auto Trading Backend Running");
});

app.post("/webhook", async (req, res) => {
  try {
console.log(process.env.ANGEL_CLIENT_CODE);
console.log(process.env.ANGEL_PIN);
console.log(process.env.ANGEL_TOTP_SECRET);
console.log(process.env.ANGEL_API_KEY);
const otp = authenticator.generate(process.env.ANGEL_TOTP_SECRET);
    const session = await smartApi.generateSession(
  process.env.ANGEL_CLIENT_CODE.trim(),
  process.env.ANGEL_PIN.trim(),
  otp
);

console.log("session", session);

if (!session.data) {
  return res.status(500).json({
    success: false,
    session
  });
}

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

    console.log(orderparams);
const order = await smartApi.placeOrder(orderparams);
console.log(order);
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
