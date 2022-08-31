import dotenv from "dotenv";
dotenv.config();
// import express from "express";

import { downloadSourceCode } from "./explorer";
import { slither as runSlither } from "./tools/slither";
import { findSolidityVersion, selectSolidityVersion } from "./tools/solc";
import database, { IReport } from "./database";

async function main(): Promise<void> {
  await database.connect();
  const argv = require("minimist")(process.argv.slice(2), {
    string: ["contract"],
  });
  const { explorer, contract, download, slither } = argv;

  if (download) {
    await downloadSourceCode(explorer, contract, `/tmp/${contract}`);
  }
  if (slither) {
    const version = await findSolidityVersion(`/tmp/${contract}`);
    await selectSolidityVersion(version);
    const details = await runSlither(`/tmp/${contract}`);
    await database.Report.create<IReport>({
      contract,
      explorer,
      details,
      tool: "slither",
    });
  }
  console.log("Done");
}

// const PORT = process.env.PORT || 3000;
// express()
//   .get("/", (_req: any, res: any) => res.send({ success: true }))
//   .listen(PORT, async () => {
//     console.log(`Listening to port ${PORT}`);
//     main();
//   });

main();
