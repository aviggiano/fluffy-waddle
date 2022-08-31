import dotenv from "dotenv";
dotenv.config();

import { downloadSourceCode } from "./tools/explorer";
import { slither as runSlither } from "./tools/slither";
import { md5 as md5sum } from "./tools/md5";
import { findSolidityVersion, selectSolidityVersion } from "./tools/solc";
import database, { IReport } from "./database";

export async function cli(): Promise<void> {
  await database.connect();
  const argv = require("minimist")(process.argv.slice(2), {
    string: ["contract"],
  });
  const { explorer, contract, download, slither } = argv;

  if (download) {
    await downloadSourceCode(explorer, contract, `/tmp/${contract}`);
  }
  if (slither) {
    const md5 = await md5sum(`/tmp/${contract}`);
    console.log({ md5 });
    const report = await database.Report.findOne({ contract, explorer, md5 });
    if (!report) {
      const version = await findSolidityVersion(`/tmp/${contract}`);
      await selectSolidityVersion(version);
      const details = await runSlither(`/tmp/${contract}`);
      await database.Report.create<IReport>({
        contract,
        md5,
        explorer,
        details,
        tool: "slither",
      });
    }
  }
  console.log("Done");
  process.exit(0);
}
