

import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import app from "./app";

app.get("/", (_req: Request, res: Response) => {
  res.send("Starset server running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
