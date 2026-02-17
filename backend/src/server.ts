

import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import app from "./app";

app.get("/", (_req: Request, res: Response) => {
  res.send("Starset backend running");
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
