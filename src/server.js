import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();

app.listen(5000, () => {
  console.log(`Server listening on port 3000`);
});
