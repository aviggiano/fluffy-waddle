import dotenv from "dotenv";
dotenv.config();

import { getSourceCode } from "./explorer";
import { verify } from "./warnings";

async function main(): Promise<void> {
  const code = await getSourceCode();
  console.log(verify(code));
}

main();
