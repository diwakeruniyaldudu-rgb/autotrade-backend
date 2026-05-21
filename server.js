import dotenv from "dotenv";
dotenv.config();
import express from "express";
console.log(process.env.ANGEL_TOTP_SECRET);
const app = express();

app.get("/", (req, res) => {
  res.send("WORKING");
});

app.listen(3000, () => {
  console.log("Server running on 3000");
});
