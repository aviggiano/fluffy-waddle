import mongoose from "mongoose";
import Report, { IReport } from "./Report";
import Contract, { IContract } from "./Contract";
import Blockchain, { IBlockchain } from "./Blockchain";
import config from "../config";
import { Logger } from "tslog";

const log = new Logger();

async function connect(): Promise<void> {
  log.info("Connecting to MongoDB...");
  await mongoose.connect(config.mongodb.uri);
}

export { IReport, IContract, IBlockchain };
export default { Report, Contract, Blockchain, connect };
