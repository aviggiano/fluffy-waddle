import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { getSourceCode } from "./explorer";
import { verify } from "./warnings";

async function main(): Promise<void> {
  const code = await getSourceCode();
  console.log(verify(code));
}

const PORT = process.env.PORT || 3000;
express()
  .get("/", (_req: any, res: any) => res.send({ success: true }))
  .listen(PORT, async () => {
    console.log(`Listening to port ${PORT}`);
  });
