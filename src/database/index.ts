import mongoose from "mongoose";
import Report, { IReport } from "./Report";
import config from "../config";

async function connect(): Promise<void> {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(config.mongodb.uri);
}

export { IReport };
export default { Report, connect };
