import mongoose, { ConnectionStates } from "mongoose";
import ReportModel, { Report } from "./Report";
import ContractModel, { Contract } from "./Contract";
import BlockchainModel, { Blockchain } from "./Blockchain";
import config from "../config";
import { Logger } from "tslog";

const log = new Logger();

async function connect(): Promise<void> {
  if (mongoose.connection.readyState !== ConnectionStates.connected) {
    log.info("Connecting to MongoDB...");
    await mongoose.connect(config.mongodb.uri);
  }
}

async function disconnect(): Promise<void> {
  if (mongoose.connection.readyState === ConnectionStates.connected) {
    log.info("Disconnecting from MongoDB...");
    await mongoose.connection.close();
  }
}

export { Report, Contract, Blockchain };
export default {
  Report: ReportModel,
  Contract: ContractModel,
  Blockchain: BlockchainModel,
  connect,
  disconnect,
};
