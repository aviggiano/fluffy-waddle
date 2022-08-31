import * as mongoose from "mongoose";
import { Explorer } from "../explorer";
import { Tool } from "../tools";

export interface IReport {
  contract: string;
  explorer: Explorer;
  tool: Tool;
  details: string;
  md5: string;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema<IReport>(
  {
    contract: {
      type: String,
      required: true,
    },
    explorer: {
      type: String,
      required: true,
    },
    tool: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    md5: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>("Report", schema);

export default Report;
