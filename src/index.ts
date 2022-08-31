import dotenv from "dotenv";
dotenv.config();
// import express from "express";

import { downloadSourceCode, Explorer } from "./explorer";
import {
  slither as runSlither,
  findSolidityVersion,
  selectSolidityVersion,
} from "./tools";

async function main(): Promise<void> {
  const argv = require("minimist")(process.argv.slice(2), {
    string: ["contract"],
  });
  const { explorer, contract, download, slither } = argv;

  if (download) {
    await downloadSourceCode(explorer, contract, `/tmp/${contract}`);
  }
  if (slither) {
    // const version = await findSolidityVersion(`/tmp/${contract}`);
    // await selectSolidityVersion(version);
    const report = await runSlither(`/tmp/${contract}`);
    await saveReport(contract);
  }
}

// const PORT = process.env.PORT || 3000;
// express()
//   .get("/", (_req: any, res: any) => res.send({ success: true }))
//   .listen(PORT, async () => {
//     console.log(`Listening to port ${PORT}`);
//     main();
//   });

main();
