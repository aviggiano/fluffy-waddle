import mongoose from "mongoose";
import Report, { IReport } from "./Report";
import config from "../config";
import { Logger } from "tslog";

const log = new Logger();

async function connect(): Promise<void> {
  log.info("Connecting to MongoDB...");
  await mongoose.connect(config.mongodb.uri);
}

export { IReport };
export default { Report, connect };
