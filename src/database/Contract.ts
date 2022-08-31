import * as mongoose from "mongoose";
import { Explorer } from "../tools/explorer";

export interface IContract {
  address: string;
  explorer: Explorer;

  name?: string;
  compiler?: string;
  version?: string;
  balance?: number;
  txns?: number;
  setting?: string;
  verified?: Date;
  audited?: string;
  license?: string;

  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema<IContract>(
  {
    address: {
      type: String,
      required: true,
    },
    explorer: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    compiler: {
      type: String,
    },
    version: {
      type: String,
    },
    balance: {
      type: Number,
    },
    txns: {
      type: Number,
    },
    setting: {
      type: String,
    },
    verified: {
      type: Date,
    },
    audited: {
      type: String,
    },
    license: {
      type: String,
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

const Contract = mongoose.model<IContract>("Contract", schema);

export default Contract;
